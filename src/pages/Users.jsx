import React, { useState, useEffect,onClose } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  TextField,
  IconButton,
  Typography,
  Container,
  Grid,
  Snackbar,
  Alert,
  Paper,  
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Lock as LockIcon, LockOpen as UnlockIcon, Edit as EditIcon , Delete as DeleteIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axiosInstance from '../axios/axiosInstance';


const theme = createTheme({
  palette: {
    primary: {
      main: '#8a3dd1',
    },
    secondary: {
      main: '#ff339a',
    },
    background: {
      default: '#f3f4f6',
    },
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(310deg, #7a2dc1 0%, #ef238a 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

  //Edit functionalities are commanded for Future use
  const CustomSpreadSection = ({ onAddSpread, spreads, onDeleteSpread }) => {
    const [spreadValue, setSpreadValue] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [spreadToDelete, setSpreadToDelete] = useState(null);
    const [spreadTitle, setSpreadTitle] = useState('Rate'); // Default value is 'Rate'

    // const [editModalOpen, setEditModalOpen] = useState(false);
    // const [editSpreadIndex, setEditSpreadIndex] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      onAddSpread(spreadValue, spreadTitle);
      setSpreadValue('');
      setSpreadTitle('Rate'); // Reset to default after submission
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleDeleteClick = (index) => {
      setSpreadToDelete(index);
      setOpenConfirmDialog(true);
    };
  
    const handleConfirmDelete = () => {
      if (spreadToDelete !== null && typeof onDeleteSpread === 'function') {
        onDeleteSpread(spreadToDelete);
        setOpenConfirmDialog(false);
        setSpreadToDelete(null);
      }
    }

    const handleCancelDelete = () => {
      setOpenConfirmDialog(false);
      setSpreadToDelete(null);
    };
    



    const columns = [
      { id: 'sino', label: '#', },
      { id: 'title', label: 'Title', },
      { id: 'value', label: 'Spread', },
      { id: 'actions', label: 'Actions', },
    ];

    return (
      <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          ADD SPREAD VALUE
        </Typography>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              label="Title"
              value={spreadTitle}
              onChange={(e) => setSpreadTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Spread Value"
              value={spreadValue}
              onChange={(e) => setSpreadValue(Math.max(0, Number(e.target.value)))}
              type="number"
              required
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
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          SPREADS
        </Typography>
        <TableContainer sx={{ maxHeight: 300 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ width: column.width, fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {spreads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((spread, index) => (
                  <TableRow hover key={index}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{spread.title}</TableCell>
                    <TableCell align="center">{spread.spreadValue}</TableCell>
                    <TableCell align="center">
                      {/* <IconButton onClick={() => handleEditClick(index)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton> */}
                      <IconButton onClick={() => handleDeleteClick(index)} color="error" size="small">
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
          count={spreads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog
          open={openConfirmDialog}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              handleCancelDelete();
            }
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this spread value?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* <SpreadEditModal
          open={editModalOpen}
          handleClose={handleEditClose}
          spread={editSpreadIndex !== null ? spreads[editSpreadIndex] : ''}
          onSave={handleEditSave}
        /> */}
      </Paper>
    );
  };

const UserDataTable = ({ userData, onToggleUserBlock }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { id: 'sino', label: '#', width: '5%' },
    { id: 'name', label: 'Name', width: '20%' },
    { id: 'phoneNo', label: 'Phone No', width: '15%' },
    { id: 'spread', label: 'Spread', width: '10%' },
    { id: 'location', label: 'Location', width: '15%' },
    { id: 'ipAddress', label: 'IP Address', width: '15%' },
    { id: 'actions', label: 'Actions', width: '10%' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = userData.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Data
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </Grid>
      </Grid>
      {filteredData.length > 0 ? (
        <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ width: column.width, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((user, index) => (
            <TableRow hover key={user._id} style={{ opacity: user.blocked ? 0.5 : 1 }}>
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell>{user.spread}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => onToggleUserBlock(user._id)} color="primary" size="small">
                  {user.blocked ? <UnlockIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}        
      </TableBody>
        </Table>
      </TableContainer>
        ) : (
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No user data available
          </Typography>
        </Box>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};


const UserList = ( ) => {
  const adminId = localStorage.getItem('userEmail');
  const [spreads, setSpreads] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', content: '', onConfirm: null });
  const [editingSpread, setEditingSpread] = useState(null);
  const [spreadValues, setSpreadValues] = useState([]);

  //addspread starts

  useEffect(() => {
    if (adminId) {  // Only fetch data if adminId is available
      fetchUserData();
      fetchSpreadValues();
    }
  }, [adminId]);  // Add adminId as a dependency


  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/users`);
      if (response.data.success) {
        setUserData(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSpreadValues = async () => {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}/spread-values`);
      if (response.data.success) {
        setSpreadValues(response.data.spreadValues);
      }
    } catch (error) {
      console.error('Error fetching spread values:', error);
    }
  };

  //spreadfetchEnd

  const handleAddSpread = async (spreadValue,title) => {
    try {
      const response = await axiosInstance.post(`/admin/${adminId}/spread-values`, { spreadValue,title });
      if (response.data.success) {
        setSpreadValues([...spreadValues, response.data.spreadDoc.spreadValues.at(-1)]);
        setShowNotification(true);
        setNotificationMessage('Spread added successfully');
      }
    } catch (error) {
      console.error('Error adding spread value:', error);
    }
  };

  // const handleSaveSpread = (editedValue) => {
  //   const updatedSpreads = spreads.map((spread, idx) =>
  //     idx === editingSpread.index ? editedValue : spread
  //   );
  //   setSpreads(updatedSpreads);
  //   setShowNotification(true);
  //   setNotificationMessage('Spread updated successfully');
  //   setEditingSpread(null);
  // };

  const handleToggleUserBlock = (adminId) => {
    const user = userData.find(u => u._id === adminId);
    if (!user) return; // Return early if user is not found
  
    const action = user.blocked !== undefined ? (user.blocked ? 'unblock' : 'block') : 'block'; // Check if blocked property exists
  
    setConfirmDialog({
      isOpen: true,
      title: `Confirm ${action}`,
      content: `Are you sure you want to ${action} ${user.userName}?`,
      onConfirm: () => {
        setUserData(prevData =>
          prevData.map(u =>
            u._id === adminId ? { ...u, blocked: u.blocked !== undefined ? !u.blocked : true } : u
          )
        );
        setShowNotification(true);
        setNotificationMessage(`User ${user.userName} has been ${action}ed`);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  
  const handleDeleteSpread = async (index) => {
    try {
      const spreadToDelete = spreadValues[index]._id;
      const response = await axiosInstance.delete(`/admin/spread-values/${spreadToDelete}/?email=${adminId}`);
      if (response.data.success) {
        setSpreadValues(prevValues => prevValues.filter((_, i) => i !== index));
        setShowNotification(true);
        setNotificationMessage('Spread deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting spread value:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12}>
            <CustomSpreadSection
              spreads={spreadValues}
              onAddSpread={handleAddSpread}
              onDeleteSpread={handleDeleteSpread}
            />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <UserDataTable
              userData={userData}
              onToggleUserBlock={handleToggleUserBlock}
            />
          </Box>
        </Container>

        {/* <SpreadEditModal
          open={!!editingSpread}
          handleClose={() => setEditingSpread(null)}
          spread={editingSpread?.value || ''}
          onSave={handleSaveSpread}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              onClose();
            }
          }}
          maxWidth="sm"
          fullWidth
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        /> */}

        <Snackbar
          open={showNotification}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
            {notificationMessage}
          </Alert>
        </Snackbar>
        {/* <Dialog 
          open={open} 
          onClose={(event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              onClose();
            }
          }}
          maxWidth="sm" 
          fullWidth
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        ></Dialog> */}
        <Dialog
          open={confirmDialog.isOpen}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              onClose();
            }
          }}
          maxWidth="sm" 
          fullWidth
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDialog.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>Cancel</Button>
            <Button onClick={confirmDialog.onConfirm} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UserList;