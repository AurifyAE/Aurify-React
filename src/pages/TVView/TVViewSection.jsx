import {
  Box,
  Card,
  CardContent,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { useSpotRate } from "../../context/SpotRateContext";

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
  const {
    marketData,
    commodities,
    categoryId,
    setCategoryId,
    isLoading,
    fetchData,
    adminId,
    setAdminId,
    calculateUserSpotRatePrice,
    getSpreadOrMarginFromDB,
    exchangeRate,
    currency,
  } = useSpotRate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [time, setTime] = useState(new Date());

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
  }, [adminId, setCategoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId, fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryId(category._id);
  };

  const renderSpotRate = (metal, data) => {
    const bidSpread = getSpreadOrMarginFromDB(metal, "bid");
    const askSpread = getSpreadOrMarginFromDB(metal, "ask");
    const bidPrice = parseFloat(data.bid) + bidSpread;
    const askPrice = bidPrice + askSpread + (metal === "Gold" ? 0.5 : 0.05);

    return (
      <Grid item xs={6}>
        <SpotRateCard>
          <CardContent>
            <Typography variant="h6" color="white">
              {metal}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="white">
                  BID
                </Typography>
                <Typography variant="h5" color="white">
                  ${bidPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="white">
                  LOW: ${data.low}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="white">
                  ASK
                </Typography>
                <Typography variant="h5" color="white">
                  ${askPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="white">
                  HIGH: ${data.high}
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

        <Typography variant="h5" color="white" gutterBottom mt={2}>
          SPOT RATE
        </Typography>
        <Grid container spacing={2}>
          {renderSpotRate("Gold", marketData.Gold || {})}
          {renderSpotRate("Silver", marketData.Silver || {})}
        </Grid>
        <TableContainer>
          <TableRow>
            <TableCell>
              <Typography variant="h6" color="white">
                COMMODITY
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" color="white">
                WEIGHT
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" color="white">
                BUY {currency}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" color="white">
                SELL {currency}
              </Typography>
            </TableCell>
          </TableRow>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography align="center" color="white">
                  Loading...
                </Typography>
              </TableCell>
            </TableRow>
          ) : commodities.length > 0 ? (
            commodities.map((commodity, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography color="white">
                    {commodity.metal} {commodity.purity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="white">
                    {commodity.unit}
                    {commodity.weight}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="white">
                    {calculateUserSpotRatePrice(commodity, "buy")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="white">
                    {calculateUserSpotRatePrice(commodity, "sell")}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography align="center" color="white">
                  No data available
                </Typography>
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
