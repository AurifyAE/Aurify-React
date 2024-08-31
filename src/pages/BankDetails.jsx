import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axiosInstance from '../axios/axiosInstance';
import BankDetailsModal from './BankDetailsModal';

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
  const [bankDetails, setBankDetails] = useState([]);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({});
  const [editingBank, setEditingBank] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, accountNumber: null });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingBank(null);
  };

  const handleEdit = (bank) => {
    setEditingBank(bank);
    setOpen(true);
  };

  const handleSave = async (newBank) => {
    try {
      const endpoint = editingBank ? '/update-bank-details' : '/save-bank-details';
      const method = editingBank ? 'put' : 'post';

      const response = await axiosInstance[method](endpoint, {
        email: localStorage.getItem('userEmail'),
        bankDetails: newBank
      });

      if (response.data.success) {
        toast.success(editingBank ? 'Bank details updated successfully' : 'Bank details added successfully');
        fetchUserData();
        handleClose();
      } else {
        throw new Error(response.data.message || 'Failed to save bank details');
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details. Please try again.');
    }
  };

  const handleDeleteConfirmation = (accountNumber) => {
    setDeleteConfirmation({ open: true, accountNumber });
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmation({ open: false, accountNumber: null });
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete('/delete-bank-details', {
        data: {
          email: localStorage.getItem('userEmail'),
          accountNumber: deleteConfirmation.accountNumber
        }
      });
  
      if (response.data.success) {
        toast.success('Bank details deleted successfully');
        fetchUserData();
      } else {
        throw new Error(response.data.message || 'Failed to delete bank details');
      }
    } catch (error) {
      console.error('Error deleting bank details:', error);
      toast.error('Failed to delete bank details. Please try again.');
    } finally {
      handleDeleteConfirmClose();
    }
  };

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await axiosInstance.get(`/data/${userEmail}`);
      setUserData(response.data);
    } catch (err) {
      setError('Failed to fetch user data: ' + err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Open Sans, sans-serif' }}>
      <Toaster position="top-right" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} pt={3}>
        <Typography variant="h4" component="h1" sx={{ color: '#828ea2', fontWeight: 'bold' }}>
          Bank Details
        </Typography>
        <AddButton variant="contained" onClick={handleOpen}>
          ADD
        </AddButton>
      </Box>
      {userData && userData.data && userData.data.bankDetails && userData.data.bankDetails.length > 0 ? (
        userData.data.bankDetails.map((bank) => (
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
                  <img src={bank.logo} alt={bank.bankName} style={{ maxWidth: '150px', maxHeight: '300px' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={2} sx={{ ml: 8 }}>
                  <Typography variant="subtitle2" color="textSecondary">Action</Typography>
                  <StyledButton className="edit" onClick={() => handleEdit(bank)}>EDIT</StyledButton>
                  <StyledButton className="delete" onClick={() => handleDeleteConfirmation(bank.accountNumber)}>DELETE</StyledButton>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">No bank details available.</Typography>
      )}

      <BankDetailsModal 
        open={open} 
        handleClose={handleClose} 
        handleSave={handleSave}
        editingBank={editingBank}
        userEmail={localStorage.getItem('userEmail')}
      />
      <Dialog
        open={deleteConfirmation.open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleDeleteConfirmClose();
          }
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={true}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this bank account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirmClose}
            sx={{
              backgroundColor: '#f0f0f0',
              color: '#000',
              fontFamily: 'Open Sans, sans-serif',
              '&:hover': { backgroundColor: '#d3d3d3' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              fontFamily: 'Open Sans, sans-serif',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BankDetails;