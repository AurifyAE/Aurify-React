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

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("Premium");
  const [subscriptionValue, setSubscriptionValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
        fetchSubscriptions(response.data.data._id);
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      }
    };
  
    fetchUserData();
  }, []);

  const fetchSubscriptions = async (userId) => {
    try {
      const response = await axiosInstance.get(`/subscriptions/${userId}`);
      setSubscriptions(response.data.subscriptions);
    } catch (error) {
      setError("Error fetching subscriptions: " + error.message);
    }
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (
      !subscriptionValue ||
      isNaN(subscriptionValue) ||
      parseFloat(subscriptionValue) === 0
    ) {
      setShowAlert(true);
      return;
    }
    const timestamp = new Date().toLocaleString();
    try {
      const response = await axiosInstance.post(`/subscriptions/${userId}`, {
        type: subscriptionType,
        value: parseFloat(subscriptionValue),
        time: timestamp,
      });
      setSubscriptions(prevSubscriptions => [...prevSubscriptions, response.data.subscription]);
      setSubscriptionValue("");
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setShowAlert(false);
  };

  const latestFilteredSubscription = subscriptions
    .filter(sub => sub.type === subscriptionType)
    .sort((a, b) => new Date(b.time) - new Date(a.time))[0];

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Manage Subscriptions
          </Typography>
          <form onSubmit={handleAddSubscription}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
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
                  value={subscriptionValue}
                  onChange={(e) => setSubscriptionValue(e.target.value)}
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

          {!latestFilteredSubscription ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No {subscriptionType.toLowerCase()} subscriptions added yet. Please add a subscription.
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
                    <TableCell align="center">{latestFilteredSubscription.type}</TableCell>
                    <TableCell align="center">{latestFilteredSubscription.value}</TableCell>
                    <TableCell align="center">{latestFilteredSubscription.time}</TableCell>
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
            severity="error"
            sx={{ width: "100%" }}
          >
            Please enter a non-zero number for the subscription value.
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Subscription;