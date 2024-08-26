import React, { useState,useContext,useCallback,useEffect } from 'react';
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
import { useCurrency } from '../context/CurrencyContext'; // Adjust the import path as needed
import io from 'socket.io-client'; //spot calc
import axiosInstance from '../axiosInstance';
// import { debounce } from 'lodash';
// import { updateSpotRate } from '../api/adminAPi';
// const SOCKET_SERVER_URL = "https://demo-capital-server.onrender.com";




const CurrencySelector = ({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('AED');

  const exchangeRates = {
    AED: 3.674,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  };

  const handleChange = (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    onCurrencyChange(newCurrency, exchangeRates[newCurrency]);
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
const PriceCard = ({ title, initialBid, initialSpread, initialPrice, onClose, metal, type, onSpreadUpdate }) => {
  const [bid, setBid] = useState(initialBid);
  const [spread, setSpread] = useState(() => {
    const savedSpread = localStorage.getItem(`spread_${metal}_${type}`);
    return savedSpread !== null ? parseFloat(savedSpread) : initialSpread;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSpread, setTempSpread] = useState(initialSpread);

  
   

  const handleEditClick = () => {
    setIsEditing(true);
    setTempSpread(spread);
  };

  const handleSpreadChange = (e) => {
    setTempSpread(e.target.value);
  };


  const handleSave = () => {
    setIsEditing(false);
    setSpread(tempSpread);
    localStorage.setItem(`spread_${metal}_${type}`, tempSpread.toString());
    if (onSpreadUpdate) {
      onSpreadUpdate(metal, type, tempSpread);
    }
  };


  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute top-2 right-2 p-2 bg-white border-2 border-pink-500 rounded-md flex items-center justify-center"
          style={{ width: '80px', height: '30px' }}
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
      )}
      {isEditing && (
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-pink-400 text-white rounded-md flex items-center justify-center"
          style={{ width: '80px', height: '30px' }}
        >
          Save
        </button>
      )}

    <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">{title}</h6>
        <p className="text-gray-600 font-medium text-sm">{initialBid}</p>
      </div>
      <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">Spread</h6>
            <div className='h-6 w-24'>
            {isEditing ? (
              <input
                type="number"
                value={tempSpread}
                onChange={handleSpreadChange}
                // onBlur={handleSpreadBlur}
                className="text-gray-600 font-medium text-sm p-1 border border-gray-300 rounded w-full h-full"
              />
            ) : (
              <p className="text-gray-600 font-medium text-sm">{spread}</p>
            )}
            </div>
          </div>
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">{`${title}ing Price`}</h6>
        <p className="text-gray-600 font-medium text-sm">{parseFloat(initialBid) + parseFloat(spread)}</p>
      </div>
    </div>
  </div>

  );
};
// ValueCard Component
const ValueCard = ({ lowValue, highValue, initialLowMargin, initialHighMargin, lowNewValue, highNewValue }) => {
  const [lowMargin, setLowMargin] = useState(initialLowMargin);
  const [highMargin, setHighMargin] = useState(initialHighMargin);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleMarginChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleMarginBlur = (setter, value) => () => {
    setter(value);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you might want to save the new values to localStorage or send them to a server
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute top-2 right-2 p-2 bg-white border-2 border-pink-500 rounded-md flex items-center justify-center"
          style={{ width: '80px', height: '30px' }}
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
      )}
      {isEditing && (
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-pink-400 text-white rounded-md flex items-center justify-center"
          style={{ width: '80px', height: '30px' }}
        >
          Save
        </button>
      )}

      <div className="space-y-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">Low Value</h6>
            <p className="text-gray-600 font-medium text-sm">{lowValue}</p>
          </div>
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">Margin</h6>
            <div className="h-6 w-24">
              {isEditing ? (
                <input
                  type="number"
                  value={lowMargin}
                  onChange={handleMarginChange(setLowMargin)}
                  onBlur={handleMarginBlur(setLowMargin, lowMargin)}
                  className="text-gray-600 font-medium text-sm p-1 border border-gray-300 rounded w-full h-full"
                />
              ) : (
                <p className="text-gray-600 font-medium text-sm">{lowMargin}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">Low New Value</h6>
            <p className="text-gray-600 font-medium text-sm">{lowNewValue}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">High Value</h6>
            <p className="text-gray-600 font-medium text-sm">{highValue}</p>
          </div>
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">Margin</h6>
            <div className="h-6 w-24">
              {isEditing ? (
                <input
                  type="number"
                  value={highMargin}
                  onChange={handleMarginChange(setHighMargin)}
                  onBlur={handleMarginBlur(setHighMargin, highMargin)}
                  className="text-gray-600 font-medium text-sm p-1 border border-gray-300 rounded w-full h-full"
                />
              ) : (
                <p className="text-gray-600 font-medium text-sm">{highMargin}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <h6 className="text-gray-600 mb-1 font-bold">High New Value</h6>
            <p className="text-gray-600 font-medium text-sm">{highNewValue}</p>
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



// Main SpotRate  Component
const SpotRate = () => {
  const [exchangeRate, setExchangeRate] = useState(3.674);
  const [openModal, setOpenModal] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const [selectedCommodity, setSelectedCommodity] = useState(null);
    const handleMarginChange = (lowMargin, highMargin) => {
      // Update the state or perform any necessary actions with the new margin values
      console.log('New margins:', lowMargin, highMargin);
    };
    const handleOpenModal = (commodity) => {
      const goldBid = parseFloat(marketData['Gold']?.bid) + parseFloat(getSpreadFromLocalStorage('Gold', 'bid'));
      const goldAsk = goldBid + 0.5; // Assuming 0.5 is the spread for asking price
      const silverBid = parseFloat(marketData['Silver']?.bid) + parseFloat(getSpreadFromLocalStorage('Silver', 'bid'));
      const silverAsk = silverBid + 0.05; // Assuming 0.05 is the spread for asking price
    
      setSelectedCommodity({
        ...commodity,
        goldBid,
        goldAsk,
        silverBid,
        silverAsk
      });
      setOpenModal(true);
    };
    
  const handleCloseModal = () => {setOpenModal(false);};
    //spot calc
  const [marketData, setMarketData] = useState({});
  const [error, setError] = useState(null);
  const [symbols] = useState(["GOLD", "SILVER"]);
  const [serverURL, setServerURL] = useState('');
  const [userId, setUserId] = useState('');
  const [spotRateData, setSpotRateData] = useState(null);
  const [commodities, setCommodities] = useState([]);

  const fetchCommodities = useCallback(async (userId) => {
    try {
      const response = await axiosInstance.get(`/spotrates/${userId}`);
      if (response.data && response.data.commodities) {
        setCommodities(response.data.commodities);
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCommodities(userId);
    }
  }, [userId, fetchCommodities]);

  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // or however you store the user's email
        const response = await axiosInstance.get(`/data/${email}`);
        setUserId(response.data.data._id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSpreadUpdate = async (metal, type, newSpread) => {
    try {
      const response = await axiosInstance.post('/update-spread', {
        userId,
        metal,
        type,
        spread: newSpread
      });
      
      if (response.status === 200) {
        console.log('Spread updated successfully');
        // Optionally, update local state or fetch updated data
      }
    } catch (error) {
      console.error('Error updating spread:', error);
    }
  };

  useEffect(() => {
    const fetchServerURL = async () => {
      try {
        // console.log('hereherhe  ',userID);
        const response = await axiosInstance.get('/server-url');
        setServerURL(response.data.selectedServerURL);
      } catch (error) {
        console.error('Error fetching server URL:', error);
      }
    };
  
    fetchServerURL();
  }, []);

  const getSpreadFromLocalStorage = (metal, type) => {
    const savedSpread = localStorage.getItem(`spread_${metal}_${type}`);
    return savedSpread !== null ? parseFloat(savedSpread) : 0; // Default to 0 if not found
  };
  
  const fetchMarketData = useCallback((symbols) => {

    console.log('serverURL',serverURL);
    const socket = io(serverURL, {
      query: { secret: "aurify@123" }, // Pass secret key as query parameter
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("request-data", symbols);
      console.log('success');
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("market-data", (data) => {
      if (data && data.symbol) {
        setMarketData(prevData => ({
          ...prevData,
          [data.symbol]: {
            ...prevData[data.symbol],
            ...data,
            // Compare current and previous bid to determine color
            bidChanged: prevData[data.symbol] && data.bid !== prevData[data.symbol].bid 
              ? (data.bid > prevData[data.symbol].bid ? 'up' : 'down') 
              : null,
          }
        }));
        // console.log('current bid ----- ',marketData[symbol].bid);
      } else {
        console.warn("Received malformed market data:", data);
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      setError("An error occurred while receiving data");
    });

    return () => {
      socket.disconnect();
    };
  }, [symbols, serverURL]);

  useEffect(() => {
    console.log("Market Data:", marketData);
    const cleanup = fetchMarketData(symbols);
    return cleanup;
  }, [symbols, fetchMarketData, serverURL]);


  const handleSaveCommodity = async (commodityData, isEditMode) => {
    if (isEditMode) {
      setCommodities(prevCommodities => 
        prevCommodities.map(commodity => 
          commodity.id === commodityData.id ? { ...commodity, ...commodityData } : commodity
        )
      );
    } else {
      setCommodities(prevCommodities => [
        ...prevCommodities, 
        { id: prevCommodities.length + 1, ...commodityData }
      ]);
    }
    handleCloseModal();
    try {
      const response = await axiosInstance.post('/update-commodity', commodityData);
    } catch (error) {
      console.error('Error saving commodity:', error);
      fetchCommodities(userId);
    }
  };


  const handleEditCommodity = (commodity) => {
    setSelectedCommodity({...commodity, id: commodity._id});
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/commodities/${userId}/${id}`);
      setCommodities(commodities.filter(commodity => commodity._id !== id));
      // Show success message
      alert('Commodity deleted successfully');
    } catch (error) {
      console.error('Error deleting commodity:', error);
      // Show error message
      alert('Failed to delete commodity. Please try again.');
    }
  };

  const handleCurrencyChange = (newCurrency, newExchangeRate) => {
    setCurrency(newCurrency);
    setExchangeRate(newExchangeRate);
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Box className="p-2">
        <CurrencySelector onCurrencyChange={handleCurrencyChange} />
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
        <PriceCard title="Bid" initialBid={marketData['Gold']?.bid} initialSpread={getSpreadFromLocalStorage('Gold', 'bid')}  initialPrice={2442.45} metal="Gold" type="bid" onSpreadUpdate={handleSpreadUpdate} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Bid" initialBid={marketData['Silver']?.bid} initialSpread={getSpreadFromLocalStorage('Silver', 'bid')}  initialPrice={27.51} metal="Silver" type="bid" onSpreadUpdate={handleSpreadUpdate} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Ask" initialBid={parseFloat(marketData['Gold']?.bid)+0.5} initialSpread={getSpreadFromLocalStorage('Gold', 'ask')}  initialPrice={2442.95} metal="Gold" type="ask" onSpreadUpdate={handleSpreadUpdate} />
      </div>
      <div className="col-span-1">
        <PriceCard title="Ask" initialBid={parseFloat(marketData['Silver']?.bid)+0.05} initialSpread={getSpreadFromLocalStorage('Silver', 'ask')}  initialPrice={27.56} metal="Silver" type="ask" onSpreadUpdate={handleSpreadUpdate} />
      </div>
      <div className="col-span-1">
        <ValueCard 
          lowValue={2417.000} 
          highValue={2428.870} 
          initialLowMargin={0} 
          initialHighMargin={0} 
          lowNewValue={2417.000} 
          highNewValue={2428.870} 
          onMarginChange={handleMarginChange}

        />
      </div>
      <div className="col-span-1">
        <ValueCard 
          lowValue={27.4125} 
          highValue={27.762} 
          initialLowMargin={0} 
          initialHighMargin={0} 
          lowNewValue={27.413} 
          highNewValue={27.762} 
          onMarginChange={handleMarginChange}
        />
      </div>
    </div>

    
    <Box sx={{ p: 10 }}>
    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-t-lg border-b border-gray-200 text-gray-500">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-12">
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              Gold  1GM (in USD)
            </Typography>
            <Typography className="font-black text-xl ml-6">
              {((parseFloat(marketData['Gold']?.bid) + parseFloat(getSpreadFromLocalStorage('Gold', 'bid'))) / 31.103).toFixed(4)}
            </Typography>
          </div>
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              Silver   1GM (in USD)
            </Typography>
            <Typography className="font-black text-xl ml-6">
              {((parseFloat(marketData['Silver']?.bid) + parseFloat(getSpreadFromLocalStorage('Silver', 'bid'))) / 31.103).toFixed(4)}
            </Typography>
          </div>
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              Gold 1GM (in {currency})
            </Typography>
            <Typography className="font-black text-xl ml-6">
              {((((parseFloat(marketData['Gold']?.bid) + parseFloat(getSpreadFromLocalStorage('Gold', 'bid'))) / 31.103)) * exchangeRate).toFixed(4)}
            </Typography>
          </div>
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              Silver 1GM (in {currency})
            </Typography>
            <Typography className="font-black text-xl ml-6">
              {((((parseFloat(marketData['Silver']?.bid) + parseFloat(getSpreadFromLocalStorage('Silver', 'bid'))) / 31.103)) * exchangeRate).toFixed(4)}
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
                <TableCell>Sell ({currency})</TableCell>
                <TableCell>Buy ({currency})</TableCell>
                <TableCell>Sell Premium ({currency})</TableCell>
                <TableCell>Buy Premium ({currency})</TableCell>
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
                  <TableCell>{((((parseFloat(marketData['Gold']?.bid) + parseFloat(getSpreadFromLocalStorage('Gold', 'bid'))) / 31.103)) * exchangeRate).toFixed(4)}</TableCell>
                  <TableCell>{row.buyAED}</TableCell>
                  <TableCell>{row.sellPremiumAED}</TableCell>
                  <TableCell>{row.buyPremiumAED}</TableCell>
                  <TableCell>
                      <IconButton
                        onClick={() => handleEditCommodity(row)}
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
                        onClick={() => handleDelete(row._id)}
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
          initialData={selectedCommodity}
          goldBid={selectedCommodity?.goldBid}
          goldAsk={selectedCommodity?.goldAsk}
          silverBid={selectedCommodity?.silverBid}
          silverAsk={selectedCommodity?.silverAsk}

        />
      </Box>
    </Box>
  );
};

export default SpotRate;

