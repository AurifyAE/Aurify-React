import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Select, MenuItem, 
  FormControl, InputLabel, Box, Grid 
} from '@mui/material';
import { toast } from 'react-hot-toast';

// Dynamically import images
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('../../assets/bank', false, /\.(jpg|png)$/));

const BankDetailsModal = ({ open, handleClose, handleSave, editingBank, userEmail, onClose }) => {
  const initialBankState = {
    holderName: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    ifsc: '',
    swift: '',
    branch: '',
    city: '',
    country: '',
    logo: '',
  };

  const [bank, setBank] = useState(initialBankState);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (open) {
      if (editingBank) {
        setBank(editingBank);
      } else {
        setBank(initialBankState);
      }
    }
  }, [editingBank, open]);

  const bankLogoMap = {
    "Ajman Bank": "AJMAN.jpg",
    "Al Ahli Bank of Kuwait": "ABK.jpg",
    "Al Hilal Bank": "AHB.jpg",
    "AL Khaliji - France S.A": "ALK.jpg",
    "Al Maryah Community Bank": "AMCB.png",
    "Arab African International Bank": "AAB.jpg",
    "Arab Bank": "ARABBANK.jpg",
    "Arab Bank For Investment and Foreign Trade": "ALMASRAF.jpg",
    "Abu Dhabi Commercial Bank": "ADCB.jpg",
    "Abu Dhabi Islamic Bank": "ADIB.jpg",
    "Bank of Baroda": "bob.jpg",
    "Bank of China": "BOC.jpg",
    "Bank Melli Iran": "bmi.jpg",
    "Bank of Sharjah": "BS.png",
    "Bank Saderat Iran": "BSI.jpg",
    "Banque Banorient France": "BBF.jpg",
    "Banque Misr": "BM.jpg",
    "Barclays Bank": "BARCLAYS.jpg",
    "BNP Paribas Head Office": "BNP.jpg",
    "BOK International": "bok.jpg",
    "Citi Bank": "CITI.jpg",
    "Commercial Bank of Dubai": "CBD.jpg",
    "Commercial Bank International": "CBI.jpg",
    "Credit Agricole Corporate and Investment Bank": "CA.jpg",
    "Deutsche Bank": "DB.jpg",
    "Doha Bank": "doha.jpg",
    "Dubai Islamic Bank": "DIB.jpg",
    "Emirates Islamic Bank": "EIB.jpg",
    "Emirates Investment Bank": "EIN.jpg",
    "Emirates NBD": "ENBD.jpg",
    "First Abu Dhabi Bank": "FBAB.jpg",
    "Foreign Exchange and Remittance Group": "ferg.jpg",
    "Gulf International Bank": "GIB.jpg",
    "Habib Bank AG Zurich": "HABIB.jpg",
    "Habib Bank Limited": "hbl.jpg",
    "HSBC": "hsbc.jpg",
    "Industrial and Commercial Bank of China": "icbc.jpg",
    "International Development Bank": "idb.jpg",
    "Invest Bank": "IB.jpg",
    "Mashreq": "MASHREQ.jpg",
    "Mastercard": "mastercard.png",
    "National Bank of Bahrain": "nbb.jpg",
    "National Bank of Fujairah": "NBF.jpg",
    "National Bank of Kuwait": "nbk.jpg",
    "National Bank of Umm Al Qaiwain": "NBQ.jpg",
    "Network International": "NI.jpg",
    "Nilein Bank": "nile.jpg",
    "RAKBANK": "RAK.jpg",
    "Samba Financial Group": "SAMBA.jpg",
    "Sharjah Islamic Bank": "SIB.png",
    "Standard Chartered Bank": "scb.jpg",
    "United Arab Bank": "UAB.jpg",
    "United Bank Limited": "ubl.jpg",
    "VISA": "visa.png",
    "Wio Bank": "wio.png",
    "Zand Bank": "zand.png"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBank(prevBank => {
      const updatedBank = { ...prevBank, [name]: value };

      if (name === 'bankName') {
        const logoFilename = bankLogoMap[value] || `${value.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        const logoPath = images[logoFilename] || '';
        updatedBank.logo = logoPath;
      }

      return updatedBank;
    });

    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!bank.holderName.trim()) newErrors.holderName = 'Holder Name is required';
    if (!bank.bankName) newErrors.bankName = 'Bank Name is required';
    if (!bank.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (!/^\d+$/.test(bank.accountNumber)) newErrors.accountNumber = 'Account Number must be numeric';
    if (!bank.iban.trim()) newErrors.iban = 'IBAN is required';
    if (!bank.ifsc.trim()) newErrors.ifsc = 'IFSC Code is required';
    if (!bank.swift.trim()) newErrors.swift = 'SWIFT Code is required';
    if (!bank.branch.trim()) newErrors.branch = 'Branch is required';
    if (!bank.city.trim()) newErrors.city = 'City is required';
    if (!bank.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const saveBankDetails = async (bankData) => {
  const userEmail = localStorage.getItem('userEmail');

  try {
    const response = await axiosInstance.post('/save-bank-details', {
      email: userEmail,
      bankDetails: bankData
    });    
    
    if (response.data.success) {
      toast.success(editingBank ? 'Bank details updated successfully' : 'Bank details added successfully');
      fetchUserData(); // Refresh user data after saving
      handleClose();
    } else {
      throw new Error(response.data.message || 'Failed to save bank details');
    }
  } catch (error) {
    console.error('Error saving bank details:', error);
    toast.error('Failed to save bank details. Please try again.');
  }
};


const handleSubmit = async () => {
  if (validateForm()) {
    await handleSave(bank);
  } else {
    toast.error('Please fill all required fields correctly.');
  }
};




  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      maxWidth="xs" 
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>{editingBank ? 'Edit Bank Details' : 'Add Bank Details'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {[
              { name: 'holderName', label: 'Holder Name', type: 'text' },
              { name: 'bankName', label: 'Bank Name', type: 'select' },
              { name: 'accountNumber', label: 'Account Number', type: 'text' },
              { name: 'iban', label: 'IBAN Code', type: 'text' },
              { name: 'ifsc', label: 'IFSC Code', type: 'text' },
              { name: 'swift', label: 'SWIFT Code', type: 'text' },
              { name: 'branch', label: 'Branch', type: 'text' },
              { name: 'city', label: 'City', type: 'text' },
              { name: 'country', label: 'Country', type: 'text' },
            ].map((field) => (
              <Grid item xs={12} key={field.name}>
                {field.type === 'select' ? (
                  <FormControl fullWidth error={!!errors[field.name]}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={bank[field.name]}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select a Bank</MenuItem>
                      {Object.keys(bankLogoMap).map(bankName => (
                        <MenuItem key={bankName} value={bankName}>{bankName}</MenuItem>
                      ))}
                    </Select>
                    {errors[field.name] && <Box color="error.main">{errors[field.name]}</Box>}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={bank[field.name]}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                )}
              </Grid>
            ))}
            {bank.logo && (
              <Grid item xs={12}>
                <img src={bank.logo} alt="Bank Logo" style={{ maxWidth: '300px', maxHeight: '300px' }} />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingBank ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankDetailsModal;
