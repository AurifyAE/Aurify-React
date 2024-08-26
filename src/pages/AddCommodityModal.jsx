import React, { useState ,useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../axiosInstance';
import { Snackbar, Alert } from '@mui/material';


const AddCommodityModal = ({ open, onClose, onSave,initialData, marketData, isEditing, exchangeRate, currency, spreadMarginData }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState({});
  const [commodityId, setCommodityId] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    metal: 'Gold',
    purity: 999,
    unit: 1,
    weight: 'GM',
    sellPremiumUSD: '',
    sellPremiumAED: '',
    buyPremiumUSD: '',
    buyPremiumAED: '',
    buyAED: '',
    buyUSD: '',
    sellAED: '',
    sellUSD: '',
  });
  const [commodities, setCommodities] = useState([]);
  const [spotRates, setSpotRates] = useState(null);
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState(null);

  const exchangeRates = {
    AED: 3.674,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  };
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (!amount) return '';
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return '';
    
    const inUSD = parsed / exchangeRates[fromCurrency];
    return (inUSD * exchangeRates[toCurrency]).toFixed(2);
  };


  useEffect(() => {
    const fetchUserId = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('User email not found in localStorage.');
                return;
            }
            const response = await axiosInstance.get(`/data/${email}`);
            if (response && response.data && response.data.data) {
                setUserId(response.data.data._id);
            } else {
                console.error('Invalid response or missing data:', response);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    fetchUserId();
}, []);


// useEffect(() => {
//   if (initialData) {
//     setFormData({
//       ...initialData,
//       sellPremiumAED: initialData.sellPremium || initialData.sellPremiumAED || '',
//       buyPremiumAED: initialData.buyPremium || initialData.buyPremiumAED || '',
//       sellPremiumUSD: convertCurrency(initialData.sellPremium || initialData.sellPremiumAED || '', currency, 'USD'),
//       buyPremiumUSD: convertCurrency(initialData.buyPremium || initialData.buyPremiumAED || '', currency, 'USD'),
//     });
//     setCommodityId(initialData.id || initialData._id);
//     setIsEditMode(isEditing);
//   }
// }, [initialData, isEditing, currency]);

useEffect(() => {
  if (initialData && (isEditing || open)) {
    setFormData({
      ...initialData,
      sellPremiumAED: initialData.sellPremium || initialData.sellPremiumAED || '',
      buyPremiumAED: initialData.buyPremium || initialData.buyPremiumAED || '',
      sellPremiumUSD: convertCurrency(initialData.sellPremium || initialData.sellPremiumAED || '', currency, 'USD'),
      buyPremiumUSD: convertCurrency(initialData.buyPremium || initialData.buyPremiumAED || '', currency, 'USD'),
    });
    setCommodityId(initialData.id || initialData._id);
    setIsEditMode(true);
  } else if (open) {
    resetForm();
  }
}, [initialData, isEditing, open, currency]);
  
  useEffect(() => {
    const fetchSpotRates = async () => {
        if (!userId) return;
        try {
            const response = await axiosInstance.get(`/spotrates/${userId}`);
            if (response && response.data && typeof response.data === 'object') {
                setSpotRates(response.data);
            } else {
                console.error('Invalid spot rates data:', response.data);
                setSpotRates({}); // Initialize with an empty object if data is invalid
            }
        } catch (error) {
            console.error('Error fetching spot rates:', error);
            setErrors('Failed to fetch spot rates');
            setSpotRates({}); // Initialize with an empty object on error
        }
    };

    if (userId) {
        fetchSpotRates();
    }
}, [userId]);


  const calculatePrices = useCallback(() => {
    if (formData.metal && formData.purity && formData.unit && formData.weight) {
      const metal = formData.metal;
      const isGoldRelated = ['Gold', 'Gold Kilobar', 'Gold TOLA', 'Gold Ten TOLA', 'Gold Coin', 'Minted Bar'].includes(metal);
      const metalBid = isGoldRelated ? marketData['Gold']?.bid : (marketData[metal]?.bid || 0);
      const bidSpread = spreadMarginData[`${metal.toLowerCase()}BidSpread`] || 0;
      const askSpread = spreadMarginData[`${metal.toLowerCase()}AskSpread`] || 0;
      const additionalPrice = isGoldRelated ? 0.5 : 0.05;

      const unitMultiplier = getUnitMultiplier(formData.weight);
      const purityValue = parseFloat(formData.purity);
      const purityLength = formData.purity.toString().length;
      const buyPremium = parseFloat(formData.buyPremiumAED) || 0;
      const sellPremium = parseFloat(formData.sellPremiumAED) || 0;


      const baseSellPrice = (((metalBid + parseFloat(bidSpread)) / 31.103) * exchangeRate * formData.unit * unitMultiplier) * (purityValue / Math.pow(10, purityLength));
      const baseBuyPrice = (((metalBid + parseFloat(askSpread) + additionalPrice) / 31.103) * exchangeRate * formData.unit * unitMultiplier) * (purityValue / Math.pow(10, purityLength));


      const sellPrice = baseSellPrice + sellPremium;
      const buyPrice = baseBuyPrice + buyPremium;



      if (isNaN(sellPrice) || isNaN(buyPrice)) {
        console.error('NaN detected in price calculation');
        return;
      }

      setFormData(prevState => ({
        ...prevState,
        sellAED: sellPrice.toFixed(4),
        buyAED: buyPrice.toFixed(4),
        sellUSD: convertCurrency(sellPrice.toFixed(4), currency, 'USD'),
        buyUSD: convertCurrency(buyPrice.toFixed(4), currency, 'USD')
      }));
    }
  }, [formData, marketData, spreadMarginData, exchangeRate, currency]);


  useEffect(() => {
    calculatePrices();
  }, [formData.metal, formData.purity, formData.unit, formData.weight, formData.buyPremiumAED, formData.sellPremiumAED, calculatePrices]);

