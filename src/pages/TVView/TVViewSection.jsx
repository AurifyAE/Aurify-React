import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import axiosInstance from "../../axios/axiosInstance";

const StyledCard = styled(Card)({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  marginBottom: "16px",
});

const TableContainer = styled(Box)({
  backgroundColor: "#004d40",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
});

const TableRow = styled(Box)({
  display: "flex",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  "&:last-child": {
    borderBottom: "none",
  },
});

const TableCell = styled(Box)({
  flex: 1,
  padding: "12px 8px",
  color: "white",
});

const SpotRateCard = styled(Card)({
  backgroundColor: "rgba(240, 230, 140, 0.1)",
  marginBottom: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const ClockContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  marginBottom: "16px",
});

const Clock = styled(Box)({
  textAlign: "center",
});

const ClockCircle = styled(Box)({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "8px auto",
});

const TVView = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [time, setTime] = useState(new Date());
  const [adminId, setAdminId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverURL, setServerURL] = useState("");
  const [symbols, setSymbols] = useState(["GOLD", "SILVER"]);
  const [spreadMarginData, setSpreadMarginData] = useState({});
  const [error, setError] = useState({});
  const [exchangeRate, setExchangeRate] = useState(3.674);
  const [currency, setCurrency] = useState("AED");

  useEffect(() => {
    const fetchServerURL = async () => {
      try {
        const response = await axiosInstance.get("/server-url");
        if (response.data && response.data.selectedServerURL) {
          setServerURL(response.data.selectedServerURL);
        } else {
          console.error("selectedServerURL not found in response");
        }
      } catch (error) {
        console.error("Error fetching serverURL:", error);
      }
    };

    fetchServerURL();
  }, []);

  useEffect(() => {
    if (!serverURL) {
      return;
    }

    const socketSecret = process.env.REACT_APP_SOCKET_SECRET;

    if (!socketSecret) {
      console.error("Socket secret is not defined in environment variables");
      return;
    }

    const socket = io(serverURL, {
      query: { secret: socketSecret },
      transports: ["websocket"],
      debug: true,
    });

    socket.on("connect", () => {
      socket.emit("request-data", symbols);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("market-data", (data) => {
      if (data && data.symbol) {
        setMarketData((prevData) => {
          const newData = {
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
          };
          return newData;
        });
      } else {
        console.error("Received invalid market data:");
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [symbols, serverURL]);

  // Debug log for marketData
  useEffect(() => {}, [marketData]);
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      const fetchAdminId = async () => {
        try {
          const response = await axiosInstance.get(`/data/${userName}`);
          setAdminId(response.data.data._id);
        } catch (err) {
          console.error("Failed to fetch user data: " + err);
        }
      };
      fetchAdminId();
    }
  }, []);

  useEffect(() => {
    if (adminId) {
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get(`/getCategories/${adminId}`);
          if (response.data.success) {
            setCategories(response.data.categories);
            if (response.data.categories.length > 0 && !selectedCategory) {
              setSelectedCategory(response.data.categories[0]);
              setCategoryId(response.data.categories[0]._id);
            }
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [adminId, selectedCategory]);

  const fetchData = useCallback(async () => {
    if (!categoryId || !adminId) return;

    try {
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

  useEffect(() => {
    if (categoryId && adminId) {
      fetchData();
    }
  }, [categoryId, adminId, fetchData]);

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryId(category._id);
  };

  const renderSpotRate = (metal) => {
    const capitalizedMetal =
      metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase();
    const bidSpread = parseFloat(
      getSpreadOrMarginFromDB(capitalizedMetal, "bid")
    ).toFixed(2);
    const askSpread = parseFloat(
      getSpreadOrMarginFromDB(capitalizedMetal, "ask")
    ).toFixed(2);

    const baseBidPrice = parseFloat(marketData[capitalizedMetal]?.bid) || 0;
    const bidPrice = (parseFloat(baseBidPrice) + parseFloat(bidSpread)).toFixed(
      2
    );

    const baseAskPrice = parseFloat(bidPrice) || 0;
    const askAdjustment = capitalizedMetal === "Gold" ? 0.5 : 0.05;
    const askPrice = (
      parseFloat(baseAskPrice) +
      parseFloat(askSpread) +
      parseFloat(askAdjustment)
    ).toFixed(2);
    return (
      <Grid item xs={6}>
        <SpotRateCard>
          <CardContent>
            <Typography variant="h6" color="white">
              {metal.toUpperCase()}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="white">
                  BID
                </Typography>
                <Typography variant="h5" color="white">
                  ${bidPrice}
                </Typography>
                <Typography variant="body2" color="white">
                  LOW: $
                  {marketData[
                    metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase()
                  ]?.low || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="white">
                  ASK
                </Typography>
                <Typography variant="h5" color="white">
                  ${askPrice || "N/A"}
                </Typography>
                <Typography variant="body2" color="white">
                  HIGH: $
                  {marketData[
                    metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase()
                  ]?.high || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </SpotRateCard>
      </Grid>
    );
  };

  return (
    <Box display="flex" bgcolor="#2F1B12" height="100vh" overflow="hidden">
      {/* Left half - Categories */}
      <Box width="30%" p={3} overflow="auto">
        <Typography variant="h4" color="white" mb={3}>
          Categories
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card
                sx={{
                  bgcolor:
                    selectedCategory && selectedCategory._id === category._id
                      ? "#1976d2"
                      : "#333",
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#444" },
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right half - TV View */}
      <Box
        width="70%"
        p={3}
        overflow="auto"
        sx={{ backgroundColor: "#004d40" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" color="white">
            AURIFY GOLD & DIAMOND
          </Typography>
          <Box bgcolor="#444" p={1} borderRadius={2}>
            <Typography variant="h6" color="white">
              {time.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Box>

        {/* <ClockContainer>
          {["INDIA", "LONDON", "NEW YORK"].map((city) => (
            <Clock key={city}>
              <Typography variant="h6" color="white">
                {city}
              </Typography>
              <ClockCircle>
                <Typography variant="body1" color="black">
                  {time.toLocaleTimeString("en-US", {
                    timeZone:
                      city === "INDIA"
                        ? "Asia/Kolkata"
                        : city === "LONDON"
                        ? "Europe/London"
                        : "America/New_York",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Typography>
              </ClockCircle>
            </Clock>
          ))}
        </ClockContainer> */}

        <Typography variant="h5" color="white" gutterBottom mt={2}>
          SPOT RATE
        </Typography>
        <Grid container spacing={2}>
          {renderSpotRate("gold")}
          {renderSpotRate("silver")}
        </Grid>
        <TableContainer>
          <TableRow>
            <TableCell>
              <Typography variant="h6">COMMODITY</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">WEIGHT</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">BUY AED</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">SELL AED</Typography>
            </TableCell>
          </TableRow>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Skeleton variant="rectangular" height={40} />
              </TableCell>
            </TableRow>
          ) : commodities.length > 0 ? (
            commodities.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography>
                    {item.metal} {item.purity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{item.weight}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {calculateUserSpotRatePrice(item, "buy")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {calculateUserSpotRatePrice(item, "sell")}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography align="center">No data available</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableContainer>
        <Box position="absolute" bottom={10} left="50%" right={10}>
          <Typography variant="h6" color="white" align="center">
            AURIFY NEWS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TVView;
