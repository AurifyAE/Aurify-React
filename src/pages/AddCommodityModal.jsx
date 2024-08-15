import React, { useState ,useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCurrency } from '../context/CurrencyContext'; 

const AddCommodityModal = ({ open, onClose, onSave,initialData }) => {
  const { currency, setCurrency } = useCurrency();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    metal: 'Gold',
    purity: '999',
    unit: '1',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData, isEditMode);
    onClose();
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditMode(true);
    }
  }, [initialData]);

  return (
    <Dialog 
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
            >
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Gold kilobar">Gold kilobar</MenuItem>
              <MenuItem value="Gold TOLA">Gold TOLA</MenuItem>
              <MenuItem value="Gold TEN TOLA">Gold TEN TOLA</MenuItem>
              <MenuItem value="Gold Coin">Gold Coin</MenuItem>
              <MenuItem value="Minted Bar">Minted Bar</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
              <MenuItem value="Platinum" disabled>Platinum</MenuItem>
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
            >
              <MenuItem value="9999">9999</MenuItem>
              <MenuItem value="999.9">999.9</MenuItem>
              <MenuItem value="999">999</MenuItem>
              <MenuItem value="995">995</MenuItem>
              <MenuItem value="916">916</MenuItem>
              <MenuItem value="920">920</MenuItem>
              <MenuItem value="875">875</MenuItem>
              <MenuItem value="750">750</MenuItem>
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
                  name="sellPremiumAED"
                  placeholder={currency}
                  value={formData.sellPremiumAED}
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
                  name="buyPremiumAED"
                  placeholder={currency}
                  value={formData.buyPremiumAED}
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
                    name="buyAED"
                    value={formData.buyAED}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={inputStyle}
                    disabled={!isEditMode}
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
                    disabled={!isEditMode}
                  />
                </td>
              </tr>
              <tr>
                <th align="middle">Sell</th>
                <td>
                  <TextField
                    name="sellAED"
                    value={formData.sellAED}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={inputStyle}
                    disabled={!isEditMode}
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
                    disabled={!isEditMode}
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
        {/* {!isEditMode && (
          <Button onClick={() => setIsEditMode(true)} variant="contained" color="secondary" sx={{ mr: 1 }}>
            Edit
          </Button>
        )} */}
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditMode ? 'Save Changes' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCommodityModal;