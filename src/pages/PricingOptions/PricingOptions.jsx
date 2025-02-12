import { Add as AddIcon, Edit, Delete } from "@mui/icons-material";
import {
  Alert,
  Button,
  Container,
  Grid,
  IconButton,
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
    primary: { main: "#6a1b9a" },
    secondary: { main: "#ff4081" },
  },
  typography: { fontFamily: "Poppins, sans-serif" },
});

const PricingOptions = () => {
  const adminId = localStorage.getItem("adminId");
  const [pricingOptions, setPricingOptions] = useState([]);
  const [latestPricing, setLatestPricing] = useState(null);
  const [formData, setFormData] = useState({
    methodType: "Cash",
    pricingType: "Discount",
    value: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAllPricingOptions();
    fetchLatestPricing();
  }, []);

  const fetchAllPricingOptions = async () => {
    try {
      const response = await axiosInstance.get(`/pricing/all/${adminId}`);
      setPricingOptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pricing options:", error);
    }
  };

  const fetchLatestPricing = async () => {
    try {
      const response = await axiosInstance.get(`/pricing/latest/${adminId}`);
      setLatestPricing(response.data.data || null);
    } catch (error) {
      console.error("Error fetching latest pricing:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/pricing/edit/${editId}`, formData);
        setSnackbar({ open: true, message: "Pricing option updated successfully!", severity: "success" });
      } else {
        await axiosInstance.post(`/pricing/add/${adminId}`, formData);
        setSnackbar({ open: true, message: "Pricing option added successfully!", severity: "success" });
      }
      fetchAllPricingOptions();
      fetchLatestPricing();
      setFormData({ methodType: "Cash", pricingType: "Discount", value: "" });
      setEditId(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Error saving pricing option.", severity: "error" });
    }
  };

  const handleEdit = (option) => {
    setFormData({ methodType: option.methodType, pricingType: option.pricingType, value: option.value });
    setEditId(option._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pricing option?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/pricing/delete/${id}`);
      setSnackbar({ open: true, message: "Pricing option deleted successfully!", severity: "success" });
      fetchAllPricingOptions();
      fetchLatestPricing();
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting pricing option.", severity: "error" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          Manage Pricing Options
        </Typography>

        {/* Form Section */}
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Pricing Option" : "Add Pricing Option"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Select
                  fullWidth
                  value={formData.methodType}
                  onChange={(e) => setFormData({ ...formData, methodType: e.target.value })}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank">Bank</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={4}>
                <Select
                  fullWidth
                  value={formData.pricingType}
                  onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                >
                  <MenuItem value="Discount">Discount</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
            >
              {editId ? "Update Pricing" : "Add Pricing"}
            </Button>
          </form>
        </Paper>

        {/* Table Section */}
        <Paper elevation={4} sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f3e5f5" }}>
                <TableRow>
                  <TableCell><strong>Method</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestPricing && (
                  <TableRow sx={{ backgroundColor: "#e1bee7", fontWeight: "bold" }}>
                    <TableCell>{latestPricing.methodType}</TableCell>
                    <TableCell>{latestPricing.pricingType}</TableCell>
                    <TableCell>{latestPricing.value}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(latestPricing)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(latestPricing._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
                {pricingOptions.length > 0 ? (
                  pricingOptions.map((option) => (
                    <TableRow key={option._id}>
                      <TableCell>{option.methodType}</TableCell>
                      <TableCell>{option.pricingType}</TableCell>
                      <TableCell>{option.value}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(option)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(option._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No pricing options available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Snackbar Notification */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default PricingOptions;
