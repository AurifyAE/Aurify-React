import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import GoldBar from "../../assets/GoldBar.jpg";
import axiosInstance from "../../axios/axiosInstance";

const TVView = () => {
  const [marketData, setMarketData] = useState({
    Gold: { bid: 0, ask: 0, low: 0, high: 0 },
    Silver: { bid: 0, ask: 0, low: 0, high: 0 },
  });
  const [commodities, setCommodities] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminId, setAdminId] = useState("");
  const [serverURL, setServerURL] = useState("");
  const [spreadMarginData, setSpreadMarginData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRate] = useState(3.674);
  const [newsData, setNewsData] = useState("");

  const fetchNews = useCallback(async (id) => {
    if (!id) return;
    try {
      const newsResponse = await axiosInstance.get(`/get-news/${id}`);
      if (newsResponse.data && newsResponse.data.success) {
        setNewsData(newsResponse.data.news.content || "No news available");
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNewsData("Failed to load news");
    }
  }, []);

  const fetchSpotRates = useCallback(async (id) => {
    if (!id) return;
    try {
      const spotratesResponse = await axiosInstance.get(`/spotrates/${id}`);
      if (spotratesResponse.data) {
        setSpreadMarginData(spotratesResponse.data);
        if (spotratesResponse.data.commodities) {
          setCommodities(spotratesResponse.data.commodities);
        }
      }
    } catch (err) {
      console.error("Failed to fetch spot rates:", err);
    }
  }, []);

  useEffect(() => {
    const fetchServerURL = async () => {
      try {
        const response = await axiosInstance.get("/server-url");
        if (response.data && response.data.selectedServerURL) {
          setServerURL(response.data.selectedServerURL);
        }
      } catch (error) {
        console.error("Error fetching serverURL:", error);
      }
    };
    fetchServerURL();
  }, []);

  useEffect(() => {
    if (!serverURL) return;
    const socketSecret = process.env.REACT_APP_SOCKET_SECRET;
    if (!socketSecret) {
      console.error("Socket secret is not defined");
      return;
    }
    const socket = io(serverURL, {
      query: { secret: socketSecret },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("request-data", ["GOLD", "SILVER"]);
    });

    socket.on("market-data", (data) => {
      if (data && data.symbol) {
        setMarketData((prevData) => ({
          ...prevData,
          [data.symbol]: {
            ...data,
            bidChanged:
              prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                ? data.bid > prevData[data.symbol].bid
                  ? "up"
                  : "down"
                : null,
          },
        }));
      }
    });

    return () => socket.disconnect();
  }, [serverURL]);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const fetchAdminData = async () => {
        try {
          const response = await axiosInstance.get(`/data/${userName}`);
          setAdminId(response.data.data._id);

          if (response.data.data._id) {
            await fetchSpotRates(response.data.data._id);
            await fetchNews(response.data.data._id);
          }
          console.log("news", fetchNews);
        } catch (err) {
          console.error("Failed to fetch data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [fetchSpotRates, fetchNews]);

  useEffect(() => {
    if (!adminId) return;
    const newsIntervalId = setInterval(() => {
      fetchNews(adminId);
    }, 30000);

    return () => clearInterval(newsIntervalId);
  }, [adminId, fetchNews]);

  useEffect(() => {
    if (!adminId) return;
    const intervalId = setInterval(() => {
      fetchSpotRates(adminId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [adminId, fetchSpotRates]);

  const getUnitMultiplier = useCallback((unit) => {
    const lowerCaseUnit = String(unit).toLowerCase();
    switch (lowerCaseUnit) {
      case "gram":
        return 1;
      case "kg":
        return 1000;
      case "oz":
        return 31.1034768;
      case "tola":
        return 11.664;
      case "ttb":
        return 116.64;
      default:
        return 1;
    }
  }, []);

  const getSpreadOrMarginFromDB = useCallback(
    (metal, type) => {
      const lowerMetal = metal.toLowerCase();
      const key = `${lowerMetal}${
        type.charAt(0).toUpperCase() + type.slice(1)
      }${type === "low" || type === "high" ? "Margin" : "Spread"}`;
      return spreadMarginData[key] || 0;
    },
    [spreadMarginData]
  );

  const calculatePrice = useCallback(
    (metalPrice, commodity, type) => {
      const unitMultiplier = getUnitMultiplier(commodity.weight);
      const digitsBeforeDecimal = (commodity.purity?.toString() || "").split(
        "."
      )[0].length;
      const premium =
        type === "sell" ? commodity.sellPremium : commodity.buyPremium;
      const charge =
        type === "sell" ? commodity.sellCharge : commodity.buyCharge;
      const metal = commodity.metal.toLowerCase().includes("gold")
        ? "Gold"
        : commodity.metal;
      const spread = parseFloat(
        getSpreadOrMarginFromDB(metal, type === "sell" ? "ask" : "bid")
      );

      return (
        ((metalPrice + spread + premium) / 31.103) *
          exchangeRate *
          commodity.unit *
          unitMultiplier *
          (parseInt(commodity.purity) / Math.pow(10, digitsBeforeDecimal)) +
        parseFloat(charge)
      ).toFixed(2);
    },
    [getUnitMultiplier, getSpreadOrMarginFromDB, exchangeRate]
  );

  const calculateUserSpotRatePrice = useCallback(
    (commodity, type) => {
      const isGoldRelated =
        commodity.metal.toLowerCase().includes("gold") ||
        commodity.metal.toLowerCase().includes("minted bar");
      const metal = isGoldRelated ? "Gold" : commodity.metal;
      const metalPrice = marketData[metal]?.bid || 0;

      const adjustedMetalPrice =
        type === "sell"
          ? metalPrice +
            parseFloat(getSpreadOrMarginFromDB(metal, "bid")) +
            (isGoldRelated ? 0.5 : 0.05)
          : metalPrice;

      return calculatePrice(adjustedMetalPrice, commodity, type);
    },
    [marketData, getSpreadOrMarginFromDB, calculatePrice]
  );

  const formatPrice = (price) => Number(price).toFixed(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDisplayedCommodities = useCallback(() => {
    return commodities.slice(0, 5);
  }, [commodities]);

  return (
    <div className="bg-black min-h-screen flex flex-col p-6 space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-4 gap-6 h-32">
        {/* Gold Bar Image with Animation */}
        <motion.div
          className="rounded-xl overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={GoldBar}
            alt="Gold bars"
            className="w-full h-full object-cover"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Time Section */}
        <div className="flex items-center justify-center">
          <div className="text-5xl font-bold text-[#C5A572]">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>

        {/* Company Section */}
        <div className="flex flex-col justify-center items-center">
          <div className="text-3xl font-bold text-[#C5A572]">
            AURIFY GOLD & DIAMONDS
          </div>
          <div className="text-sm text-[#C5A572]">Premium Bullion Dealer</div>
        </div>

        {/* Date Section */}
        <div className="flex flex-col justify-center items-end">
          <div className="text-2xl font-bold text-[#C5A572]">
            {currentTime
              .toLocaleDateString("en-GB", { weekday: "long" })
              .toUpperCase()}
          </div>
          <div className="text-xl font-bold text-[#C5A572]">
            {currentTime
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "")
              .toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-5 gap-6 flex-1">
        {/* Left Column - Spot Rate and Market Sentiment (40%) */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Enhanced Spot Rate Card */}
          <div className="bg-[#1A1512] rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] p-4">
              <div className="flex justify-between text-black font-bold items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">SPOT RATE</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>
                <div className="flex gap-16 text-lg">
                  <span>$ BID oz</span>
                  <span>$ ASK oz</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-8">
              {/* Gold Section - Reorganized */}
              <div className="text-white">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#D4AF37]">
                      GOLD
                    </span>
                    <span className="text-xs text-gray-400">
                      Live Market Price
                    </span>
                  </div>
                  <div className="flex gap-8">
                    {/* Bid Column */}
                    <div className="flex flex-col items-center">
                      <motion.span
                        className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold mb-2"
                        animate={{
                          backgroundColor:
                            marketData.Gold?.bidChanged === "up"
                              ? ["#2A2520", "#1f3a1f", "#2A2520"]
                              : marketData.Gold?.bidChanged === "down"
                              ? ["#2A2520", "#3a1f1f", "#2A2520"]
                              : "#2A2520",
                        }}
                      >
                        {formatPrice(marketData.Gold?.bid || 0)}
                      </motion.span>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm text-red-500">
                          Low {formatPrice(marketData.Gold?.low || 0)}
                        </span>
                      </div>
                    </div>
                    {/* Ask Column */}
                    <div className="flex flex-col items-center">
                      <motion.span
                        className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold mb-2"
                        animate={{
                          backgroundColor:
                            marketData.Gold?.bidChanged === "up"
                              ? ["#2A2520", "#1f3a1f", "#2A2520"]
                              : marketData.Gold?.bidChanged === "down"
                              ? ["#2A2520", "#3a1f1f", "#2A2520"]
                              : "#2A2520",
                        }}
                      >
                        {formatPrice(
                          (marketData.Gold?.bid || 0) +
                            parseFloat(getSpreadOrMarginFromDB("Gold", "ask")) +
                            0.5
                        )}
                      </motion.span>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-green-500">
                          High {formatPrice(marketData.Gold?.high || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Silver Section - Reorganized */}
              <div className="text-white border-t border-gray-800 pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-300">
                      SILVER
                    </span>
                    <span className="text-xs text-gray-400">
                      Live Market Price
                    </span>
                  </div>
                  <div className="flex gap-8">
                    {/* Bid Column */}
                    <div className="flex flex-col items-center">
                      <motion.span
                        className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold mb-2"
                        animate={{
                          backgroundColor:
                            marketData.Silver?.bidChanged === "up"
                              ? ["#2A2520", "#1f3a1f", "#2A2520"]
                              : marketData.Silver?.bidChanged === "down"
                              ? ["#2A2520", "#3a1f1f", "#2A2520"]
                              : "#2A2520",
                        }}
                      >
                        {formatPrice(marketData.Silver?.bid || 0)}
                      </motion.span>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm text-red-500">
                          Low {formatPrice(marketData.Silver?.low || 0)}
                        </span>
                      </div>
                    </div>
                    {/* Ask Column */}
                    <div className="flex flex-col items-center">
                      <motion.span
                        className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold mb-2"
                        animate={{
                          backgroundColor:
                            marketData.Silver?.bidChanged === "up"
                              ? ["#2A2520", "#1f3a1f", "#2A2520"]
                              : marketData.Silver?.bidChanged === "down"
                              ? ["#2A2520", "#3a1f1f", "#2A2520"]
                              : "#2A2520",
                        }}
                      >
                        {formatPrice(
                          (marketData.Silver?.bid || 0) +
                            parseFloat(
                              getSpreadOrMarginFromDB("Silver", "ask")
                            ) +
                            0.05
                        )}
                      </motion.span>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-green-500">
                          High {formatPrice(marketData.Silver?.high || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Sentiment Card - Updated with website URL */}
          <div className="bg-[#1A1512] rounded-xl overflow-hidden p-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">BUYERS</span>
                <span className="text-sm bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                  56%
                </span>
                <span className="text-xs text-green-500">+0.040%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">SELLERS</span>
                <span className="text-sm bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                  44%
                </span>
              </div>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-1000"
                style={{ width: "56%" }}
              />
            </div>
            <div className="text-center mt-4">
              <a
                href="https://www.aurifygold.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#E5C158] transition-colors duration-200 text-sm font-semibold"
              >
                www.aurifygold.net
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Commodity Table (60%) */}
        <div className="col-span-3 bg-[#1A1512] rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] p-4">
            <div className="grid grid-cols-4 text-black font-bold">
              <div>METAL</div>
              <div>WEIGHT</div>
              <div>SELL AED</div>
              <div>BUY AED</div>
            </div>
          </div>
          <div className="divide-y divide-gray-700/50 h-[calc(100%-3.5rem)] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37] border-r-2 border-b-2 border-gray-800"></div>
                <div className="text-gray-400 mt-4">
                  Loading commodity data...
                </div>
              </div>
            ) : commodities.length > 0 ? (
              getDisplayedCommodities().map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 p-6 text-white hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-[#D4AF37]">
                      {`${item.metal}  ${item.purity}`}
                    </span>
                  </div>
                  <div className="flex items-center">{`${item.unit}  ${item.weight}`}</div>
                  <div className="text-green-400 font-medium">
                    {calculateUserSpotRatePrice(item, "sell")}
                  </div>
                  <div className="text-red-400 font-medium">
                    {calculateUserSpotRatePrice(item, "buy")}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                No commodities available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] rounded-xl overflow-hidden">
        <div className="flex items-center p-3">
          <div className="font-bold px-4 flex items-center gap-2 text-black">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Aurify Gold Updates
          </div>
          <motion.span
            className="whitespace-nowrap text-black/80"
            animate={{ x: [-1000, 1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {newsData || "Loading news..."}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default TVView;
