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
  const { goldData, silverData } = useSpotRate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [commodityData, setCommodityData] = useState([]);
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
            if (response.data.categories.length > 0) {
              setSelectedCategory(response.data.categories[0].name);
            }
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [adminId]);

  useEffect(() => {
    const fetchCommodityData = async () => {
      try {
        const response = await axiosInstance.get("/getCommodityData");
        setCommodityData(response.data);
      } catch (error) {
        console.error("Error fetching commodity data:", error);
      }
    };
    fetchCommodityData();

    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const renderSpotRate = (metal, data) => (
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
                ${data.bid}
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
                ${data.ask}
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
                    selectedCategory === category.name ? "#1976d2" : "#333",
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#444" },
                }}
                onClick={() => setSelectedCategory(category.name)}
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

        <ClockContainer>
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
        </ClockContainer>

        <Typography variant="h5" color="white" gutterBottom mt={2}>
          SPOT RATE
        </Typography>
        <Grid container spacing={2}>
          {renderSpotRate("GOLD Oz", goldData)}
          {renderSpotRate("SILVER Oz", silverData)}
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
          {commodityData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography>{item.commodity}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{item.weight}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{item.buy}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{item.sell}</Typography>
              </TableCell>
            </TableRow>
          ))}
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