const getUnitMultiplier = (weight) => {
  switch (weight) {
    case 'GM': return 1;
    case 'KG': return 1000;
    case 'TTB': return 116.64;
    case 'TOLA': return 11.664;
    case 'OZ': return 31.103;
    default: return 1;
  }
};


const handleChange = (e) => {
  const { name, value } = e.target;
  if (!name) return;

  let updatedValue = value;
  if (['purity', 'unit'].includes(name)) {
    updatedValue = value === '' ? '' : parseFloat(value) || 0;
  } else if (['sellPremiumUSD', 'sellPremiumAED', 'buyPremiumUSD', 'buyPremiumAED', 'buyAED', 'buyUSD', 'sellAED', 'sellUSD'].includes(name)) {
    updatedValue = value === '' ? '' : parseFloat(value) || 0;
  }

  let updatedFormData = { ...formData, [name]: updatedValue };

  // Update the corresponding premium fields if necessary
  if (name === 'sellPremiumUSD' || name === `sellPremium${currency}` || 
      name === 'buyPremiumUSD' || name === `buyPremium${currency}`) {
      const [field, currentCurrency] = name.split('Premium');
      const otherCurrency = currentCurrency === 'USD' ? currency : 'USD';
      const otherFieldName = `${field}Premium${otherCurrency}`;
      updatedFormData[otherFieldName] = convertCurrency(value, currentCurrency, otherCurrency);
  }

  setFormData(updatedFormData);
  if (!['buyAED', 'buyUSD', 'sellAED', 'sellUSD'].includes(name)) {
    calculatePrices();
  }
};


