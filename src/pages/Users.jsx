import React, { useState, useEffect } from 'react';
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
  Modal,
  Backdrop,
  Fade,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@mui/material';
import UserEditModal from './UserEditModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8a3dd1',
    },
    secondary: {
      main: '#ff339a',
    },
    background: {
      default: '#f0f0f0',
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
  },
});

const glassMorphismStyle = {
  background: 'rgba(255, 255, 255, 0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: '20px',
};

const CustomSpreadSection = ({ onAddSpread }) => {
  const [spreadValue, setSpreadValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSpread(spreadValue);
    setSpreadValue('');
  };

  return (
    <Box sx={glassMorphismStyle}>
      <Typography variant="h6" gutterBottom>
        Add New Spread
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              label="Spread Value"
              value={spreadValue}
              onChange={(e) => setSpreadValue(e.target.value)}
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
    </Box>
  );
};

const SpreadTable = ({ spreads, onEditSpread, onDeleteSpread }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'sino', label: '#',  },
    { id: 'value', label: 'Spread',  },
    { id: 'actions', label: 'Actions', },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={glassMorphismStyle}>
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
                  <TableCell align="center">{spread}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEditSpread(index)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onDeleteSpread(index)} color="error" size="small">
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
    </Box>
  );
};

const UserDataTable = ({ userData, onEditUser, onDeleteUser }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpread, setFilterSpread] = useState('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    { id: 'sino', label: '#', width: '5%' },
    { id: 'name', label: 'Name', width: '20%' },
    { id: 'phoneNo', label: 'Phone No', width: '15%' },
    { id: 'spread', label: 'Spread', width: '10%' },
    { id: 'location', label: 'Location', width: '20%' },
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSpread === '' || user.spread === filterSpread)
  );

  return (
    <Box sx={glassMorphismStyle}>
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
        <Grid item xs={6}>
          <Select
            fullWidth
            value={filterSpread}
            onChange={(e) => setFilterSpread(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Spreads</MenuItem>
            <MenuItem value="5%">5%</MenuItem>
            <MenuItem value="10%">10%</MenuItem>
            <MenuItem value="15%">15%</MenuItem>
          </Select>
        </Grid>
      </Grid>
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
                <TableRow hover key={user.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phoneNo}</TableCell>
                  <TableCell>{user.spread}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditUser(user.id)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onDeleteUser(user.id)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

const SpreadBarChart = ({ spreads }) => {
    const data = spreads.map((spread, index) => ({
      name: `Spread ${index + 1}`,
      value: parseFloat(spread)
    }));
  
    return (
      <Box sx={glassMorphismStyle}>
        <Typography variant="h6" gutterBottom>
          Spread Visualization
        </Typography>
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Box>
    );
  };
  
  const SpreadEditModal = ({ open, handleClose, spread, onSave }) => {
    const [editedSpread, setEditedSpread] = useState(spread);
  
    const handleSave = () => {
      onSave(editedSpread);
      handleClose();
    };
  
    return (
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            ...glassMorphismStyle,
          }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Edit Spread
            </Typography>
            <TextField
              fullWidth
              label="Spread Value"
              value={editedSpread}
              onChange={(e) => setEditedSpread(e.target.value)}
              type="number"
              margin="normal"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">Save</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    );
  };
  
    export default function Dashboard() {
        const [spreads, setSpreads] = useState([]);
        const [userData, setUserData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [openSpreadModal, setOpenSpreadModal] = useState(false);
        const [editingSpreadIndex, setEditingSpreadIndex] = useState(null);
        const [openUserModal, setOpenUserModal] = useState(false);
        const [editingUser, setEditingUser] = useState(null);
        const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
    useEffect(() => {
      // Simulating data fetch
      setTimeout(() => {
        setSpreads(['5', '10', '15']);
        setUserData([
          { id: 1, name: 'John Doe', phoneNo: '123-456-7890', spread: '5%', location: 'New York' },
          { id: 2, name: 'Jane Smith', phoneNo: '987-654-3210', spread: '10%', location: 'Los Angeles' },
          { id: 3, name: 'Alice Johnson', phoneNo: '555-555-5555', spread: '15%', location: 'Chicago' },
        ]);
        setLoading(false);
      }, 1500);
    }, []);
  
    const handleAddSpread = (value) => {
      setSpreads([...spreads, value]);
      setSnackbar({ open: true, message: 'Spread added successfully', severity: 'success' });
    };
  
    const handleEditSpread = (index) => {
      setEditingSpreadIndex(index);
      setOpenSpreadModal(true);
    };
  
    const handleSaveSpread = (newValue) => {
      const newSpreads = [...spreads];
      newSpreads[editingSpreadIndex] = newValue;
      setSpreads(newSpreads);
      setSnackbar({ open: true, message: 'Spread updated successfully', severity: 'success' });
    };
  
    const handleDeleteSpread = (index) => {
      const newSpreads = spreads.filter((_, i) => i !== index);
      setSpreads(newSpreads);
      setSnackbar({ open: true, message: 'Spread deleted successfully', severity: 'success' });
    };
  
    
      // This will be handled in the separate UserEditModal component
      const handleEditUser = (userId) => {
        const userToEdit = userData.find(user => user.id === userId);
        setEditingUser(userToEdit);
        setOpenUserModal(true);
      };
    
      const handleSaveUser = (editedUser) => {
        const updatedUserData = userData.map(user => 
          user.id === editedUser.id ? editedUser : user
        );
        setUserData(updatedUserData);
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      }; 
  
    const handleDeleteUser = (userId) => {
      // Implement delete logic
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    };
  
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbar({ ...snackbar, open: false });
    };
  
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Spread Management Section */}
            <Grid item xs={12} md={6}>
              <Box sx={glassMorphismStyle}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomSpreadSection onAddSpread={handleAddSpread} />
                  </Grid>
                  <Grid item xs={12}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} />
                    ) : (
                      <SpreadTable
                        spreads={spreads}
                        onEditSpread={handleEditSpread}
                        onDeleteSpread={handleDeleteSpread}
                      />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
  
            {/* Bar Chart Section */}
            <Grid item xs={12} md={6}>
              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <SpreadBarChart spreads={spreads} />
              )}
            </Grid>
  
            {/* User Data Table Section */}
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <UserDataTable
                  userData={userData}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}
            </Grid>
          </Grid>
        </Container>
  
        <SpreadEditModal
          open={openSpreadModal}
          handleClose={() => setOpenSpreadModal(false)}
          spread={editingSpreadIndex !== null ? spreads[editingSpreadIndex] : ''}
          onSave={handleSaveSpread}
        />

        <UserEditModal
        open={openUserModal}
        handleClose={() => setOpenUserModal(false)}
        user={editingUser || {}}
        onSave={handleSaveUser}
        />  
  
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
  

  
  