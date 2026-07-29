import React, { useState, useEffect, useRef } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";

// Master list of available commodities supported by the application
export const AVAILABLE_COMMODITIES = [
  // Energy
  {
    key: "oil_wti",
    name: "OIL (WTI)",
    socketSymbol: "OIL_CRUDE",
    marketDataKey: "Oil - Crude",
    category: "energy",
    unit: "USD",
    description: "Crude Oil WTI Spot Price",
  },
  {
    key: "oil_brent",
    name: "OIL (BRENT)",
    socketSymbol: "OIL_BRENT",
    marketDataKey: "Oil - Brent",
    category: "energy",
    unit: "USD",
    description: "Brent Crude Oil Price",
  },
  {
    key: "natural_gas",
    name: "NATURAL GAS",
    socketSymbol: "NATURALGAS",
    marketDataKey: "Natural Gas",
    category: "energy",
    unit: "USD",
    description: "Natural Gas Price",
  },
  {
    key: "gasoline",
    name: "GASOLINE",
    socketSymbol: "GASOLINE",
    marketDataKey: "Gasoline",
    category: "energy",
    unit: "USD",
    description: "Gasoline Price",
  },

  // Industrial Metals
  {
    key: "aluminium",
    name: "ALUMINIUM",
    socketSymbol: "ALUMINUM",
    marketDataKey: "Aluminum",
    category: "industrial-metal",
    unit: "USD",
    description: "Aluminium Price",
  },
  {
    key: "copper",
    name: "COPPER",
    socketSymbol: "COPPER",
    marketDataKey: "Copper",
    category: "industrial-metal",
    unit: "USD",
    description: "Copper Price",
  },
  {
    key: "lead",
    name: "LEAD",
    socketSymbol: "LEAD",
    marketDataKey: "Lead",
    category: "industrial-metal",
    unit: "USD",
    description: "Lead Price",
  },
  {
    key: "nickel",
    name: "NICKEL",
    socketSymbol: "NICKEL",
    marketDataKey: "Nickel",
    category: "industrial-metal",
    unit: "USD",
    description: "Nickel Price",
  },

  // Precious Metals
  {
    key: "palladium",
    name: "PALLADIUM",
    socketSymbol: "Palladium",
    marketDataKey: "Palladium",
    category: "precious-metal",
    unit: "USD",
    description: "Palladium Spot Price",
  },
  {
    key: "platinum",
    name: "PLATINUM",
    socketSymbol: "Platinum",
    marketDataKey: "Platinum",
    category: "precious-metal",
    unit: "USD",
    description: "Platinum Spot Price",
  },
  {
    key: "rhodium",
    name: "RHODIUM",
    socketSymbol: null,
    marketDataKey: "Rhodium",
    category: "precious-metal",
    unit: "USD",
    isSimulated: true,
    description: "Rhodium Simulated Spot Price",
  },
  // Crypto
  {
    key: "btc_usd",
    name: "BTC USD",
    socketSymbol: "BTCUSD",
    marketDataKey: "BTC/USD",
    category: "crypto",
    unit: "USD",
    isCrypto: true,
    description: "Bitcoin Cryptocurrency",
  },
  {
    key: "eth_usd",
    name: "ETH USD",
    socketSymbol: "ETHUSD",
    marketDataKey: "ETH/USD",
    category: "crypto",
    unit: "USD",
    isCrypto: true,
    description: "Ethereum Cryptocurrency",
  },
];

// Reusable Row Component to handle flashing animations on price updates
const CommodityRow = ({
  name,
  description,
  priceUSD,
  priceCurrency,
  highUSD,
  lowUSD,
  previousPriceUSD,
  isCrypto,
  isAdmin,
  onDelete,
}) => {
  const isUp = priceUSD > previousPriceUSD;
  const isDown = priceUSD < previousPriceUSD;

  const decimals = isCrypto ? 2 : 2;

  return (
    <TableRow className={` hover:bg-gray-50 transition-colors duration-150`}>
      <TableCell className="py-4">
        <Box className="flex flex-col">
          <span className="font-semibold text-gray-800">{name}</span>
          {description && (
            <span className="text-xs text-gray-400 font-normal mt-0.5">
              {description}
            </span>
          )}
        </Box>
      </TableCell>
      {/* Price in USD */}
      <TableCell className="font-bold text-gray-900">
        <Box className="flex items-center gap-1">
          {priceUSD !== undefined
            ? `$${priceUSD.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
            : "—"}
          {isUp && <ArrowUpwardIcon className="text-green-500 text-sm" />}
          {isDown && <ArrowDownwardIcon className="text-red-500 text-sm" />}
        </Box>
      </TableCell>
      {/* Price in local Currency (e.g. AED) */}
      <TableCell className="font-semibold text-gray-700">
        {priceCurrency !== undefined
          ? priceCurrency.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : "—"}
      </TableCell>
      {/* 24h High in USD */}
      <TableCell className="text-gray-600 font-medium">
        {highUSD !== undefined
          ? `$${highUSD.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
          : "—"}
      </TableCell>
      <TableCell className="text-gray-600 font-medium">
        {lowUSD !== undefined
          ? `$${lowUSD.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
          : "—"}
      </TableCell>
      {isAdmin && (
        <TableCell>
          <IconButton onClick={onDelete} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

const StockCommodity = ({
  marketData,
  exchangeRate = 3.674,
  currency = "AED",
  isAdmin = false,
  selectedStockCommodities = [],
  onUpdateSelectedCommodities,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // State for simulated live fluctuations of Rhodium (since it is not on the socket API)
  const [rhodiumPriceUSD, setRhodiumPriceUSD] = useState(5450.0);
  const [rhodiumHighUSD, setRhodiumHighUSD] = useState(5480.0);
  const [rhodiumLowUSD, setRhodiumLowUSD] = useState(5420.0);
  const [rhodiumPrevUSD, setRhodiumPrevUSD] = useState(5450.0);

  // Simulate subtle live updates for Rhodium
  useEffect(() => {
    const interval = setInterval(() => {
      setRhodiumPriceUSD((prevPrice) => {
        const change = (Math.random() - 0.5) * 5.0;
        const nextPrice = Number((prevPrice + change).toFixed(2));
        setRhodiumPrevUSD(prevPrice);
        if (nextPrice > rhodiumHighUSD) setRhodiumHighUSD(nextPrice);
        if (nextPrice < rhodiumLowUSD) setRhodiumLowUSD(nextPrice);
        return nextPrice;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [rhodiumHighUSD, rhodiumLowUSD]);

  // Track previous prices dynamically for arrow indicators
  const prevPricesRef = useRef({});
  const [prevPricesState, setPrevPricesState] = useState({});

  useEffect(() => {
    let changed = false;
    const nextPrevPrices = { ...prevPricesState };

    AVAILABLE_COMMODITIES.forEach((comm) => {
      if (comm.isSimulated) return;
      const data =
        (comm.socketSymbol && marketData?.[comm.socketSymbol]) ||
        marketData?.[comm.marketDataKey];

      const priceUSD = data?.offer
        ? parseFloat(data.offer)
        : data?.bid
          ? parseFloat(data.bid)
          : undefined;
      const cachedPrice = prevPricesRef.current[comm.key];

      if (priceUSD !== undefined && priceUSD !== cachedPrice) {
        if (cachedPrice !== undefined) {
          nextPrevPrices[comm.key] = cachedPrice;
          changed = true;
        }
        prevPricesRef.current[comm.key] = priceUSD;
      }
    });

    if (changed) {
      setPrevPricesState(nextPrevPrices);
    }
  }, [marketData]);

  // Retrieve current, high, low, previous values for rendering
  const getCommodityData = (comm) => {
    if (comm.isSimulated) {
      return {
        priceUSD: rhodiumPriceUSD,
        highUSD: rhodiumHighUSD,
        lowUSD: rhodiumLowUSD,
        prevUSD: rhodiumPrevUSD,
      };
    }

    const data =
      (comm.socketSymbol && marketData?.[comm.socketSymbol]) ||
      marketData?.[comm.marketDataKey];
    const priceUSD = data?.offer
      ? parseFloat(data.offer)
      : data?.bid
        ? parseFloat(data.bid)
        : undefined;
    const highUSD = data?.high ? parseFloat(data.high) : priceUSD;
    const lowUSD = data?.low ? parseFloat(data.low) : priceUSD;
    const prevUSD = prevPricesState[comm.key];

    return { priceUSD, highUSD, lowUSD, prevUSD };
  };

  const selectedList = selectedStockCommodities || [];

  return (
    <Box className="mt-8 mb-6">
      {/* Title Header with ADD COMMODITY button */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-t-lg border-b border-gray-200 text-gray-500">
        <Typography
          className="font-black text-xl tracking-wide"
          color="text.primary"
          sx={{ fontWeight: "bold" }}
        >
          Stock & Other Commodities
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            className="primary-btn"
          >
            ADD COMMODITY
          </Button>
        )}
      </div>

      {/* Render the Table */}
      <TableContainer component={Paper} className="shadow-lg rounded-b-lg">
        <Table sx={{ minWidth: 650 }} aria-label="stock commodity table">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-bold text-gray-700">
                Commodity
              </TableCell>
              <TableCell className="font-bold text-gray-700">
                Price (USD)
              </TableCell>
              <TableCell className="font-bold text-gray-700">
                Price ({currency})
              </TableCell>
              <TableCell className="font-bold text-gray-700">
                24h High (USD)
              </TableCell>
              <TableCell className="font-bold text-gray-700">
                24h Low (USD)
              </TableCell>
              {isAdmin && (
                <TableCell className="font-bold text-gray-700">
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  align="center"
                  className="text-gray-500 py-6 italic"
                >
                  No commodities selected
                </TableCell>
              </TableRow>
            ) : (
              selectedList.map((key) => {
                const comm = AVAILABLE_COMMODITIES.find((c) => c.key === key);
                if (!comm) return null;

                const { priceUSD, highUSD, lowUSD, prevUSD } =
                  getCommodityData(comm);
                const priceCurrency =
                  priceUSD !== undefined ? priceUSD * exchangeRate : undefined;

                return (
                  <CommodityRow
                    key={comm.key}
                    name={comm.name}
                    description={comm.description}
                    priceUSD={priceUSD}
                    priceCurrency={priceCurrency}
                    highUSD={highUSD}
                    lowUSD={lowUSD}
                    previousPriceUSD={prevUSD}
                    isCrypto={comm.isCrypto}
                    isAdmin={isAdmin}
                    onDelete={() => {
                      if (onUpdateSelectedCommodities) {
                        onUpdateSelectedCommodities(
                          selectedList.filter((k) => k !== comm.key),
                        );
                      }
                    }}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Dialog popup for adding / configuring display list */}
      {isAdmin && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="xs"
          fullWidth
          disableEscapeKeyDown={true}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#f8f9fa",
              borderBottom: "1px solid #dee2e6",
              p: 2,
            }}
          >
            <Typography variant="h6" className="font-bold text-gray-800">
              Configure Commodities
            </Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box className="mb-4">
              <Typography
                variant="body2"
                className="text-gray-600 font-semibold mb-2"
              >
                Currently Selected:
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {selectedList.map((key) => {
                  const comm = AVAILABLE_COMMODITIES.find((c) => c.key === key);
                  if (!comm) return null;
                  return (
                    <Chip
                      key={comm.key}
                      label={comm.name}
                      onDelete={() => {
                        if (onUpdateSelectedCommodities) {
                          onUpdateSelectedCommodities(
                            selectedList.filter((k) => k !== key),
                          );
                        }
                      }}
                      color="primary"
                      variant="outlined"
                      className="font-semibold text-primary border-primary-200"
                    />
                  );
                })}
                {selectedList.length === 0 && (
                  <Typography
                    variant="body2"
                    className="text-gray-500 italic py-1"
                  >
                    No commodities selected.
                  </Typography>
                )}
              </Box>
            </Box>

            <FormControl size="small" fullWidth className="mt-4">
              <InputLabel id="add-stock-commodity-label">
                + Add Commodity
              </InputLabel>
              <Select
                labelId="add-stock-commodity-label"
                id="add-stock-commodity-select"
                value=""
                label="+ Add Commodity"
                onChange={(e) => {
                  const key = e.target.value;
                  if (
                    key &&
                    !selectedList.includes(key) &&
                    onUpdateSelectedCommodities
                  ) {
                    onUpdateSelectedCommodities([...selectedList, key]);
                  }
                }}
              >
                {AVAILABLE_COMMODITIES.filter(
                  (comm) => !selectedList.includes(comm.key),
                ).map((comm) => (
                  <MenuItem key={comm.key} value={comm.key}>
                    {comm.name}
                  </MenuItem>
                ))}
                {AVAILABLE_COMMODITIES.filter(
                  (comm) => !selectedList.includes(comm.key),
                ).length === 0 && (
                  <MenuItem disabled>All commodities selected</MenuItem>
                )}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions
            sx={{ bgcolor: "#f8f9fa", borderTop: "1px solid #dee2e6", p: 2 }}
          >
            <Button
              onClick={() => setModalOpen(false)}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default StockCommodity;
