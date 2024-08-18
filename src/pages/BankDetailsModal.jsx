import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Grid
} from '@mui/material';
import { toast } from 'react-hot-toast';

const BankDetailsModal = ({ open, handleClose, handleSave, editingBank, onClose }) => {
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

  useEffect(() => {
    if (editingBank) {
      setBank(editingBank);
    } else {
      setBank(initialBankState);
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
        const logoPath = `/src/assets/bank/${logoFilename}`;
        updatedBank.logo = logoPath;
      }
      
      return updatedBank;
    });
    
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  //   // Set logo based on bank selection
  //   if (name === 'bankName') {
  //     const logoFilename = bankLogoMap[value] || `${value.replace(/\s+/g, '_').toLowerCase()}.jpg`;
  //     const logoPath = `/src/assets/bank/${logoFilename}`;
  //     console.log("Attempting to load logo from:", logoPath); 
  //     setBank(prevBank => {
  //       console.log('Previous Bank State:', prevBank); // Logs the previous state of bank
  //       const updatedBank = {
  //         ...prevBank,
  //         logo: logoPath
  //       };
  //       console.log('Updated Bank State:', updatedBank); // Logs the new state before updating
  //       return updatedBank;
  //     });
      
  //     console.log('all set..........');
  //   }
  // };

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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await handleSave(bank);
        toast.success(editingBank ? 'Bank details updated successfully' : 'Bank details added successfully');
        handleClose();
      } catch (error) {
        toast.error('Failed to save bank details. Please try again.');
      }
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
                        <MenuItem value="select">Select a Bank</MenuItem>
                        <MenuItem value="First Abu Dhabi Bank">First Abu Dhabi Bank</MenuItem>
                        <MenuItem value="Abu Dhabi Commercial Bank">Abu Dhabi Commercial Bank</MenuItem>
                        <MenuItem value="Arab Bank For Investment and Foreign Trade">Arab Bank For Investment and Foreign Trade</MenuItem>
                        <MenuItem value="Commercial Bank of Dubai">Commercial Bank of Dubai</MenuItem>
                        <MenuItem value="Emirates NBD">Emirates NBD</MenuItem>
                        <MenuItem value="Mashreq">Mashreq</MenuItem>
                        <MenuItem value="Bank of Sharjah">Bank of Sharjah</MenuItem>
                        <MenuItem value="United Arab Bank">United Arab Bank</MenuItem>
                        <MenuItem value="Invest Bank">Invest Bank</MenuItem>
                        <MenuItem value="RAKBANK">RAKBANK</MenuItem>
                        <MenuItem value="Commercial Bank International">Commercial Bank International</MenuItem>
                        <MenuItem value="National Bank of Fujairah">National Bank of Fujairah</MenuItem>
                        <MenuItem value="National Bank of Umm Al Qaiwain">National Bank of Umm Al Qaiwain</MenuItem>
                        <MenuItem value="Dubai Islamic Bank">Dubai Islamic Bank</MenuItem>
                        <MenuItem value="Emirates Islamic Bank">Emirates Islamic Bank</MenuItem>
                        <MenuItem value="Sharjah Islamic Bank">Sharjah Islamic Bank</MenuItem>
                        <MenuItem value="Abu Dhabi Islamic Bank">Abu Dhabi Islamic Bank</MenuItem>
                        <MenuItem value="Al Hilal Bank">Al Hilal Bank</MenuItem>
                        <MenuItem value="Ajman Bank">Ajman Bank</MenuItem>
                        <MenuItem value="Emirates Investment Bank">Emirates Investment Bank</MenuItem>
                        <MenuItem value="Network International">Network International</MenuItem>
                        <MenuItem value="Mastercard">Mastercard</MenuItem>
                        <MenuItem value="Foreign Exchange and Remittance Group">Foreign Exchange and Remittance Group</MenuItem>
                        <MenuItem value="VISA">VISA</MenuItem>
                        <MenuItem value="Al Maryah Community Bank">Al Maryah Community Bank</MenuItem>
                        <MenuItem value="Wio Bank">Wio Bank</MenuItem>
                        <MenuItem value="Zand Bank">Zand Bank</MenuItem>
                        <MenuItem value="Arab Bank">Arab Bank</MenuItem>
                        <MenuItem value="Banque Misr">Banque Misr</MenuItem>
                        <MenuItem value="Bank of Baroda">Bank of Baroda</MenuItem>
                        <MenuItem value="Nilein Bank">Nilein Bank</MenuItem>
                        <MenuItem value="National Bank of Bahrain">National Bank of Bahrain</MenuItem>
                        <MenuItem value="BNP Paribas Head Office">BNP Paribas Head Office</MenuItem>
                        <MenuItem value="HSBC">HSBC</MenuItem>
                        <MenuItem value="Arab African International Bank">Arab African International Bank</MenuItem>
                        <MenuItem value="AL Khaliji - France S.A">AL Khaliji - France S.A</MenuItem>
                        <MenuItem value="Al Ahli Bank of Kuwait">Al Ahli Bank of Kuwait</MenuItem>
                        <MenuItem value="Barclays Bank">Barclays Bank</MenuItem>
                        <MenuItem value="Habib Bank Limited">Habib Bank Limited</MenuItem>
                        <MenuItem value="Habib Bank AG Zurich">Habib Bank AG Zurich</MenuItem>
                        <MenuItem value="Standard Chartered Bank">Standard Chartered Bank</MenuItem>
                        <MenuItem value="Citi Bank">Citi Bank</MenuItem>
                        <MenuItem value="Bank Saderat Iran">Bank Saderat Iran</MenuItem>
                        <MenuItem value="Bank Melli Iran">Bank Melli Iran</MenuItem>
                        <MenuItem value="Banque Banorient France">Banque Banorient France</MenuItem>
                        <MenuItem value="United Bank Limited">United Bank Limited</MenuItem>
                        <MenuItem value="Doha Bank">Doha Bank</MenuItem>
                        <MenuItem value="Samba Financial Group">Samba Financial Group</MenuItem>
                        <MenuItem value="Deutsche Bank">Deutsche Bank</MenuItem>
                        <MenuItem value="Industrial and Commercial Bank of China">Industrial and Commercial Bank of China</MenuItem>
                        <MenuItem value="National Bank of Kuwait">National Bank of Kuwait</MenuItem>
                        <MenuItem value="Gulf International Bank">Gulf International Bank</MenuItem>
                        <MenuItem value="Bank of China">Bank of China</MenuItem>
                        <MenuItem value="BOK International">BOK International</MenuItem>
                        <MenuItem value="Credit Agricole Corporate and Investment Bank">Credit Agricole Corporate and Investment Bank</MenuItem>
                        <MenuItem value="International Development Bank">International Development Bank</MenuItem>
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
                <img src={bank.logo}  style={{ maxWidth: '100px', maxHeight: '100px' }} />
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
