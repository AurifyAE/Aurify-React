import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close as CloseIcon } from '@mui/icons-material';
import AddCommodityModal from './AddCommodityModal';
// import { createTheme } from '@mui/material/styles';

//Select Currancy
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#7928CA',
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
//           color: 'white',
//         },
//       },
//     },
//   },
// });

const CurrencySelector = () => {
  const [currency, setCurrency] = useState('AED');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100">
      <label htmlFor="currency-select" className="font-bold text-gray-700">
        Select a currency:
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={handleChange}
        className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 shadow-lg"
      >
        <option value="AED">UNITED ARAB EMIRATES DIRHAM (AED)</option>
        <option value="USD">United States Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="GBP">British Pound Sterling (GBP)</option>
      </select>
      <button
        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg"
      >
        GET SELECTED CURRENCY
      </button>
    </div>
  );
}; 


// PriceCard Component
const PriceCard = ({ title, initialBid, initialSpread, initialPrice }) => {
  const [spread, setSpread] = useState(initialSpread);
  const [openDialog, setOpenDialog] = useState(false);
  const [tempSpread, setTempSpread] = useState(initialSpread);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveSpread = () => {
    setSpread(tempSpread);
    handleCloseDialog();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      <button
      onClick={handleOpenDialog}
      className="absolute top-2 right-2 p-2 bg-white border-2 border-pink-500 rounded-md flex items-center justify-center"
      style={{ width: '80px', height: '30px' }} // Adjust width and height as needed
    >
      <svg
        className="w-4 h-4 text-pink-500"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
        ></path>
      </svg>
    </button>

  <div className="pt-8"> {/* Add padding-top to ensure space for the icon */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">{title}</h6>
        <p className="text-gray-600 font-medium text-sm">{initialBid}</p>
      </div>
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">Spread</h6>
        <p className="text-gray-600 font-medium text-sm">{spread}</p>
      </div>
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">{`${title}ing Price`}</h6>
        <p className="text-gray-600 font-medium text-sm">{initialPrice}</p>
      </div>
    </div>
  </div>
  <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Edit Spread</DialogTitle>
    <DialogContent>
      <input
        autoFocus
        type="number"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Spread"
        value={tempSpread}
        onChange={(e) => setTempSpread(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog}>Cancel</Button>
      <Button onClick={handleSaveSpread} className="bg-[#cb0c9f] text-white">Save</Button>
    </DialogActions>
  </Dialog>
</div>

  );
};
// ValueCard Component
const ValueCard = ({ lowValue, highValue, lowMargin, highMargin, lowNewValue, highNewValue }) => {
  const [editingLow, setEditingLow] = useState(false);
  const [editingHigh, setEditingHigh] = useState(false);
  const [tempLowMargin, setTempLowMargin] = useState(lowMargin);
  const [tempHighMargin, setTempHighMargin] = useState(highMargin);

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6">
      {/* Edit Button */}
      <button
      // onClick={setEditingLow(!editingLow)}
      className="absolute top-2 right-2 p-2 bg-white border-2 border-pink-500 rounded-md flex items-center justify-center"
      style={{ width: '80px', height: '30px' }} // Adjust width and height as needed
    >
      <svg
        className="w-4 h-4 text-pink-500"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
        ></path>
      </svg>
    </button>

      <div className="space-y-6 pt-8"> {/* Add padding-top to ensure content isn't hidden behind the button */}
        {/* Low Value Section */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <h6 className="text-gray-600 font-bold">Low Value</h6>
            <p className="text-gray-500 text-sm font-medium">{lowValue}</p>
          </div>
          <div className="col-span-3">
            <h6 className="text-gray-600 font-bold">Margin</h6>
            <p className="text-gray-500 text-sm font-medium">
              {editingLow ? (
                <input
                  type="number"
                  value={tempLowMargin}
                  onChange={(e) => setTempLowMargin(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              ) : (
                tempLowMargin
              )}
            </p>
          </div>
          <div className="col-span-5">
            <h6 className="text-gray-600 font-bold">Low New Value</h6>
            <p className="text-gray-500 text-sm font-medium">{lowNewValue}</p>
          </div>
        </div>

        {/* High Value Section */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <h6 className="text-gray-600 font-bold">High Value</h6>
            <p className="text-gray-500 text-sm font-medium">{highValue}</p>
          </div>
          <div className="col-span-3">
            <h6 className="text-gray-600 font-bold">Margin</h6>
            <p className="text-gray-500 text-sm font-medium">
              {editingHigh ? (
                <input
                  type="number"
                  value={tempHighMargin}
                  onChange={(e) => setTempHighMargin(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              ) : (
                tempHighMargin
              )}
            </p>
          </div>
          <div className="col-span-5">
            <h6 className="text-gray-600 font-bold">High New Value</h6>
            <p className="text-gray-500 text-sm font-medium">{highNewValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// TradingViewWidget Component
const TradingViewWidget = ({ symbol, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-4 py-3">
        <h6 className="text-gray-800 font-medium mb-1">{title}</h6>
      </div>
      <div className="p-2">
        <div className="tradingview-widget-container" style={{ width: '100%', height: '300px' }}>
          <iframe
            scrolling="no"
            allowTransparency="true"
            frameBorder="0"
            src={`https://www.tradingview-widget.com/embed-widget/symbol-overview/?locale=in#%7B%22symbols%22%3A%5B%5B%22${symbol}%7C1D%22%5D%5D%2C%22chartOnly%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A300%2C%22colorTheme%22%3A%22light%22%2C%22showVolume%22%3Afalse%2C%22showMA%22%3Afalse%2C%22hideDateRanges%22%3Afalse%2C%22hideMarketStatus%22%3Afalse%2C%22hideSymbolLogo%22%3Afalse%2C%22scalePosition%22%3A%22right%22%2C%22scaleMode%22%3A%22Normal%22%2C%22fontFamily%22%3A%22-apple-system%2C%20BlinkMacSystemFont%2C%20Trebuchet%20MS%2C%20Roboto%2C%20Ubuntu%2C%20sans-serif%22%2C%22fontSize%22%3A%2210%22%2C%22noTimeScale%22%3Afalse%2C%22valuesTracking%22%3A%221%22%2C%22changeMode%22%3A%22price-and-percent%22%2C%22chartType%22%3A%22area%22%2C%22maLineColor%22%3A%22%232962FF%22%2C%22maLineWidth%22%3A1%2C%22maLength%22%3A9%2C%22lineWidth%22%3A2%2C%22lineType%22%3A0%2C%22dateRanges%22%3A%5B%221d%7C1%22%2C%221m%7C30%22%2C%223m%7C60%22%2C%2212m%7C1D%22%2C%2260m%7C1W%22%2C%22all%7C1M%22%5D%2C%22utm_source%22%3A%22admin.aurify.ae%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22symbol-overview%22%2C%22page-uri%22%3A%22admin.aurify.ae%2Fpages%2Fspotrate.html%22%7D`}
            title="symbol overview TradingView widget"
            lang="en"
            className="w-full h-full"
            style={{ userSelect: 'none', boxSizing: 'border-box', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};

// CommodityForm Component
// const AddCommodityModal = ({ open, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     metal: 'Gold',
//     purity: '999',
//     unit: '1',
//     weight: 'GM',
//     sellPremiumUSD: '',
//     sellPremiumAED: '',
//     buyPremiumUSD: '',
//     buyPremiumAED: '',
//     buyAED: '286.4435',
//     buyUSD: '78.05',
//     sellAED: '286.5168999999996',
//     sellUSD: '78.07',
//   });
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     onSave(formData);
//     onClose();
//   };
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle className="flex justify-between items-center bg-gray-100">
//         <span className="text-lg font-semibold">Add New Commodity</span>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent className="mt-4">
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <Select
//               fullWidth
//               name="metal"
//               value={formData.metal}
//               onChange={handleChange}
//               className="bg-gray-100"
//             >
//               <MenuItem value="Gold">Gold</MenuItem>
//               <MenuItem value="Silver">Silver</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               name="purity"
//               value={formData.purity}
//               onChange={handleChange}
//               className="bg-gray-100"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <div className="text-sm font-semibold mb-1">Sell Premium</div>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="sellPremiumUSD"
//                   placeholder="USD"
//                   value={formData.sellPremiumUSD}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="sellPremiumAED"
//                   placeholder="AED"
//                   value={formData.sellPremiumAED}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               name="unit"
//               value={formData.unit}
//               onChange={handleChange}
//               className="bg-gray-100"
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Select
//               fullWidth
//               name="weight"
//               value={formData.weight}
//               onChange={handleChange}
//               className="bg-gray-100"
//             >
//               <MenuItem value="GM">GM</MenuItem>
//               <MenuItem value="KG">KG</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12}>
//             <div className="text-sm font-semibold mb-1">Buy Premium</div>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="buyPremiumUSD"
//                   placeholder="USD"
//                   value={formData.buyPremiumUSD}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="buyPremiumAED"
//                   placeholder="AED"
//                   value={formData.buyPremiumAED}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <div className="text-sm font-semibold mb-1">Buy</div>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="buyAED"
//                   placeholder="AED"
//                   value={formData.buyAED}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="buyUSD"
//                   placeholder="USD"
//                   value={formData.buyUSD}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <div className="text-sm font-semibold mb-1">Sell</div>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="sellAED"
//                   placeholder="AED"
//                   value={formData.sellAED}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   fullWidth
//                   name="sellUSD"
//                   placeholder="USD"
//                   value={formData.sellUSD}
//                   onChange={handleChange}
//                   className="bg-gray-100"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions className="bg-gray-100 p-4">
//         <Button onClick={onClose} variant="contained" className="bg-gray-400 hover:bg-gray-500 text-white">
//           CLOSE
//         </Button>
//         <Button onClick={handleSave} variant="contained" className="bg-pink-500 hover:bg-pink-600 text-white">
//           SAVE CHANGES
//         </Button>
//         <Button onClick={handleSave} variant="contained" className="bg-pink-600 hover:bg-pink-700 text-white">
//           SAVE
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// Main SpotRate Component
const SpotRate = () => {
  const [commodities, setCommodities] = useState([
    { id: 1, metal: 'Gold', purity: 9999, unit: '1 KG', sellAED: 308521.0448, buyAED: 308021.0948, sellPremiumAED: '', buyPremiumAED: '' },
    { id: 2, metal: 'Gold', purity: 995, unit: '1 KG', sellAED: 307009.1405, buyAED: 306511.6405, sellPremiumAED: '', buyPremiumAED: '' },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (editingCommodity) {
  //     setEditingCommodity({ ...editingCommodity, [name]: value });
  //   } else {
  //     setNewCommodity({ ...newCommodity, [name]: value });
  //   }
  // };

  const handleSaveCommodity = (newCommodity) => {
    setCommodities([...commodities, { id: commodities.length + 1, ...newCommodity }]);
    handleCloseModal();
  };

  const handleEdit = (commodity) => {
    setEditingCommodity(commodity);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setCommodities(commodities.filter(commodity => commodity.id !== id));
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Box className="p-2">
        <CurrencySelector />
      </Box>
      <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 mx-14">
      <div className="col-span-1">
        <TradingViewWidget symbol="TVC:GOLD" title="Gold" />
      </div>
      <div className="col-span-1">
        <TradingViewWidget symbol="TVC:SILVER" title="Silver" />
      </div>
    </div>

      
    <div className="p-3 grid gap-4 grid-cols-1 md:grid-cols-2 mx-16 py-2">
      <div className="col-span-1">
        <PriceCard title="Bid" initialBid={2420.45} initialSpread={22} initialPrice={2442.45} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Bid" initialBid={27.5075} initialSpread={0} initialPrice={27.51} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Ask" initialBid={2442.95} initialSpread={0} initialPrice={2442.95} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Ask" initialBid={27.5575} initialSpread={0} initialPrice={27.56} />
      </div>
      <div className="col-span-1">
        <ValueCard 
          lowValue={2417.000} 
          highValue={2428.870} 
          lowMargin={0} 
          highMargin={0} 
          lowNewValue={2417.000} 
          highNewValue={2428.870} 
        />
      </div>
      <div className="col-span-1">
        <ValueCard 
          lowValue={27.4125} 
          highValue={27.762} 
          lowMargin={0} 
          highMargin={0} 
          lowNewValue={27.413} 
          highNewValue={27.762} 
        />
      </div>
    </div>


      <Box sx={{ p: 10 }}>
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-t-lg border-b border-gray-200 text-gray-500">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-12">
        <div className="flex justify-between items-center text-lg text-bold">
          <Typography className='text-bold' color="text.secondary">
            Gold      1GM (in USD)
          </Typography>
          <Typography className="font-bold ml-2">
            78.1607
          </Typography>
        </div>
        <div className="flex justify-between items-center text-lg text-bold">
          <Typography className='font-bold' color="text.secondary">
            Silver     1GM (in USD)
          </Typography>
          <Typography className="font-bold ml-2">
            0.8830
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <Typography className='font-bold' color="text.secondary">
            Gold 1GM (in AED)
          </Typography>
          <Typography className="font-bold ml-2">
            286.849
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <Typography className='font-bold' color="text.secondary">
            Silver 1GM (in AED)
          </Typography>
          <Typography className="font-bold ml-8">
            3.2406
          </Typography>
        </div>
      </div>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
          color: 'white',
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: '0.375rem',
          '&:hover': {
            background: 'linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)',
          },
        }}
      >
        ADD COMMODITY
      </Button>
    </div>
        <TableContainer component={Paper} className="shadow-lg">
          <Table sx={{ minWidth: 650 }} aria-label="commodity table">
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell>Metal</TableCell>
                <TableCell>Purity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Sell (AED)</TableCell>
                <TableCell>Buy (AED)</TableCell>
                <TableCell>Sell Premium (AED)</TableCell>
                <TableCell>Buy Premium (AED)</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commodities.map((row) => (
                <TableRow key={row.id}
                sx={{
                  borderTop: '2px double #e0e0e0', // Apply double border on top
                  borderBottom: '2px double #e0e0e0', // Apply double border on bottom
                }}>
                  <TableCell>{row.metal}</TableCell>
                  <TableCell>{row.purity}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.sellAED}</TableCell>
                  <TableCell>{row.buyAED}</TableCell>
                  <TableCell>{row.sellPremiumAED}</TableCell>
                  <TableCell>{row.buyPremiumAED}</TableCell>
                  <TableCell>
                      <IconButton
                        onClick={() => handleEdit(row)}
                        sx={{
                          background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                          color: 'white',
                          padding: '8px',
                          marginRight: '8px',
                          borderRadius: '8px',
                          minWidth: '60px',
                          height: '40px',
                          '&:hover': {
                            background: 'linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(row.id)}
                        sx={{
                          background: 'linear-gradient(310deg, #7928CA 0%, #FF0080 100%)',
                          color: 'white',
                          padding: '8px',
                          borderRadius: '8px',
                          minWidth: '60px',
                          height: '40px',
                          '&:hover': {
                            background: 'linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddCommodityModal
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveCommodity}
        />
      </Box>
    </Box>
  );
};

export default SpotRate;