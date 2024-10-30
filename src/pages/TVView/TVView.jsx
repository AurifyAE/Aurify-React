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

  // Function to fetch spot rates
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

  // Fetch server URL for socket connection
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

  // Socket connection for real-time market data
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

  // Initial fetch of admin ID and setup polling
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const fetchAdminData = async () => {
        try {
          const response = await axiosInstance.get(`/data/${userName}`);
          setAdminId(response.data.data._id);

          // Initial fetch of spot rates
          if (response.data.data._id) {
            await fetchSpotRates(response.data.data._id);
          }
        } catch (err) {
          console.error("Failed to fetch data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [fetchSpotRates]);

  // Set up polling for spot rates
  useEffect(() => {
    if (!adminId) return;

    // Fetch spot rates every 5 seconds
    const intervalId = setInterval(() => {
      fetchSpotRates(adminId);
    }, 5000); // 5 seconds interval

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [adminId, fetchSpotRates]);

  // Rest of your existing code remains the same...
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
      ).toFixed(4);
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

  const formatPrice = (price) => Number(price).toFixed(3);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get first 5 commodities for display
  const getDisplayedCommodities = useCallback(() => {
    return commodities.slice(0, 5);
  }, [commodities]);

  return (
    <div className="bg-gradient-to-b from-black to-[#1A1512] min-h-screen flex flex-col p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="bg-[#1A1512]/50 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
        <div className="flex flex-col">
          <div className="text-5xl font-bold text-[#D4AF37] font-digital tracking-wider">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="text-gray-400 text-sm">UAE Time</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-[#D4AF37] tracking-wider">
            AURIFY GOLD & DIAMONDS
          </div>
          <div className="text-gray-400 mt-1">Premium Bullion Dealer</div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-[#D4AF37]">
            {currentTime
              .toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .toUpperCase()}
          </div>
          <div className="text-gray-400 text-sm">Dubai, UAE</div>
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Left Column */}
        <div className="w-2/5 space-y-6">
          {/* Enhanced Image Card */}
          <div className="relative h-40 rounded-xl overflow-hidden group">
            <img
              src={GoldBar}
              alt="Gold bars"
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xl font-bold">Premium Gold Bars</div>
                <div className="text-sm text-gray-300">24K | 999.9 Purity</div>
              </div>
            </div>
          </div>

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
                <div className="flex gap-8 text-sm">
                  <span>$ BID oz</span>
                  <span>$ ASK oz</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Gold Section */}
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
                    <motion.span
                      className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold"
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
                    <motion.span
                      className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold"
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
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">24h Volume:</span>
                    <span className="text-sm">127.5K oz</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      <span className="text-sm text-red-500">
                        Low {formatPrice(marketData.Gold?.low || 0)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-sm text-green-500">
                        High {formatPrice(marketData.Gold?.high || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Silver Section */}
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
                    <motion.span
                      className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold"
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
                    <motion.span
                      className="text-xl bg-[#2A2520] px-4 py-2 rounded-lg font-semibold"
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
                          parseFloat(getSpreadOrMarginFromDB("Silver", "ask")) +
                          0.05
                      )}
                    </motion.span>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">24h Volume:</span>
                    <span className="text-sm">892.3K oz</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      <span className="text-sm text-red-500">
                        Low {formatPrice(marketData.Silver?.low || 0)}
                      </span>
                    </div>
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

          {/* Enhanced Market Sentiment Card */}
          <div className="bg-[#1A1512] rounded-xl overflow-hidden p-6">
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
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-1000"
                style={{ width: "56%" }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced Commodity Table */}
        <div className="flex-1 flex flex-col">
          <div className="h-40 mb-4" />
          <div className="bg-[#1A1512] rounded-xl overflow-hidden flex-1">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] p-4">
              <div className="grid grid-cols-4 text-black font-bold">
                <div>METAL</div>
                <div>WEIGHT</div>
                <div>SELL AED</div>
                <div>BUY AED</div>
              </div>
            </div>
            <div className="divide-y divide-gray-700/50">
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
                        {item.metal}
                      </span>
                      <span className="text-sm text-gray-400">
                        {item.purity}
                      </span>
                    </div>
                    <div className="flex items-center">{`${item.unit} ${item.weight}`}</div>
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
      </div>

      {/* Enhanced News Ticker */}
      <div className="mt-4">
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] rounded-xl overflow-hidden">
          <div className="flex items-center p-3">
            <div className="font-bold px-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Aurify Gold Updates
            </div>
            <motion.span
              className="whitespace-nowrap text-black/80"
              animate={{ x: [-1000, 1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              Gold Tests 1980 Real Record High Amid Rate Hikes...
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVView;
