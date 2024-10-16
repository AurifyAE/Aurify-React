import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import io from "socket.io-client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8a3dd1",
    },
    secondary: {
      main: "#ff339a",
    },
    background: {
      default: "#f3f4f6",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: "linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(310deg, #7a2dc1 0%, #ef238a 100%)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

const CategoryManagement = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleAddOrEditCategory = (categoryData) => {
    if (editingCategory) {
      onEditCategory(editingCategory._id, categoryData);
    } else {
      onAddCategory(categoryData);
    }
    handleCloseModal();
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete._id);
    }
    handleCloseDeleteModal();
  };

  const handleViewCategory = (categoryId) => {
    navigate(`/users-spotrate/${categoryId}`);
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "view", label: "View", minWidth: 100 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Category Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow hover key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewCategory(category._id)}
                      size="small"
                    >
                      User SpotRate
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenModal(category)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDeleteModal(category)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CategoryModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddOrEditCategory}
        category={editingCategory}
      />
      <DeleteCategoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCategory}
        categoryName={categoryToDelete?.name}
      />
    </Paper>
  );
};

const ShiftModal = ({ open, onClose, user, shiftTo, onSubmit, categories }) => {
  const [contactNumber, setContactNumber] = useState("");
  const [margin, setMargin] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && user) {
      setContactNumber(user.contactNumber);
      setMargin("");
      setGeneratedPassword("");
      setSelectedCategory("");
      setErrors({});
    }
  }, [open, user]);

  useEffect(() => {
    if (shiftTo === "Debtor" && user && user.contactNumber) {
      const firstName = user.name.split(" ")[0];
      const newPassword = firstName.slice(0, 4) + user.contactNumber.slice(-4);
      setGeneratedPassword(newPassword);
    }
  }, [shiftTo, user]);

  const validateFields = () => {
    const newErrors = {};

    if (shiftTo === "Debtor" || shiftTo === "LP") {
      if (!margin) {
        newErrors.margin = "Margin is required";
      } else if (isNaN(margin) || parseFloat(margin) <= 0) {
        newErrors.margin = "Margin must be a positive number";
      }
    }

    if (shiftTo === "Debtor") {
      if (!selectedCategory) {
        newErrors.category = "Category is required";
      }

      if (!generatedPassword) {
        newErrors.password = "Password could not be generated";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      let shiftedUser = { ...user };
      if (shiftTo === "Debtor") {
        shiftedUser = {
          ...shiftedUser,
          margin,
          password: generatedPassword,
          category: selectedCategory,
        };
      } else if (shiftTo === "LP") {
        shiftedUser = { ...shiftedUser, margin };
      }
      onSubmit(shiftedUser, shiftTo);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>Shift User to {shiftTo}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          value={user?.name || ""}
          disabled
        />
        <TextField
          margin="dense"
          label="ID"
          fullWidth
          value={user?.id || ""}
          disabled
        />
        <TextField
          margin="dense"
          label="Contact Number"
          fullWidth
          value={contactNumber}
          disabled
        />
        {(shiftTo === "Debtor" || shiftTo === "LP") && (
          <TextField
            margin="dense"
            label="Margin"
            fullWidth
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            error={!!errors.margin}
            helperText={errors.margin}
          />
        )}
        {shiftTo === "Debtor" && (
          <>
            <TextField
              margin="dense"
              label="Generated Password"
              fullWidth
              value={generatedPassword}
              InputProps={{
                readOnly: true,
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Select
              margin="dense"
              label="Category"
              fullWidth
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              error={!!errors.category}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText error>{errors.category}</FormHelperText>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const UserDBTable = ({ users, onShiftUser, categories }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shiftTo, setShiftTo] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleShiftClick = (user, shift) => {
    setSelectedUser(user);
    setShiftTo(shift);
    if (shift === "Bank") {
      onShiftUser(user, shift);
    } else {
      setShiftModalOpen(true);
    }
  };

  const handleShiftModalClose = () => {
    setShiftModalOpen(false);
    setSelectedUser(null);
    setShiftTo("");
  };

  const handleShiftModalSubmit = (shiftedUser, shiftToValue) => {
    onShiftUser(shiftedUser, shiftToValue);
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 120 },
    { id: "id", label: "ID", minWidth: 50 },
    { id: "contactNumber", label: "Contact Number", minWidth: 120 },
    {
      id: "accBalance",
      label: "Acc Balance",
      minWidth: 100,
      format: (value) => value.toLocaleString(),
    },
    {
      id: "metalWeightGM",
      label: "Metal Weight GM",
      minWidth: 130,
      format: (value) => value.toFixed(2),
    },
    { id: "action", label: "Action", minWidth: 100 },
  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="left">
                          {column.id === "action" ? (
                            <Select
                              value=""
                              displayEmpty
                              size="small"
                              sx={{ minWidth: 100 }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleShiftClick(row, e.target.value);
                                }
                              }}
                              onClose={() => {
                                const selectElement = document.querySelector(
                                  `select[name="shift-${row.id}"]`
                                );
                                if (selectElement) {
                                  selectElement.value = "";
                                }
                              }}
                              name={`shift-${row.id}`}
                            >
                              <MenuItem value="" disabled>
                                Shift
                              </MenuItem>
                              <MenuItem value="Debtor">Debtor</MenuItem>
                              <MenuItem value="LP">LP</MenuItem>
                              <MenuItem value="Bank">Bank</MenuItem>
                            </Select>
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ShiftModal
        open={shiftModalOpen}
        onClose={handleShiftModalClose}
        user={selectedUser}
        shiftTo={shiftTo}
        onSubmit={handleShiftModalSubmit}
        categories={categories}
      />
    </>
  );
};

const ShiftedTable = ({ data, columns }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, mt: 2 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align="left"
                style={{ minWidth: column.minWidth, fontWeight: "bold" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align="left">
                    {column.format && typeof value === "number"
                      ? column.format(value)
                      : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const UsersDB = () => {
  const [tabValue, setTabValue] = useState(0);
  const userName = localStorage.getItem("userName");
  const [adminId, setAdminId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      accBalance: 10000,
      metalWeightGM: 500,
      contactNumber: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      accBalance: 15000,
      metalWeightGM: 750,
      contactNumber: "2345678901",
    },
    {
      id: 3,
      name: "Bob Johnson",
      accBalance: 8000,
      metalWeightGM: 400,
      contactNumber: "3456789012",
    },
    {
      id: 4,
      name: "Alice Brown",
      accBalance: 12000,
      metalWeightGM: 600,
      contactNumber: "4567890123",
    },
    {
      id: 5,
      name: "Charlie Davis",
      accBalance: 20000,
      metalWeightGM: 1000,
      contactNumber: "5678901234",
    },
  ]);
  const [debtors, setDebtors] = useState([]);
  const [lps, setLps] = useState([]);
  const [banks, setBanks] = useState([]);
  const [serverURL, setServerURL] = useState("");
  const [symbols, setSymbols] = useState(["GOLD"]);
  const [spreadMarginData, setSpreadMarginData] = useState({});
  const [marketData, setMarketData] = useState({});
  const [goldAskingPrice, setGoldAskingPrice] = useState(0);


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

  const calculateGoldAskingPrice = useCallback(() => {
    const goldData = marketData["Gold"];
    if (goldData && goldData.bid) {
      const bidSpread = getSpreadOrMarginFromDB("Gold", "bid");
      const calculatedPrice = parseFloat(goldData.bid) + parseFloat(bidSpread) + 0.5 + parseFloat(getSpreadOrMarginFromDB("Gold", "ask"));
      setGoldAskingPrice(calculatedPrice);
    }
  }, [marketData, getSpreadOrMarginFromDB]);

  useEffect(() => {
    calculateGoldAskingPrice();
  }, [calculateGoldAskingPrice]);

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
    if (!serverURL) return;

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

  useEffect(() => {
    const fetchData = async () => {
      if (!userName) return;
      try {
        const response = await axiosInstance.get(`/data/${userName}`);
        setAdminId(response.data.data._id);
      } catch (err) {
        console.error("Failed to fetch user data: " + err);
      }
    };
    fetchData();
  }, [userName]);

  useEffect(() => {
    const fetchSpreadMarginData = async () => {
      try {
        const response = await axiosInstance.get(`/spotrates/${adminId}`);
        if (response.data) {
          setSpreadMarginData(response.data);
        }
      } catch (error) {
        console.error("Error fetching spread margin data:", error);
      }
    };

    if (adminId) {
      fetchSpreadMarginData();
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) {
      fetchCategories();
    }
  }, [adminId]);

  useEffect(() => {
    const updateShiftedUsers = (users, setter) => {
      const updatedUsers = users.map(user => ({
        ...user,
        ...calculateAdditionalFields(user)
      }));
      setter(updatedUsers);
    };
  
    updateShiftedUsers(debtors, setDebtors);
    updateShiftedUsers(lps, setLps);  
  }, [marketData]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `/getUserDBCategories/${adminId}`
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axiosInstance.post(
        `/addUserDBCategory/${adminId}`,
        categoryData
      );
      if (response.data.success) {
        setCategories([...categories, response.data.category]);
        setShowNotification(true);
        setNotificationMessage("Category added successfully");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async (categoryId, categoryData) => {
    try {
      const response = await axiosInstance.put(
        `/editUserDBCategory/${categoryId}/${adminId}`,
        categoryData
      );
      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat._id === categoryId ? response.data.category : cat
          )
        );
        setShowNotification(true);
        setNotificationMessage("Category updated successfully");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.delete(
        `/deleteUserDBCategory/${categoryId}/${adminId}`
      );
      if (response.data.success) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        setShowNotification(true);
        setNotificationMessage("Category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calculateAdditionalFields = (user) => {
    const goldData = marketData["Gold"];
    const goldBidPrice = goldData && goldData.bid ? parseFloat(goldData.bid) : 0;
    
    const metalBalanceAED = user.metalWeightGM * goldBidPrice;
    const netEquity = metalBalanceAED + user.accBalance;
    const marginAmount = netEquity * (parseFloat(user.margin) / 100);
    const totalNeededAmount = netEquity + marginAmount;
  
    return {
      metalBalanceAED,
      netEquity,
      marginAmount,
      totalNeededAmount,
    };
  };

  const handleShiftUser = (user, shiftTo) => {
    setUsers(users.filter((u) => u.id !== user.id));
  
    const additionalFields = calculateAdditionalFields(user);
  
    switch (shiftTo) {
      case "Debtor":
        setDebtors([
          ...debtors,
          {
            ...user,
            ...additionalFields,
          },
        ]);
        break;
      case "LP":
        setLps([
          ...lps,
          {
            ...user,
            ...additionalFields,
          },
        ]);
        break;
      case "Bank":
        setBanks([
          ...banks,
          {
            id: user.id,
            name: user.name,
            accBalance: user.accBalance,
            metalWeightGM: user.metalWeightGM,
            contactNumber: user.contactNumber,
          },
        ]);
        break;
      default:
        break;
    }
  
    setShowNotification(true);
    setNotificationMessage(
      `User ${user.name} shifted to ${shiftTo} successfully`
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: "#f3f4f6", minHeight: "100vh", py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CategoryManagement
                categories={categories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  User DB
                </Typography>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="user database tabs"
                >
                  <Tab label="Main DB" />
                  <Tab label="Debtor" />
                  <Tab label="LP" />
                  <Tab label="Bank" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  <UserDBTable
                    users={users}
                    onShiftUser={handleShiftUser}
                    categories={categories}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <ShiftedTable
                    data={debtors}
                    columns={[
                      { id: "name", label: "Name", minWidth: 120 },
                      { id: "id", label: "ID", minWidth: 50 },
                      {
                        id: "contactNumber",
                        label: "Contact Number",
                        minWidth: 120,
                      },
                      { id: "margin", label: "Margin", minWidth: 80 },
                      { id: "password", label: "Password", minWidth: 120 },
                      { id: "category", label: "Category", minWidth: 120 },
                      {
                        id: "metalBalanceAED",
                        label: "Value of Metal Balance in AED",
                        minWidth: 200,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "netEquity",
                        label: "Net Equity",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "marginAmount",
                        label: "Margin Amount",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "totalNeededAmount",
                        label: "Total Needed Amount",
                        minWidth: 170,
                        format: (value) => value.toLocaleString(),
                      },
                    ]}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <ShiftedTable
                    data={lps}
                    columns={[
                      { id: "name", label: "Name", minWidth: 120 },
                      { id: "id", label: "ID", minWidth: 50 },
                      {
                        id: "contactNumber",
                        label: "Contact Number",
                        minWidth: 120,
                      },
                      { id: "margin", label: "Margin", minWidth: 80 },
                      {
                        id: "metalBalanceAED",
                        label: "Value of Metal Balance in AED",
                        minWidth: 200,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "netEquity",
                        label: "Net Equity",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "marginAmount",
                        label: "Margin Amount",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "totalNeededAmount",
                        label: "Total Needed Amount",
                        minWidth: 170,
                        format: (value) => value.toLocaleString(),
                      },
                    ]}
                  />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <ShiftedTable
                    data={banks}
                    columns={[
                      { id: "name", label: "Name", minWidth: 120 },
                      { id: "id", label: "ID", minWidth: 50 },
                      {
                        id: "contactNumber",
                        label: "Contact Number",
                        minWidth: 120,
                      },
                      {
                        id: "accBalance",
                        label: "Acc Balance",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                    ]}
                  />
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={showNotification}
          autoHideDuration={5000}
          onClose={() => setShowNotification(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowNotification(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {notificationMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default UsersDB;
