import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import UserModal from "./UserModal";
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

//Edit functionalities are commanded for Future use
//category manegement section

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

const UserDataTable = ({
  userData,
  categories,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
  };

  const handleAddOrEditUser = (userData) => {
    if (editingUser) {
      onEditUser(editingUser._id, userData);
    } else {
      onAddUser(userData);
    }
    handleCloseModal();
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "contact", label: "Contact", minWidth: 130 },
    { id: "category", label: "Category", minWidth: 130 },
    { id: "location", label: "Location", minWidth: 170 },
    { id: "password", label: "Password", minWidth: 170 },
    { id: "actions", label: "Actions", minWidth: 130 },
  ];

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        User Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal()}
        sx={{ ml: 2, mb: 2 }}
      >
        Add User
      </Button>
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
            {userData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.contact}</TableCell>
                    <TableCell>{user.category}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.decryptedPassword}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenModal(user)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onDeleteUser(user._id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={userData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <UserModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddOrEditUser}
        user={editingUser}
        categories={categories}
      />
    </Paper>
  );
};

const UserList = () => {
  const userName = localStorage.getItem("userName");
  const [userData, setUserData] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
      fetchUserData();
      fetchCategories();
    }
  }, [adminId]);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/users`);
      console.log(response);
      if (response.data.success) {
        setUserData(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/getCategories/${adminId}`);
      console.log("--->", response);
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

  const handleAddUser = async (userData) => {
    try {
      const newUser = {
        name: userData.name,
        contact: userData.contact,
        location: userData.location,
        category: userData.category,
        password: userData.password,
      };

      const response = await axiosInstance.post(
        `/admin/${adminId}/users`,
        newUser
      );
      if (response.data.success) {
        setUserData((prevUserData) => [...prevUserData, response.data.user]);
        setShowNotification(true);
        setNotificationMessage("User added successfully");
        fetchUserData(); // Refresh the user list after adding
      }
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      setShowNotification(true);
      setNotificationMessage(
        "Error adding user: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEditUser = async (userId, updatedUserData) => {
    try {
      const response = await axiosInstance.put(
        `/admin/users/${userId}/${adminId}`,
        updatedUserData
      );
      if (response.data.success) {
        setUserData((prevUserData) =>
          prevUserData.map((user) =>
            user._id === userId ? { ...user, ...response.data.user } : user
          )
        );
        setShowNotification(true);
        setNotificationMessage("User updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setShowNotification(true);
      setNotificationMessage(
        "Error updating user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleOpenDeleteModal = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await axiosInstance.delete(
          `/admin/users/${userToDelete}/${adminId}`
        );
        if (response.data.success) {
          setUserData(userData.filter((user) => user._id !== userToDelete));
          setShowNotification(true);
          setNotificationMessage("User deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    handleCloseDeleteModal();
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
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
              <UserDataTable
                userData={userData}
                categories={categories}
                onAddUser={handleAddUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleOpenDeleteModal}
              />
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={showNotification}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity="success"
            sx={{ width: "100%" }}
          >
            {notificationMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={openDeleteModal}
          onClose={(event, reason) => {
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
              handleCloseDeleteModal();
            }
          }}
          maxWidth="xs"
          fullWidth
          disableEscapeKeyDown
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button
              onClick={handleDeleteUser}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UserList;
