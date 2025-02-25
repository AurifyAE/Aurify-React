import { Add as AddIcon, Edit, Delete, CreditCard, Money, Refresh } from "@mui/icons-material";
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
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  Tooltip,
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../axios/axiosInstance";

// Create theme with properly registered custom colors and gradients
const theme = createTheme({
  palette: {
    primary: { main: "#8e24aa" }, // Darker purple
    secondary: { main: "#ec407a" }, // Pink accent
    success: { main: "#2e7d32" },
    warning: { main: "#ed6c02" },
    error: { main: "#d32f2f" },
    info: { main: "#0288d1" },
  },
  typography: { 
    fontFamily: "Poppins, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28, // More rounded buttons like the sign-out button
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          ':hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
  },
});

// Define colors as constants
const CASH_COLOR = "#00695c";
const CASH_LIGHT = "#b2dfdb";
const BANK_COLOR = "#1565c0";
const BANK_LIGHT = "#bbdefb";
const GRADIENT_BG = "linear-gradient(90deg, #9c27b0 0%, #ec407a 100%)"; // Match sign-out button gradient
const HOVER_GRADIENT_BG = "linear-gradient(90deg, #8e24aa 0%, #d81b60 100%)"; // Slightly darker for hover

const PricingOptions = () => {
  const adminId = localStorage.getItem("adminId");
  const [pricingOptions, setPricingOptions] = useState([]);
  const [latestPricing, setLatestPricing] = useState(null);
  const [formData, setFormData] = useState({
    methodType: "Cash",
    pricingType: "Discount",
    value: "",
  });
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Memoize filtered options
  const { cashOptions, bankOptions } = useMemo(() => {
    const cashOpts = pricingOptions.filter(option => option.methodType === "Cash");
    const bankOpts = pricingOptions.filter(option => option.methodType === "Bank");
    return { cashOptions: cashOpts, bankOptions: bankOpts };
  }, [pricingOptions]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAllPricingOptions(), fetchLatestPricing()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({ open: true, message: "Error loading data. Please try again.", severity: "error" });
    }
    setLoading(false);
  };

  const fetchAllPricingOptions = async () => {
    try {
      const response = await axiosInstance.get(`/pricing/all/${adminId}`);
      setPricingOptions(response.data.data || []);
      return response;
    } catch (error) {
      console.error("Error fetching pricing options:", error);
      throw error;
    }
  };

  const fetchLatestPricing = async () => {
    try {
      const response = await axiosInstance.get(`/pricing/latest/${adminId}`);
      setLatestPricing(response.data.data || null);
      return response;
    } catch (error) {
      console.error("Error fetching latest pricing:", error);
      throw error;
    }
  };

  const validateForm = () => {
    if (parseFloat(formData.value) < 0) {
      setFormError("Value cannot be negative");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (editId) {
        await axiosInstance.put(`/pricing/edit/${editId}`, formData);
        setSnackbar({ open: true, message: "Pricing option updated successfully!", severity: "success" });
      } else {
        await axiosInstance.post(`/pricing/add/${adminId}`, formData);
        setSnackbar({ open: true, message: "Pricing option added successfully!", severity: "success" });
      }
      await fetchData();
      resetForm();
    } catch (error) {
      setSnackbar({ open: true, message: "Error saving pricing option.", severity: "error" });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ methodType: activeTab === 0 ? "Cash" : "Bank", pricingType: "Discount", value: "" });
    setFormError("");
    setEditId(null);
  };

  const handleEdit = (option) => {
    setFormData({ methodType: option.methodType, pricingType: option.pricingType, value: option.value });
    setFormError("");
    setEditId(option._id);
    setActiveTab(option.methodType === "Cash" ? 0 : 1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pricing option?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/pricing/delete/${id}`);
      setSnackbar({ open: true, message: "Pricing option deleted successfully!", severity: "success" });
      await fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting pricing option.", severity: "error" });
    }
    setLoading(false);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, value });
    
    // Clear error if value becomes valid
    if (parseFloat(value) >= 0 || value === "") {
      setFormError("");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    resetForm();
    setFormData({ methodType: newValue === 0 ? "Cash" : "Bank", pricingType: "Discount", value: "" });
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper to get color based on pricing type
  const getPricingTypeColor = (type) => {
    return type === "Discount" ? "success" : "warning";
  };

  // Helper to get the active method color
  const getActiveMethodColor = () => {
    return activeTab === 0 ? CASH_COLOR : BANK_COLOR;
  };

  // Helper to get the active method light color
  const getActiveMethodLightColor = () => {
    return activeTab === 0 ? CASH_LIGHT : BANK_LIGHT;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Manage Pricing Options
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchData} 
              disabled={loading} 
              sx={{ 
                color: theme.palette.secondary.main,
                '&:hover': { 
                  background: alpha(theme.palette.secondary.main, 0.1),
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.5s ease'
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Tabs for Cash/Bank */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: '20px' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            textColor="primary"
            indicatorColor="primary"
            sx={{ 
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 1.5,
              }
            }}
          >
            <Tab 
              label="Cash Pricing" 
              icon={<Money />} 
              iconPosition="start"
              sx={{ 
                py: 2,
                bgcolor: activeTab === 0 ? alpha(CASH_LIGHT, 0.5) : 'transparent',
                transition: 'all 0.3s ease',
                fontWeight: activeTab === 0 ? 700 : 500,
              }} 
            />
            <Tab 
              label="Bank Pricing" 
              icon={<CreditCard />} 
              iconPosition="start"
              sx={{ 
                py: 2,
                bgcolor: activeTab === 1 ? alpha(BANK_LIGHT, 0.5) : 'transparent',
                transition: 'all 0.3s ease',
                fontWeight: activeTab === 1 ? 700 : 500,
              }} 
            />
          </Tabs>
        </Paper>

        {/* Form Section */}
        <Paper 
          elevation={4} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '20px',
            borderTop: 6, 
            borderColor: getActiveMethodColor(),
            transition: 'border-color 0.3s ease',
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              mr: 2, 
              p: 1.5, 
              borderRadius: '50%', 
              bgcolor: alpha(getActiveMethodColor(), 0.15),
              color: getActiveMethodColor() 
            }}>
              {activeTab === 0 ? <Money fontSize="large" /> : <CreditCard fontSize="large" />}
            </Box>
            <Typography variant="h6">
              {editId ? `Edit ${formData.methodType} Pricing Option` : `Add New ${formData.methodType} Pricing`}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ ml: 1 }}>Pricing Type</Typography>
                <Select
                  fullWidth
                  value={formData.pricingType}
                  onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                  sx={{ 
                    height: 56,
                    borderRadius: '14px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(formData.pricingType === 'Discount' ? 
                        theme.palette.success.main : 
                        theme.palette.warning.main, 0.5),
                      borderWidth: 2,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: formData.pricingType === 'Discount' ? 
                        theme.palette.success.main : 
                        theme.palette.warning.main,
                    },
                  }}
                >
                  <MenuItem value="Discount">Discount</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ ml: 1 }}>Value</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter value"
                  value={formData.value}
                  onChange={handleValueChange}
                  inputProps={{ min: 0 }}
                  required
                  error={!!formError}
                  helperText={formError}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '14px',
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.palette.error.main,
                      fontWeight: 500,
                    }
                  }}
                  InputProps={{
                    sx: { height: 56 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={editId ? <Edit /> : <AddIcon />}
                  fullWidth
                  disabled={loading || !!formError}
                  sx={{ 
                    py: 1.5,
                    fontSize: 16,
                    background: GRADIENT_BG,
                    '&:hover': {
                      background: HOVER_GRADIENT_BG,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {editId ? "Update Pricing" : "Add Pricing"}
                </Button>
                {editId && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={resetForm}
                    sx={{ 
                      mt: 1.5,
                      py: 1.2,
                      borderColor: alpha(theme.palette.primary.main, 0.6),
                      color: theme.palette.primary.main,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    Cancel Editing
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3} 
              sx={{ 
                bgcolor: alpha(CASH_LIGHT, 0.3),
                borderRadius: '16px',
                borderLeft: 4,
                borderColor: CASH_COLOR,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Cash Pricing Options
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold', color: CASH_COLOR }}>
                  {cashOptions.length}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Discount: {cashOptions.filter(o => o.pricingType === "Discount").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Premium: {cashOptions.filter(o => o.pricingType === "Premium").length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3} 
              sx={{ 
                bgcolor: alpha(BANK_LIGHT, 0.3),
                borderRadius: '16px',
                borderLeft: 4,
                borderColor: BANK_COLOR,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Bank Pricing Options
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold', color: BANK_COLOR }}>
                  {bankOptions.length}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Discount: {bankOptions.filter(o => o.pricingType === "Discount").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Premium: {bankOptions.filter(o => o.pricingType === "Premium").length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Table Section */}
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: '20px', 
            mb: 4, 
            overflow: 'hidden',
            borderTop: 6,
            borderColor: getActiveMethodColor(),
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha(getActiveMethodLightColor(), 0.3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: '50%', 
                bgcolor: alpha(getActiveMethodColor(), 0.15),
                mr: 1.5,
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                {activeTab === 0 ? 
                  <Money sx={{ color: CASH_COLOR }} /> : 
                  <CreditCard sx={{ color: BANK_COLOR }} />
                }
              </Box>
              <Typography variant="h6" sx={{ color: getActiveMethodColor() }}>
                {activeTab === 0 ? "Cash" : "Bank"} Pricing Options
              </Typography>
            </Box>
            
            <Chip 
              label={`${(activeTab === 0 ? cashOptions : bankOptions).length} Options`}
              color={getPricingTypeColor("Discount")}
              size="small"
              variant="outlined"
              sx={{ borderRadius: '12px', fontWeight: 500 }}
            />
          </Box>
          
          <Divider />
          
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600 } }}>
                  <TableCell width="25%"><strong>Type</strong></TableCell>
                  <TableCell width="20%"><strong>Value</strong></TableCell>
                  <TableCell width="35%"><strong>Added Date</strong></TableCell>
                  <TableCell width="20%" align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Show latest pricing first if it matches the current tab */}
                {latestPricing && latestPricing.methodType === (activeTab === 0 ? "Cash" : "Bank") && (
                  <TableRow sx={{ 
                    bgcolor: alpha(getActiveMethodLightColor(), 0.3),
                  }}>
                    <TableCell>
                      <Chip 
                        label={latestPricing.pricingType} 
                        color={getPricingTypeColor(latestPricing.pricingType)}
                        size="small"
                        sx={{ borderRadius: '12px', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold', ml: 1 }}>{latestPricing.value}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(latestPricing.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                        <IconButton 
                          onClick={() => handleEdit(latestPricing)}
                          size="small"
                          sx={{ 
                            mr: 1, 
                            color: theme.palette.primary.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                        <IconButton 
                          onClick={() => handleDelete(latestPricing._id)}
                          size="small"
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Show the rest of the options for the selected tab */}
                {(activeTab === 0 ? cashOptions : bankOptions).length > 0 ? (
                  (activeTab === 0 ? cashOptions : bankOptions)
                    .filter(option => !(latestPricing && option._id === latestPricing._id))
                    .map((option) => (
                      <TableRow key={option._id} sx={{ 
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                        transition: 'background-color 0.2s ease' 
                      }}>
                        <TableCell>
                          <Chip 
                            label={option.pricingType} 
                            color={getPricingTypeColor(option.pricingType)}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '12px' }}
                          />
                        </TableCell>
                        <TableCell>{option.value}</TableCell>
                        <TableCell>{formatDate(option.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit" arrow>
                            <IconButton 
                              onClick={() => handleEdit(option)}
                              size="small"
                              sx={{ 
                                mr: 1, 
                                color: theme.palette.primary.main,
                                '&:hover': { 
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton 
                              onClick={() => handleDelete(option._id)}
                              size="small"
                              sx={{ 
                                color: theme.palette.error.main,
                                '&:hover': { 
                                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No {activeTab === 0 ? "Cash" : "Bank"} pricing options available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Snackbar Notification */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ 
              width: "100%", 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '12px'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default PricingOptions;