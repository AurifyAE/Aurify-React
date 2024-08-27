import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCommodityModal from './AddCommodityModal';
import { useCurrency } from '../context/CurrencyContext';
import io from 'socket.io-client';
import axiosInstance from '../axiosInstance';
import { debounce } from 'lodash';




const CurrencySelector = React.memo(({ onCurrencyChange }) => {
  const [currency, setCurrency] = useState('AED');
  const exchangeRates = { AED: 3.674, USD: 1, EUR: 0.92, GBP: 0.79 };

  const handleChange = useCallback((event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    onCurrencyChange(newCurrency, exchangeRates[newCurrency]);
  }, [onCurrencyChange, exchangeRates]);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 ml-14">
      <label htmlFor="currency-select" className="font-bold text-gray-700">Select a currency:</label>
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
    </div>
  );
});


// PriceCard Component
const PriceCard = React.memo(({ title, initialPrice, initialBid, initialSpread, onClose, metal, type, onSpreadUpdate }) => {
  const [spread, setSpread] = useState(() => {
    const savedSpread = localStorage.getItem(`spread_${metal}_${type}`);
    return savedSpread !== null ? parseFloat(savedSpread) : initialSpread;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSpread, setTempSpread] = useState(initialSpread);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setTempSpread(spread);
  }, [spread]);

  const handleSpreadChange = useCallback((e) => {
    setTempSpread(e.target.value);
  }, []);


  const handleSave = useCallback(() => {
    const newSpread = parseFloat(tempSpread);
    setIsEditing(false);
    setSpread(newSpread);
    localStorage.setItem(`spread_${metal}_${type}`, newSpread.toString());
    if (onSpreadUpdate) {
      onSpreadUpdate(metal, type, newSpread);
    }
  }, [metal, type, tempSpread, onSpreadUpdate]);


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
        <p className="text-gray-600 font-medium text-sm">
        {initialPrice !== undefined && initialPrice !== null ? initialPrice.toFixed(4) : 'N/A'}
        </p>
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
              <p className="text-gray-600 font-medium text-sm">
                {spread !== undefined && spread !== null ? spread : 'N/A'}
              </p>
            )}
            </div>
          </div>
      <div className="flex flex-col">
        <h6 className="text-gray-600 mb-1 font-bold">{`${title}ing Price`}</h6>
        <p className="text-gray-600 font-medium text-sm">
        {initialPrice !== undefined && initialPrice !== null && spread !== undefined && spread !== null
            ? (parseFloat(initialPrice) + parseFloat(spread)).toFixed(4)
            : 'N/A'}
        </p>
      </div>
    </div>
  </div>

  );
});

// ValueCard Component
const ValueCard = React.memo(({ lowValue, highValue, spreadMarginData,  metal, onMarginUpdate }) => {
  const getLowMargin = useCallback(() => {
    const key = `${metal.toLowerCase()}LowMargin`;
    return spreadMarginData[key] || 0;
  }, [spreadMarginData, metal]);

  const getHighMargin = useCallback(() => {
    const key = `${metal.toLowerCase()}HighMargin`;
    return spreadMarginData[key] || 0;
  }, [spreadMarginData, metal]);
  const [lowMargin, setLowMargin] = useState(getLowMargin());
  const [highMargin, setHighMargin] = useState(getHighMargin());

  useEffect(() => {
    setLowMargin(getLowMargin());
    setHighMargin(getHighMargin());
  }, [spreadMarginData, getLowMargin, getHighMargin]);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleMarginChange = useCallback((setter) => (e) => {
    const value = parseFloat(e.target.value) || 0;
    setter(value);
  }, []);
  
  const handleMarginBlur = useCallback((setter, value) => () => {
    setter(parseFloat(value) || 0);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (onMarginUpdate) {
      onMarginUpdate(metal, 'low', parseFloat(lowMargin));
      onMarginUpdate(metal, 'high', parseFloat(highMargin));
    }
  }, [metal, lowMargin, highMargin, onMarginUpdate]);

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
            <p className="text-gray-600 font-medium text-sm">{parseFloat(lowValue)+parseFloat(lowMargin)}</p>
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
            <p className="text-gray-600 font-medium text-sm">{parseFloat(highValue)+parseFloat(highMargin)}</p>
          </div>
        </div>
      </div>
    </div>
  );
});


