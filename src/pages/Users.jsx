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
import { Add as AddIcon, Search as SearchIcon, Lock as LockIcon, LockOpen as UnlockIcon, Edit as EditIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';



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

const CustomSpreadSection = ({ onAddSpread, spreads, onEditSpread }) => {
  const [spreadValue, setSpreadValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSpread(spreadValue);
    setSpreadValue('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: 'sino', label: '#', },
    { id: 'value', label: 'Spread', },
    { id: 'actions', label: 'Actions', },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, width: '50%' }}>
      <Typography variant="h6" gutterBottom>
        ADD SPREAD VALUE
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={8}>
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
                  <TableCell align="center">{spread}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => onEditSpread(index)} color="primary" size="small">
                      <EditIcon fontSize="small" />
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <TableRow hover key={user.id} style={{ opacity: user.blocked ? 0.5 : 1 }}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phoneNo}</TableCell>
                  <TableCell>{user.spread}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.ipAddress}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onToggleUserBlock(user.id)} color="primary" size="small">
                      {user.blocked ? <UnlockIcon fontSize="small" /> : <LockIcon fontSize="small" />}
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
    </Paper>
  );
};

const SpreadEditModal = ({ open, handleClose, spread, onSave }) => {
  const [editedSpread, setEditedSpread] = useState(spread);

  const handleSave = () => {
    if (editedSpread > 0) {
      onSave(editedSpread);
      handleClose();
    }
  };

  return (
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose();
          }
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
      >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}>
          <Typography variant="h6" gutterBottom>
            Edit Spread
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Spread Value"
            value={editedSpread}
            onChange={(e) => setEditedSpread(Math.max(0, Number(e.target.value)))}
            type="number"
            required
            size="small"
            inputProps={{ min: 0 }}
          />
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const UserList = () => {
  const [spreads, setSpreads] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', content: '', onConfirm: null });
  const [editingSpread, setEditingSpread] = useState(null);

  useEffect(() => {
    // Demo data
    const demoSpreads = [5, 10, 15, 20, 25];
    const demoUsers = [
      { id: 1, name: 'Rhaenyra Targaryen', phoneNo: '123-456-7890', spread: 15, location: 'King\'s Landing', ipAddress: '192.168.1.1', blocked: false },
      { id: 2, name: 'Daemon Targaryen', phoneNo: '234-567-8901', spread: 20, location: 'Dragonstone', ipAddress: '192.168.1.2', blocked: false },
      { id: 3, name: 'Alicent Hightower', phoneNo: '345-678-9012', spread: 10, location: 'Oldtown', ipAddress: '192.168.1.3', blocked: false },
      { id: 4, name: 'Viserys Targaryen', phoneNo: '456-789-0123', spread: 25, location: 'Red Keep', ipAddress: '192.168.1.4', blocked: false },
      { id: 5, name: 'Otto Hightower', phoneNo: '567-890-1234', spread: 5, location: 'King\'s Landing', ipAddress: '192.168.1.5', blocked: false },
    ];

    setSpreads(demoSpreads);
    setUserData(demoUsers);
  }, []);

  const handleAddSpread = (spreadValue) => {
    const newSpread = Math.max(0, Number(spreadValue));
    setSpreads((prevSpreads) => [...prevSpreads, newSpread]);
    setShowNotification(true);
    setNotificationMessage('Spread added successfully');
  };

  const handleEditSpread = (index) => {
    setEditingSpread({ index, value: spreads[index] });
  };

  const handleSaveSpread = (editedValue) => {
    const updatedSpreads = spreads.map((spread, idx) =>
      idx === editingSpread.index ? editedValue : spread
    );
    setSpreads(updatedSpreads);
    setShowNotification(true);
    setNotificationMessage('Spread updated successfully');
    setEditingSpread(null);
  };

  const handleToggleUserBlock = (userId) => {
    const user = userData.find(u => u.id === userId);
    const action = user.blocked ? 'unblock' : 'block';
    
    setConfirmDialog({
      isOpen: true,
      title: `Confirm ${action}`,
      content: `Are you sure you want to ${action} ${user.name}?`,
      onConfirm: () => {
        setUserData(prevData => 
          prevData.map(u => 
            u.id === userId ? { ...u, blocked: !u.blocked } : u
          )
        );
        setShowNotification(true);
        setNotificationMessage(`User ${user.name} has been ${action}ed`);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomSpreadSection 
                onAddSpread={handleAddSpread} 
                spreads={spreads}
                onEditSpread={handleEditSpread}
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

        <SpreadEditModal
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
        />

        <Snackbar
          open={showNotification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
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