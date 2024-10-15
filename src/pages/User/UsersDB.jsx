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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
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

const ShiftModal = ({ open, onClose, user, shiftTo, onSubmit }) => {
  const [contactNumber, setContactNumber] = useState("");
  const [margin, setMargin] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    if (open && user) {
      setContactNumber("");
      setMargin("");
      setGeneratedPassword("");
    }
  }, [open, user]);

  useEffect(() => {
    if (shiftTo === "Deptor" && user && contactNumber) {
      const firstName = user.name.split(" ")[0];
      const newPassword = firstName.slice(0, 4) + contactNumber.slice(-4);
      setGeneratedPassword(newPassword);
    }
  }, [shiftTo, user, contactNumber]);

  const handleSubmit = () => {
    let shiftedUser = { ...user };
    if (shiftTo === "Deptor") {
      shiftedUser = {
        ...shiftedUser,
        margin,
        contactNumber,
        password: generatedPassword,
      };
    } else if (shiftTo === "LP") {
      shiftedUser = { ...shiftedUser, margin, contactNumber };
    }
    onSubmit(shiftedUser, shiftTo);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        {(shiftTo === "Deptor" || shiftTo === "LP") && (
          <>
            <TextField
              margin="dense"
              label="Contact Number"
              fullWidth
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Margin"
              fullWidth
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
            />
          </>
        )}
        {shiftTo === "Deptor" && (
          <TextField
            margin="dense"
            label="Generated Password"
            fullWidth
            value={generatedPassword}
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const UserDBTable = ({ users, onShiftUser }) => {
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
    {
      id: "metalBalanceAED",
      label: "Value of Metal Balance in AED",
      minWidth: 200,
      format: (value) => value.toLocaleString(),
    },
    {
      id: "marginPercentage",
      label: "Margin %",
      minWidth: 80,
      format: (value) => `${value}%`,
    },
    {
      id: "netEquity",
      label: "Net Equity",
      minWidth: 100,
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
    { id: "action", label: "Action", minWidth: 100 },
  ];

  return (
    <>
      <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
                                defaultValue=""
                                displayEmpty
                                size="small"
                                sx={{ minWidth: 100 }}
                                onChange={(e) =>
                                  handleShiftClick(row, e.target.value)
                                }
                              >
                                <MenuItem value="" disabled>
                                  Shift
                                </MenuItem>
                                <MenuItem value="Deptor">Deptor</MenuItem>
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
      </Paper>
      <ShiftModal
        open={shiftModalOpen}
        onClose={handleShiftModalClose}
        user={selectedUser}
        shiftTo={shiftTo}
        onSubmit={handleShiftModalSubmit}
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
      metalBalanceAED: 95000,
      marginPercentage: 5,
      netEquity: 105000,
      marginAmount: 5250,
      totalNeededAmount: 99750,
    },
    {
      id: 2,
      name: "Jane Smith",
      accBalance: 15000,
      metalWeightGM: 750,
      metalBalanceAED: 142500,
      marginPercentage: 7,
      netEquity: 157500,
      marginAmount: 11025,
      totalNeededAmount: 146475,
    },
    {
      id: 3,
      name: "Bob Johnson",
      accBalance: 8000,
      metalWeightGM: 400,
      metalBalanceAED: 76000,
      marginPercentage: 4,
      netEquity: 84000,
      marginAmount: 3360,
      totalNeededAmount: 80640,
    },
    {
      id: 4,
      name: "Alice Brown",
      accBalance: 12000,
      metalWeightGM: 600,
      metalBalanceAED: 114000,
      marginPercentage: 6,
      netEquity: 126000,
      marginAmount: 7560,
      totalNeededAmount: 118440,
    },
    {
      id: 5,
      name: "Charlie Davis",
      accBalance: 20000,
      metalWeightGM: 1000,
      metalBalanceAED: 190000,
      marginPercentage: 8,
      netEquity: 210000,
      marginAmount: 16800,
      totalNeededAmount: 193200,
    },
  ]);
  const [deptors, setDeptors] = useState([]);
  const [lps, setLps] = useState([]);
  const [banks, setBanks] = useState([]);

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
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchCategories();
    }
  }, [adminId]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/getCategories/${adminId}`);
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
        `/addCategory/${adminId}`,
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
        `/editCategory/${categoryId}/${adminId}`,
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
        `/deleteCategory/${categoryId}/${adminId}`
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

  const handleShiftUser = (user, shiftTo) => {
    setUsers(users.filter((u) => u.id !== user.id));

    switch (shiftTo) {
      case "Deptor":
        setDeptors([
          ...deptors,
          {
            id: user.id,
            name: user.name,
            marginAmount: user.margin,
            contactNumber: user.contactNumber,
            password: user.password,
          },
        ]);
        break;
      case "LP":
        setLps([
          ...lps,
          {
            id: user.id,
            name: user.name,
            marginAmount: user.margin,
            contactNumber: user.contactNumber,
          },
        ]);
        break;
      case "Bank":
        setBanks([...banks, { id: user.id, name: user.name }]);
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
                  <Tab label="Deptor" />
                  <Tab label="LP" />
                  <Tab label="Bank" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  <UserDBTable users={users} onShiftUser={handleShiftUser} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <ShiftedTable
                    data={deptors}
                    columns={[
                      { id: "name", label: "Name", minWidth: 120 },
                      { id: "id", label: "ID", minWidth: 50 },
                      {
                        id: "marginAmount",
                        label: "Margin Amount",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "contactNumber",
                        label: "Contact Number",
                        minWidth: 120,
                      },
                      { id: "password", label: "Password", minWidth: 120 },
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
                        id: "marginAmount",
                        label: "Margin Amount",
                        minWidth: 120,
                        format: (value) => value.toLocaleString(),
                      },
                      {
                        id: "contactNumber",
                        label: "Contact Number",
                        minWidth: 120,
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