useEffect(() => {
  const fetchCommodities = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
          setError('User not logged in');
          return;
      }
      try {
          const response = await axiosInstance.get(`/data/${userEmail}`);
          if (response && response.data && response.data.data && Array.isArray(response.data.data.commodities)) {
              const fetchedCommodities = response.data.data.commodities;
              const goldItems = [
                  { _id: 'gold', symbol: 'Gold' },
                  { _id: 'gold-kilobar', symbol: 'Gold Kilobar' },
                  { _id: 'gold-tola', symbol: 'Gold TOLA' },
                  { _id: 'gold-ten-tola', symbol: 'Gold Ten TOLA' },
                  { _id: 'gold-coin', symbol: 'Gold Coin' },
                  { _id: 'minted-bar', symbol: 'Minted Bar' }
              ];
              const nonGoldItems = fetchedCommodities.filter(item => !goldItems.find(goldItem => goldItem.symbol === item.symbol));
              const combinedCommodities = [...goldItems, ...nonGoldItems];
              setCommodities(combinedCommodities);
          } else {
              console.error('Invalid commodities data:', response.data);
          }
      } catch (error) {
          console.error('Error fetching commodities:', error);
      }
  };

  fetchCommodities();
}, []);

  

  const handleSave = async () => {
    const requiredFields = ['metal', 'purity', 'unit', 'weight'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
  
    if (emptyFields.length > 0) {
      setToastMessage(`${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required`);
      setToastOpen(true);
      return;
    }
  
    try {
      const commodityData = {
        metal: formData.metal,
        purity: parseFloat(formData.purity),
        unit: parseFloat(formData.unit),
        weight: formData.weight,
        sellPremium: parseFloat(formData.sellPremiumAED) || 0,
        buyPremium: parseFloat(formData.buyPremiumAED)   || 0,
      };
        let response;
      if (isEditMode) {
        // Update existing commodity
        response = await axiosInstance.patch(`/spotrate-commodity/${userId}/${initialData._id}`, commodityData);
        setIsEditMode(false);

      } else {
        // Add new commodity
        response = await axiosInstance.post('/spotrate-commodity', { userId, commodity: commodityData });
      }
  
      if (response.status === 200) {
      onSave(commodityData, isEditMode);
      resetForm(); 
      onClose();
    } else {
      console.error('Failed to update/add commodity');
    }
    } catch (error) {
      console.error('Error saving commodity:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      metal: 'Gold',
      purity: 999,
      unit: 1,
      weight: 'GM',
      sellPremiumUSD: '',
      sellPremiumAED: '',
      buyPremiumUSD: '',
      buyPremiumAED: '',
    });
    setIsEditMode(false);
    setCommodityId(null);
  };
  // useEffect(() => {
  //   if (open) {
  //     if (initialData) {
  //       setFormData(initialData);
  //       setIsEditMode(true);
  //     } else {
  //       resetForm();
  //     }
  //   }
  // }, [open, initialData]);

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& .Mui-disabled': {
    backgroundColor: 'transparent',
    color: 'inherit',
  },
  };

  // useEffect(() => {
  //   if (initialData && isEditing) {
  //     setFormData(initialData);
  //     setCommodityId(initialData._id);
  //     setIsEditMode(true);
  //   } else {
  //     resetForm();
  //   }
  // }, [initialData, isEditing, open]);
 

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          resetForm();
          onClose();
        }
      }} 
      maxWidth="sm" 
      fullWidth
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8f9fa', borderBottom: '1px solid #dee2e6', p: 2 }}>
        <Typography variant="h6">{isEditMode ? 'Edit Commodity' : 'Add New Commodity'}</Typography>
        <Button onClick={onClose}><CloseIcon /></Button>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>Metal</Typography>
            <Select
              name="metal"
              value={formData.metal}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={inputStyle}
              required
            >
              {commodities.length > 0 ? (
                commodities.map((commodity) => (
                  <MenuItem key={commodity._id} value={commodity.symbol}>
                    {commodity.symbol}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Loading...</MenuItem>
              )}
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>Purity</Typography>
            <Select
              name="purity"
              value={formData.purity}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={inputStyle}
              required
            >
              <MenuItem value={9999}>9999</MenuItem>
              <MenuItem value={999.9}>999.9</MenuItem>
              <MenuItem value={999}>999</MenuItem>
              <MenuItem value={995}>995</MenuItem>
              <MenuItem value={916}>916</MenuItem>
              <MenuItem value={920}>920</MenuItem>
              <MenuItem value={875}>875</MenuItem>
              <MenuItem value={750}>750</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="medium" mb={1} textAlign="center">Sell Premium</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  name="sellPremiumUSD"
                  placeholder="USD"
                  value={formData.sellPremiumUSD}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name={`sellPremium${currency}`}
                  placeholder={currency}
                  value={formData[`sellPremium${currency}`]}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>Unit</Typography>
            <TextField
              name="unit"
              type="number"
              value={formData.unit}
              onChange={handleChange}
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 1000, step: 0.1 }}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" fontWeight="medium" mb={1}>Weight</Typography>
            <Select
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={inputStyle}
              required
            >
              <MenuItem value="GM">GM</MenuItem>
              <MenuItem value="KG">KG</MenuItem>
              <MenuItem value="TTB">TTB</MenuItem>
              <MenuItem value="TOLA">TOLA</MenuItem>
              <MenuItem value="OZ">OZ</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="medium" mb={1} textAlign="center">Buy Premium</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  name="buyPremiumUSD"
                  placeholder="USD"
                  value={formData.buyPremiumUSD}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name={`buyPremium${currency}`}
                  placeholder={currency}
                  value={formData[`buyPremium${currency}`]}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}></th>
                  <th style={{ width: '40%' }}>{currency}</th>
                  <th style={{ width: '40%' }}>USD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th align="middle">Buy</th>
                  <td>
                    <TextField
                      name={`buy${currency}`}
                      value={formData[`buyAED`]}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      sx={inputStyle}
                      disabled={true}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </td>
                  <td>
                    <TextField
                      name="buyUSD"
                      value={formData.buyUSD}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      sx={inputStyle}
                      disabled={true}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th align="middle">Sell</th>
                  <td>
                    <TextField
                      name={`sell${currency}`}
                      value={formData[`sellAED`]}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      sx={inputStyle}
                      disabled={true}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </td>
                  <td>
                    <TextField
                      name="sellUSD"
                      value={formData.sellUSD}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      sx={inputStyle}
                      disabled={true}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f8f9fa', borderTop: '1px solid #dee2e6', p: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" color="inherit" sx={{ mr: 1 }}>
          Close
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditMode ? 'Save Changes' : 'Save'}
        </Button>
      </DialogActions>
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity="error" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddCommodityModal;