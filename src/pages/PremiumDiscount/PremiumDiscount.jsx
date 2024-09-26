import { Add as AddIcon } from "@mui/icons-material";
import {
  Alert,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";

const theme = createTheme({
  palette: {
    primary: { main: "#8a3dd1" },
    secondary: { main: "#ff339a" },
  },
  typography: { fontFamily: "Open Sans, sans-serif" },
});

const PremiumDiscount = () => {
  const [PremiumDiscounts, setPremiumDiscounts] = useState([]);
  const [PremiumDiscountType, setPremiumDiscountType] = useState("Premium");
  const [PremiumDiscountValue, setPremiumDiscountValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userName = localStorage.getItem('userName');
      
      if (!userName) {
        setError('User not logged in');
        return;
      }
  
      try {
        const response = await axiosInstance.get(`/data/${userName}`);
        setUserId(response.data.data._id);
        fetchPremiumDiscounts(response.data.data._id);
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      }
    };
  
    fetchUserData();
  }, []);

  const fetchPremiumDiscounts = async (userId) => {
    try {
      const response = await axiosInstance.get(`/premiumdiscounts/${userId}`);
      setPremiumDiscounts(response.data.premiumDiscounts || []);
    } catch (error) {
      setError("Error fetching PremiumDiscounts: " + error.message);
    }
  };

  const handleAddPremiumDiscount = async (e) => {
    e.preventDefault();
    if (
      !PremiumDiscountValue ||
      isNaN(PremiumDiscountValue) ||
      parseFloat(PremiumDiscountValue) === 0
    ) {
      setAlertMessage("Please enter a non-zero number.");
      setShowAlert(true);
      return;
    }
    const timestamp = new Date().toLocaleString();
    try {
      const newPremiumDiscount = {
        type: PremiumDiscountType,
        value: parseFloat(PremiumDiscountValue),
        time: timestamp,
      };
      const response = await axiosInstance.post(`/premiumdiscounts/${userId}`, newPremiumDiscount);
      if (response.data && response.data.premiumDiscounts) {
        setPremiumDiscounts(prevPremiumDiscounts => [...prevPremiumDiscounts, response.data.premiumDiscounts]);
        setPremiumDiscountValue("");
        setAlertMessage("Premium/Discount added successfully!");
        setShowAlert(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error adding PremiumDiscount:", error);
      setAlertMessage("Error adding Premium/Discount: " + error.message);
      setShowAlert(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setShowAlert(false);
  };

  const latestFilteredPremiumDiscount = PremiumDiscounts.length > 0
    ? PremiumDiscounts
        .filter(sub => sub.type === PremiumDiscountType)
        .sort((a, b) => new Date(b.time) - new Date(a.time))[0]
    : null;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Manage Premium/Discount
          </Typography>
          <form onSubmit={handleAddPremiumDiscount}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Select
                  value={PremiumDiscountType}
                  onChange={(e) => setPremiumDiscountType(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Discount">Discount</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Value"
                  type="number"
                  value={PremiumDiscountValue}
                  onChange={(e) => setPremiumDiscountValue(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{
                    bgcolor:
                      "linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)",
                    color: "white",
                    "&:hover": {
                      bgcolor:
                        "linear-gradient(310deg, #7a2cbd 0%, #e52d7b 100%)",
                    },
                    padding: "6px",
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>

          {!latestFilteredPremiumDiscount ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No {PremiumDiscountType.toLowerCase()} added yet. Please add.
            </Typography>
          ) : (
            <TableContainer sx={{ maxHeight: 440, mt: 2 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Type
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Value
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Time Added
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell align="center">{latestFilteredPremiumDiscount.type}</TableCell>
                    <TableCell align="center">{latestFilteredPremiumDiscount.value}</TableCell>
                    <TableCell align="center">{latestFilteredPremiumDiscount.time}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alertMessage.includes("Error") ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default PremiumDiscount;