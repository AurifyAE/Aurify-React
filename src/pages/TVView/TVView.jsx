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

  // Fetch admin ID and spot rates
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const fetchAdminData = async () => {
        try {
          const response = await axiosInstance.get(`/data/${userName}`);
          setAdminId(response.data.data._id);

          // Fetch spot rates immediately after getting admin ID
          if (response.data.data._id) {
            const spotratesResponse = await axiosInstance.get(
              `/spotrates/${response.data.data._id}`
            );
            if (spotratesResponse.data) {
              setSpreadMarginData(spotratesResponse.data);
              if (spotratesResponse.data.commodities) {
                setCommodities(spotratesResponse.data.commodities);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdminData();
    }
  }, []);

  // Utility functions
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

  return (
    <div className="bg-black h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-4xl font-bold text-[#D4AF37]">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
        <div className="text-3xl font-bold text-[#D4AF37]">
          AURIFY GOLD & DIAMONDS
        </div>
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
      </div>

      <div className="flex gap-4 h-full">
        {/* Left Column */}
        <div className="w-2/5 space-y-4">
          <div className="h-40">
            <img
              src={GoldBar}
              alt="Gold bars"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Spot Rate Card */}
          <div className="bg-[#1A1512] rounded-lg overflow-hidden">
            <div className="bg-[#D4AF37] p-3">
              <div className="flex justify-between text-black font-bold">
                <span>SPOT RATE</span>
                <div className="flex gap-8">
                  <span>$ BID oz</span>
                  <span>$ ASK oz</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Gold Section */}
              <div className="text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#D4AF37]">GOLD</span>
                  <div className="flex gap-8">
                    <span className="text-xl bg-[#2A2520] px-3 py-1 rounded">
                      {formatPrice(marketData.Gold?.bid || 0)}
                    </span>
                    <span className="text-xl bg-[#2A2520] px-3 py-1 rounded">
                      {formatPrice(
                        (marketData.Gold?.bid || 0) +
                          parseFloat(getSpreadOrMarginFromDB("Gold", "ask")) +
                          0.5
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-8 mt-2">
                  <span className="text-red-500">
                    Low {formatPrice(marketData.Gold?.low || 0)}
                  </span>
                  <span className="text-green-500">
                    High {formatPrice(marketData.Gold?.high || 0)}
                  </span>
                </div>
              </div>

              {/* Silver Section */}
              <div className="text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-300">
                    SILVER
                  </span>
                  <div className="flex gap-8">
                    <span className="text-xl bg-[#2A2520] px-3 py-1 rounded">
                      {formatPrice(marketData.Silver?.bid || 0)}
                    </span>
                    <span className="text-xl bg-[#2A2520] px-3 py-1 rounded">
                      {formatPrice(
                        (marketData.Silver?.bid || 0) +
                          parseFloat(getSpreadOrMarginFromDB("Silver", "ask")) +
                          0.05
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-8 mt-2">
                  <span className="text-red-500">
                    Low {formatPrice(marketData.Silver?.low || 0)}
                  </span>
                  <span className="text-green-500">
                    High {formatPrice(marketData.Silver?.high || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Sentiment Card */}
          <div className="bg-[#1A1512] rounded-lg overflow-hidden p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-500">BUYERS (56%)</span>
              <span className="text-green-500">+0.040%</span>
              <span className="text-red-500">SELLERS (44%)</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-red-500"
                style={{ width: "56%" }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Commodity Table */}
        <div className="flex-1">
          <div className="h-40 mb-4" />
          <div className="bg-[#1A1512] rounded-lg overflow-hidden">
            <div className="bg-[#D4AF37] p-3">
              <div className="grid grid-cols-5 text-black font-bold">
                <div>METAL</div>
                <div>PURITY</div>
                <div>WEIGHT</div>
                <div>SELL AED</div>
                <div>BUY AED</div>
              </div>
            </div>
            <div className="divide-y divide-gray-700">
              {isLoading ? (
                <div className="p-4 text-center text-white">Loading...</div>
              ) : commodities.length > 0 ? (
                commodities.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-5 p-4 text-white">
                    <div className="font-bold text-[#D4AF37]">{item.metal}</div>
                    <div>{item.purity}</div>
                    <div>{`${item.unit} ${item.weight}`}</div>
                    <div className="text-green-400">
                      {calculateUserSpotRatePrice(item, "sell")}
                    </div>
                    <div className="text-red-400">
                      {calculateUserSpotRatePrice(item, "buy")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-white">
                  No commodities available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="mt-4">
        <div className="bg-[#D4AF37] p-2 rounded-lg">
          <div className="flex items-center">
            <span className="font-bold px-4">Aurify Gold Updates</span>
            <motion.span
              className="whitespace-nowrap"
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
