import React, { createContext, useCallback, useContext, useState } from "react";
import axiosInstance from "../axios/axiosInstance";

const SpotRateContext = createContext();

export const SpotRateProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [spreadMarginData, setSpreadMarginData] = useState({});
  const [categoryId, setCategoryId] = useState(null);
  const [adminId, setAdminId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(3.674); // Default to AED
  const [currency, setCurrency] = useState("AED");
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

  const fetchData = useCallback(async () => {
    if (!categoryId || !adminId) return;

    try {
      // Clear previous data before fetching new data
      setMarketData({});
      setCommodities([]);
      setIsLoading(true);

      const response = await axiosInstance.get(
        `/spotrates/${adminId}/${categoryId}`
      );

      if (response.data) {
        setSpreadMarginData(response.data);

        if (response.data.commodities) {
          setCommodities(response.data.commodities);
        }

        if (response.data.marketData) {
          setMarketData(response.data.marketData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, adminId]);

  const updateMarketData = useCallback((newMarketData) => {
    setMarketData((prevData) => ({
      ...prevData,
      ...newMarketData,
    }));
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

  // Calculate sell price based on asking price and commodity details
  const calculateSellPrice = useCallback(
    (metal, commodity) => {
      const isGoldRelated =
        metal.toLowerCase().includes("gold") ||
        metal.toLowerCase().includes("minted bar");
      const metalAskingPrice = marketData[metal]?.bid
        ? parseFloat(marketData[metal].bid) +
          parseFloat(getSpreadOrMarginFromDB(metal, "bid")) +
          (isGoldRelated ? 0.5 : 0.05)
        : 0;

      return (
        metalAskingPrice +
        (commodity.sellPremium || 0) +
        (commodity.sellCharge || 0)
      );
    },
    [marketData, getSpreadOrMarginFromDB]
  );

  // const sellPrice = calculatePrice(metalAskingPrice, row, "sell");
  // const buyPrice = calculatePrice(metalBiddingPrice, row, "buy");
  // Calculate buy price based on bidding price and commodity details
  const calculateBuyPrice = useCallback(
    (metal, commodity) => {
      const metalBiddingPrice = marketData[metal]?.bid
        ? parseFloat(marketData[metal].bid)
        : 0;

      return (
        metalBiddingPrice -
        (commodity.buyPremium || 0) -
        (commodity.buyCharge || 0)
      );
    },
    [marketData]
  );

  const setAdminIdAndFetchData = useCallback(
    (id) => {
      setAdminId(id);
      if (categoryId) {
        fetchData();
      }
    },
    [categoryId, fetchData]
  );

  const setCategoryIdAndFetchData = useCallback(
    (id) => {
      setCategoryId(id);
      if (adminId) {
        fetchData();
      }
    },
    [adminId, fetchData]
  );

  const getNumberOfDigitsBeforeDecimal = useCallback((value) => {
    if (value === undefined || value === null) {
      return 0;
    }
    const valueStr = value.toString();
    const [integerPart] = valueStr.split(".");
    return integerPart.length;
  }, []);

  const calculatePrice = useCallback(
    (metalPrice, commodity, type) => {
      const unitMultiplier = getUnitMultiplier(commodity.weight);
      const digitsBeforeDecimal = getNumberOfDigitsBeforeDecimal(
        commodity.purity
      );
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
    [
      getUnitMultiplier,
      getNumberOfDigitsBeforeDecimal,
      getSpreadOrMarginFromDB,
      exchangeRate,
    ]
  );

  const calculateUserSpotRatePrice = useCallback(
    (commodity, type) => {
      const isGoldRelated =
        commodity.metal.toLowerCase().includes("gold") ||
        commodity.metal.toLowerCase().includes("minted bar");
      const metal = isGoldRelated ? "Gold" : commodity.metal || "Unknown";
      const metalPrice =
        marketData[metal] && marketData[metal].bid
          ? parseFloat(marketData[metal].bid)
          : 0;

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

  const updateCurrencyAndExchangeRate = useCallback(
    (newCurrency, newExchangeRate) => {
      setCurrency(newCurrency);
      setExchangeRate(newExchangeRate);
    },
    []
  );

  const value = {
    marketData,
    updateMarketData,
    commodities,
    spreadMarginData,
    getSpreadOrMarginFromDB,
    calculateSellPrice,
    calculateBuyPrice,
    categoryId,
    setCategoryId: setCategoryIdAndFetchData,
    adminId,
    setAdminId: setAdminIdAndFetchData,
    isLoading,
    fetchData,
    calculateUserSpotRatePrice, // Add this line
    exchangeRate,
    setExchangeRate,
    currency,
    setCurrency,
    updateCurrencyAndExchangeRate,
  };

  return (
    <SpotRateContext.Provider value={value}>
      {children}
    </SpotRateContext.Provider>
  );
};

export const useSpotRate = () => useContext(SpotRateContext);
