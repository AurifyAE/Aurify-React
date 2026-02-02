import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../axios/axiosInstance";
import { MenuItem } from "@mui/material";

const EXCHANGE_RATES = { AED: 3.674, USD: 1 };
const OUNCE = 31.1034768;

const getUnitMultiplier = (weight) => {
  switch (weight) {
    case "KG":
      return 1000;
    case "TTB":
      return 116.64;
    case "TOLA":
      return 11.664;
    case "OZ":
      return OUNCE;
    default:
      return 1; // GM
  }
};

const PURITY_OPTIONS = [9999, 999.9, 999, 995, 916, 920, 875, 750];


const AddMintedBarsModal = ({
  open,
  onClose,
  onSave,
  initialData,
  marketData,
  exchangeRate,
  currency,
}) => {
  const [adminId, setAdminId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [mintedBarId, setMintedBarId] = useState(null);

  const [toast, setToast] = useState({ open: false, message: "" });

  const [formData, setFormData] = useState({
    name: "",
    purity: 999,
    unit: 1,
    weight: "GM",
    buyPremiumUSD: "",
    sellPremiumUSD: "",
    buyCharges: "",
    sellCharges: "",
  });

  /* ---------------- Fetch Admin ---------------- */

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const userName = localStorage.getItem("userName");
        const res = await axiosInstance.get(`/data/${userName}`);
        setAdminId(res.data.data._id);
      } catch {
        setToast({ open: true, message: "Failed to load admin" });
      }
    };

    fetchAdmin();
  }, []);

  /* ---------------- Edit Mode ---------------- */

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        purity: initialData.purity,
        unit: initialData.unit,
        weight: initialData.weight,
        buyPremiumUSD: initialData.buyPremium || "",
        sellPremiumUSD: initialData.sellPremium || "",
        buyCharges: initialData.buyCharge || "",
        sellCharges: initialData.sellCharge || "",
      });
      setMintedBarId(initialData._id);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setMintedBarId(null);
    }
  }, [initialData, open]);

  const getPurityFactor = (purity) => {
    const length = String(purity).split(".")[0].length;
    return purity / Math.pow(10, length);
  };


  /* ---------------- Price Calculation ---------------- */

  const prices = useMemo(() => {
    if (!marketData?.Gold?.bid) {
      return { buyAED: "", sellAED: "", buyUSD: "", sellUSD: "" };
    }

    const metalBid = Number(marketData.Gold.bid);
    const unitMultiplier = getUnitMultiplier(formData.weight);
    const purityFactor = getPurityFactor(formData.purity);

    const buyPremium = Number(formData.buyPremiumUSD || 0);
    const sellPremium = Number(formData.sellPremiumUSD || 0);
    const buyCharge = Number(formData.buyCharges || 0);
    const sellCharge = Number(formData.sellCharges || 0);

    // Same constant used in commodity modal for gold items
    const ADDITIONAL_PRICE = 0.5;

    const baseBuy =
      ((metalBid + buyPremium) / OUNCE) *
      exchangeRate *
      formData.unit *
      unitMultiplier *
      purityFactor;

    const baseSell =
      ((metalBid + ADDITIONAL_PRICE + sellPremium) / OUNCE) *
      exchangeRate *
      formData.unit *
      unitMultiplier *
      purityFactor;

    const buyAED = baseBuy + buyCharge;
    const sellAED = baseSell + sellCharge;

    return {
      buyAED: buyAED.toFixed(4),
      sellAED: sellAED.toFixed(4),
      buyUSD: (buyAED / EXCHANGE_RATES.AED).toFixed(4),
      sellUSD: (sellAED / EXCHANGE_RATES.AED).toFixed(4),
    };
  }, [
    formData,
    marketData,
    exchangeRate,
  ]);

  /* ---------------- Handlers ---------------- */

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    []
  );

  const handleSave = async () => {


    if (!formData.name) {
      setToast({ open: true, message: "Minted Bar Name is required" });
      return;
    }

    const payload = {
      adminId,
      name: formData.name,
      purity: Number(formData.purity),
      unit: Number(formData.unit),
      weight: formData.weight,
      buyPremium: Number(formData.buyPremiumUSD || 0),
      sellPremium: Number(formData.sellPremiumUSD || 0),
      buyCharge: Number(formData.buyCharges || 0),
      sellCharge: Number(formData.sellCharges || 0),
    };

    try {
      if (isEditMode) {
        await axiosInstance.patch(`/minted-bars/${mintedBarId}`, payload);
      } else {
        await axiosInstance.post(`/minted-bars`, payload);
      }

      onSave();
      onClose();
    } catch {
      setToast({ open: true, message: "Failed to save Minted Bar" });
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? "Edit Minted Bar" : "Add Minted Bar"}
        </Typography>
        <Button onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {[
            { label: "Minted Bar Name", name: "name", required: true },
            { label: "Purity", name: "purity" },
            { label: "Unit", name: "unit" },
            { label: "Weight", name: "weight" },
            { label: "Buy Premium (USD)", name: "buyPremiumUSD" },
            { label: "Sell Premium (USD)", name: "sellPremiumUSD" },
            { label: `Buy Charges (${currency})`, name: "buyCharges" },
            { label: `Sell Charges (${currency})`, name: "sellCharges" },
          ].map((data) => (
            <Grid item xs={6} key={data.name}>
              {data.name === "purity" ? (
                <TextField
                  select
                  label="Purity"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                >
                  {PURITY_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              ) : data.name === "weight" ? (
                <TextField
                  select
                  label="Weight"
                  name="weight"
                  variant="standard"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="GM">GM</MenuItem>
                  <MenuItem value="KG">KG</MenuItem>
                  <MenuItem value="TOLA">TOLA</MenuItem>
                  <MenuItem value="TTB">TTB</MenuItem>
                  <MenuItem value="OZ">OZ</MenuItem>
                </TextField>
              ) : (
                <TextField
                  label={data.label}
                  name={data.name}
                  value={formData[data.name]}
                  onChange={handleChange}
                  fullWidth
                  required={data.required}
                  variant="standard"

                />
              )}
            </Grid>
          ))}

          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="Buy Price" value={prices.buyAED} disabled fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="Sell Price" value={prices.sellAED} disabled fullWidth />
          </Grid>
        </Grid>
      </DialogContent>


      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {isEditMode ? "Save Changes" : "Save"}
        </Button>
      </DialogActions>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ open: false, message: "" })}
      >
        <Alert severity="error">{toast.message}</Alert>
      </Snackbar>
    </Dialog>
  );
};

export default React.memo(AddMintedBarsModal);