// TradingViewWidget Component
const TradingViewWidget = React.memo(({ symbol, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Optional delay for smooth transition
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-4 py-3">
        <h6 className="text-gray-800 font-medium mb-1">{title}</h6>
      </div>
      <div className="relative" style={{ height: '300px' }}>
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${!isLoading ? 'opacity-0 transition-opacity duration-300' : 'opacity-100'}`}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading data, please wait...</p>
            </div>
          </div>
        )}
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
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
});


// Main SpotRate  Component
const SpotRate = () => {
  const [exchangeRate, setExchangeRate] = useState(3.674);
  const [openModal, setOpenModal] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [marketData, setMarketData] = useState({});
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [serverURL, setServerURL] = useState('');
  const [userId, setUserId] = useState('');
  const [commodities, setCommodities] = useState([]);
  const [uniqueMetals, setUniqueMetals] = useState([]);
  const [loadng, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [spreadMarginData, setSpreadMarginData] = useState({});

  const getSpreadOrMarginFromDB = useCallback((metal, type) => {
    const lowerMetal = metal.toLowerCase();
    const key = `${lowerMetal}${type.charAt(0).toUpperCase() + type.slice(1)}${type === 'low' || type === 'high' ? 'Margin' : 'Spread'}`;
    return spreadMarginData[key] || 0;
  }, [spreadMarginData]);

  const getUnitMultiplier = useCallback((unit) => {
    const lowerCaseUnit = String(unit).toLowerCase();
    switch (lowerCaseUnit) {
      case 'gram': return 1;
      case 'kg': return 1000;
      case 'oz': return 31.1034768;
      case 'tola': return 11.664;
      case 'ttb': return 116.6400;
      default: return 1;
    }
  }, []);

  useEffect(() => {
    const fetchCommodities = async (userId) => {
      try {
        const response = await axiosInstance.get(`/spotrates/${userId}`);
        if (response.data) {
          setSpreadMarginData(response.data);
        }
        if (response.data && response.data.commodities) {
          const parsedCommodities = response.data.commodities.map(commodity => ({
            ...commodity,
            purity: parseFloat(commodity.purity),
            unit: parseFloat(commodity.unit),
            weight: commodity.weight,
            sellPremium: parseFloat(commodity.sellPremium),
            buyPremium: parseFloat(commodity.buyPremium)
          }));
          setCommodities(parsedCommodities);
          localStorage.setItem('commoditiesData', JSON.stringify(parsedCommodities));
        }
      } catch (error) {
        console.error('Error fetching commodities:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchCommodities(userId);
    }
  }, [userId]);

  useEffect(() => {
  setCommodities(prevCommodities => 
    prevCommodities.map(commodity => {
      const updatedCommodity = { ...commodity };
      const metal = commodity.metal.toLowerCase().includes('gold') ? 'Gold' : commodity.metal;
      
      if (marketData[metal]) {
        const metalBiddingPrice = parseFloat(marketData[metal].bid) + parseFloat(getSpreadOrMarginFromDB(metal, 'bid'));
        const metalAskingPrice = parseFloat(marketData[metal].bid) + parseFloat(getSpreadOrMarginFromDB(metal, 'bid'))+ parseFloat(getSpreadOrMarginFromDB(metal, 'ask')) + (metal === 'Gold' ? 0.5 : 0.05);
        
        updatedCommodity.sellAED = calculatePrice(metalBiddingPrice, commodity, 'sell');
        updatedCommodity.buyAED = calculatePrice(metalAskingPrice, commodity, 'buy');
        updatedCommodity.sellUSD = (updatedCommodity.sellAED / exchangeRate).toFixed(4);
        updatedCommodity.buyUSD = (updatedCommodity.buyAED / exchangeRate).toFixed(4);
      }
      
      return updatedCommodity;
    })
  );
}, [marketData, getSpreadOrMarginFromDB, exchangeRate]);

const handleOpenAddModal = useCallback(() => {
  setSelectedCommodity(null);  // Clear any previously selected commodity
  setIsEditing(false);  // Ensure we're not in edit mode
  setOpenModal(true);
}, []);

const getNumberOfDigitsBeforeDecimal = useCallback((value) => {
  // Check if value is defined and not null
  if (value === undefined || value === null) {
    return 0; // or return a default value based on your requirements
  }

  const valueStr = value.toString();
  const [integerPart] = valueStr.split('.');
  return integerPart.length;
}, []);

const calculatePrice = useCallback((metalPrice, commodity, type) => {
  const unitMultiplier = getUnitMultiplier(commodity.weight);
  const digitsBeforeDecimal = getNumberOfDigitsBeforeDecimal(commodity.purity);
  const premium = type === 'sell' ? commodity.sellPremium : commodity.buyPremium;
  const metal = commodity.metal.toLowerCase().includes('gold') ? 'Gold' : commodity.metal;
  const spread = parseFloat(getSpreadOrMarginFromDB(metal, type === 'sell' ? 'bid' : 'ask'));
  
  return (
    ((((metalPrice + spread) / 31.103) * exchangeRate * commodity.unit * unitMultiplier) *
    (parseInt(commodity.purity) / Math.pow(10, digitsBeforeDecimal))) + parseFloat(premium)
  ).toFixed(4);
}, [getUnitMultiplier, getNumberOfDigitsBeforeDecimal, exchangeRate, getSpreadOrMarginFromDB]);


  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axiosInstance.get(`/data/${email}`);
        setUserId(response.data.data._id);
        const uniqueSymbols = [...new Set(response.data.data.commodities.map(commodity => commodity.symbol))];
        const uppercaseSymbols = uniqueSymbols.map(symbol => symbol.toUpperCase());
        setSymbols(uppercaseSymbols);
        setUniqueMetals(uniqueSymbols);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSpreadOrMarginUpdate = useCallback(async (metal, type, newValue) => {
    try {
      const response = await axiosInstance.post('/update-spread', {
        userId,
        metal,
        type,
        value: parseFloat(newValue)
      });
  
      if (response.status === 200 && response.data.data) {
        setSpreadMarginData(response.data.data);
      }
    } catch (error) {
      console.error('Error updating spread:', error);
    }
  }, [userId]);


  useEffect(() => {
    const fetchServerURL = async () => {
      try {
        const response = await axiosInstance.get('/server-url');
        setServerURL(response.data.selectedServerURL);
      } catch (error) {
        console.error('Error fetching server URL:', error);
      }
    };

    fetchServerURL();
  }, []);

  

  const debouncedSetMarketData = useMemo(() => 
    debounce((newData) => {
      requestAnimationFrame(() => {
        setMarketData(prevData => ({...prevData, ...newData}));
      });
    }, 16),
  []);




  useEffect(() => {
    const socket = io(serverURL, {
      query: { secret: "aurify@123" },
      transports: ['websocket'],
    });
  
    socket.on("connect", () => {
      socket.emit("request-data", symbols);
    });
  
    socket.on("market-data", (data) => {
      if (data && data.symbol) {
        setMarketData(prevData => ({
          ...prevData,
          [data.symbol]: {
            ...data,
            bidChanged: prevData[data.symbol] && data.bid !== prevData[data.symbol].bid 
              ? (data.bid > prevData[data.symbol].bid ? 'up' : 'down') 
              : null,
          }
        }));
      }
    });
  
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setError("An error occurred while receiving data");
    });
  
    return () => {
      socket.disconnect();
    };
  }, [symbols, serverURL]);
  
  const handleSaveCommodity = useCallback(async (commodityData, isEditMode) => {
    if (isEditMode) {
      setCommodities(prevCommodities => 
        prevCommodities.map(commodity => 
          commodity._id === commodityData._id ? { ...commodity, ...commodityData } : commodity
        )
      );
    } else {
      setCommodities(prevCommodities => [...prevCommodities, commodityData]);
    }
    setIsEditing(false);
    setOpenModal(false);
    const fetchUpdatedCommodities = async () => {
      try {
        const response = await axiosInstance.get(`/spotrates/${userId}`);
        if (response.data && response.data.commodities) {
          setCommodities(response.data.commodities);
        }
      } catch (error) {
        console.error('Error fetching updated commodities:', error);
      }
    };
  
    fetchUpdatedCommodities();
  }, [userId]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedCommodity(null);
    setIsEditing(false);
  }, []);
 

  const handleEditCommodity = useCallback((commodity) => {
    setSelectedCommodity({
      ...commodity
    });
    setIsEditing(true);
    setOpenModal(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/commodities/${userId}/${id}`);
      setCommodities(commodities.filter(commodity => commodity._id !== id));
      alert('Commodity deleted successfully');
    } catch (error) {
      console.error('Error deleting commodity:', error);
      alert('Failed to delete commodity. Please try again.');
    }
  }, [userId, commodities]);

  const handleCurrencyChange = useCallback((newCurrency, newExchangeRate) => {
    setCurrency(newCurrency);
    setExchangeRate(parseFloat(newExchangeRate));
  }, [setCurrency]);


  

  const renderCommodityRows = () => {
    return commodities.map((row) => {
      const isGoldRelated = row.metal && (row.metal.toLowerCase().includes('gold') || 
                            row.metal.toLowerCase().includes('minted bar'));
      const metal = isGoldRelated ? 'Gold' : (row.metal || 'Unknown');
      const metalBiddingPrice = marketData[metal] && marketData[metal].bid
        ? parseFloat(marketData[metal].bid)
        : 0;
      const metalAskingPrice = marketData[metal] && marketData[metal].bid
        ? parseFloat(marketData[metal].bid) + (isGoldRelated ? 0.5 : 0.05)
        : 0;
  
      const sellPrice = calculatePrice(metalBiddingPrice, row, 'sell');
      const buyPrice = calculatePrice(metalAskingPrice, row, 'buy');
  
      return (
        <TableRow key={row._id} sx={{ borderTop: '2px double #e0e0e0', borderBottom: '2px double #e0e0e0' }}>
          <TableCell>{row.metal}</TableCell>
          <TableCell>{row.purity}</TableCell>
          <TableCell>{`${row.unit}  ${row.weight}`}</TableCell>
          <TableCell>{sellPrice}</TableCell>
          <TableCell>{buyPrice}</TableCell>
          <TableCell>{row.sellPremium}</TableCell>
          <TableCell>{row.buyPremium}</TableCell>
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
      );
    });
  };
  const symbolMap = {
    copper: "COMEX:HG1!",
    gold: "TVC:GOLD",
    silver: "TVC:SILVER",
    platinum: "COMEX:PL1!",
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Box className="p-2">
        <CurrencySelector onCurrencyChange={handleCurrencyChange} />
      </Box>
     
      <div className="p-6 grid gap-8 grid-cols-1 md:grid-cols-2 mx-4 md:mx-8 lg:mx-14">
        {uniqueMetals.map((metal, index) => (
          <div key={metal} className={`col-span-1 ${index === uniqueMetals.length - 1 && uniqueMetals.length % 2 !== 0 ? 'md:col-span-2' : ''}`}>
            <div className={`${metal.toLowerCase()}-content ${index === uniqueMetals.length - 1 && uniqueMetals.length % 2 !== 0 ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
              <TradingViewWidget symbol={symbolMap[metal.toLowerCase()]} title={metal} />
              <div className="space-y-4 mt- md:mt-4">
                <PriceCard 
                  title="Bid" 
                  initialPrice={marketData[metal]?.bid}
                  initialSpread={getSpreadOrMarginFromDB(metal, 'bid')}  
                  metal={metal} 
                  type="bid" 
                  onSpreadUpdate={handleSpreadOrMarginUpdate} 
                />
                <PriceCard 
                  title="Ask" 
                  initialPrice={parseFloat(marketData[metal]?.bid) + getSpreadOrMarginFromDB(metal, 'bid') + (metal === 'Gold' ? 0.5 : 0.05)}
                  initialSpread={getSpreadOrMarginFromDB(metal, 'ask')}  
                  metal={metal} 
                  type="ask" 
                  onSpreadUpdate={handleSpreadOrMarginUpdate} 
                />
                <ValueCard 
                  lowValue={marketData[metal]?.low} 
                  highValue={marketData[metal]?.high} 
                  spreadMarginData={spreadMarginData}
                  metal={metal}
                  onMarginUpdate={handleSpreadOrMarginUpdate}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Box sx={{ p: 10 }} className="-mt-10">
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-t-lg border-b border-gray-200 text-gray-500">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-12">
          {uniqueMetals.map(metal => (
        <React.Fragment key={metal}>
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              {`${metal} 1GM (in USD)`}
            </Typography>
            <Typography className="font-black text-xl ml-12">
              {((parseFloat(marketData[metal]?.bid) + parseFloat(getSpreadOrMarginFromDB(metal, 'bid'))) / 31.103).toFixed(4)}
            </Typography>
          </div>
          <div className="flex justify-between items-center text-lg">
            <Typography className='font-black text-xl tracking-wide' color="text.primary">
              {`${metal} 1GM (in ${currency})`}
            </Typography>
            <Typography className="font-black text-xl ml-12">
              {((((parseFloat(marketData[metal]?.bid) + parseFloat(getSpreadOrMarginFromDB(metal, 'bid'))) / 31.103)) * exchangeRate).toFixed(4)}
            </Typography>
          </div>
        </React.Fragment>
      ))}
    </div>
          <Button
            variant="contained"
            onClick={handleOpenAddModal}
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
              {renderCommodityRows()}
            </TableBody>
          </Table>
        </TableContainer>
        <AddCommodityModal
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveCommodity}
          initialData={selectedCommodity}
          marketData={marketData}
          isEditing={isEditing}
          getSpreadOrMarginFromDB={getSpreadOrMarginFromDB}
          exchangeRate={exchangeRate}
          currency={currency}
          spreadMarginData={spreadMarginData}
        />
      </Box>
    </Box>
  );
};

export default React.memo(SpotRate);
