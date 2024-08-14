import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Snackbar,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BankDetailsModal from './BankDetailsModal';
import MuiAlert from '@mui/material/Alert';

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
});

const StyledButton = styled(Button)({
  marginRight: '8px',
  '&.edit': {
    backgroundColor: '#E91E63',
    '&:hover': {
      backgroundColor: '#C2185B',
    },
  },
  '&.delete': {
    backgroundColor: '#F44336',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
  color: 'white',
});

const AddButton = styled(Button)({
  backgroundColor: '#E91E63',
  color: 'white',
  '&:hover': {
    backgroundColor: '#C2185B',
  },
});

const BankDetails = () => {
  const [open, setOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [editingBank, setEditingBank] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingBank(null);
  };

  const handleSave = (newBank) => {
    if (editingBank) {
      setBankDetails(bankDetails.map(bank => 
        bank.id === editingBank.id ? { ...newBank, id: editingBank.id } : bank
      ));
      setSnackbar({ open: true, message: 'Bank details updated successfully', severity: 'success' });
    } else {
      setBankDetails([...bankDetails, { ...newBank, id: Date.now() }]);
      setSnackbar({ open: true, message: 'Bank details added successfully', severity: 'success' });
    }
    handleClose();
  };

  const handleEdit = (bank) => {
    setEditingBank(bank);
    handleOpen();
  };

  const handleDelete = (id) => {
    setBankDetails(bankDetails.filter(bank => bank.id !== id));
    setSnackbar({ open: true, message: 'Bank details deleted successfully', severity: 'success' });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Open Sans, sans-serif' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} pt={3}>
        <Typography variant="h4" component="h1" sx={{ color: '#333' }}>
          Bank Details
        </Typography>
        <AddButton variant="contained" onClick={handleOpen}>
          ADD
        </AddButton>
      </Box>
      {bankDetails.map((bank) => (
        <StyledCard key={bank.id}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Holder Name</Typography>
                <Typography variant="body1">{bank.holderName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Bank Name</Typography>
                <Typography variant="body1">{bank.bankName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Account Number</Typography>
                <Typography variant="body1">{bank.accountNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">IBAN</Typography>
                <Typography variant="body1">{bank.iban}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">IFSC</Typography>
                <Typography variant="body1">{bank.ifsc}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">SWIFT</Typography>
                <Typography variant="body1">{bank.swift}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Branch</Typography>
                <Typography variant="body1">{bank.branch}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">City</Typography>
                <Typography variant="body1">{bank.city}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Country</Typography>
                <Typography variant="body1">{bank.country}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Logo</Typography>
                <img src={bank.logo} alt={bank.bankName} width="50" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="subtitle2" color="textSecondary">Action</Typography>
                <StyledButton className="edit" onClick={() => handleEdit(bank)}>EDIT</StyledButton>
                <StyledButton className="delete" onClick={() => handleDelete(bank.id)}>DELETE</StyledButton>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      ))}
      <BankDetailsModal 
        open={open} 
        handleClose={handleClose} 
        handleSave={handleSave}
        editingBank={editingBank}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default BankDetails;
