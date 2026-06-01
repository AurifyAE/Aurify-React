import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import axiosInstance from "../../axios/axiosInstance";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
export const DEFAULT_GOLD_RATES = [
  { name: "14K Gold", rate: "", unit: "AED" },
  { name: "21K Gold", rate: "", unit: "AED" },
  { name: "22K Gold", rate: "", unit: "AED" },
  { name: "24K Gold", rate: "", unit: "AED" },
];

const gradientButtonSx = {
  background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)",
  },
};

const sortByDisplayOrder = (rates = []) =>
  [...rates].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

const buildRatesFromExisting = (existingRates = []) => {
  const sorted = sortByDisplayOrder(existingRates);

  return DEFAULT_GOLD_RATES.map((defaultItem, index) => {
    const found = sorted[index];
    return {
      _id: found?._id,
      name: found?.name ?? defaultItem.name,
      rate:
        found && found.rate !== undefined && found.rate !== null
          ? String(found.rate)
          : "",
      unit: found?.unit || "AED",
    };
  });
};

const RetailGoldRateModal = ({
  open,
  onClose,
  onSave,
  existingRates,
  adminId,
}) => {
  const [rates, setRates] = useState(DEFAULT_GOLD_RATES);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const resetRates = useCallback(() => {
    setRates(buildRatesFromExisting(existingRates));
    setErrors({});
  }, [existingRates]);

  useEffect(() => {
    if (open) {
      resetRates();
    }
  }, [open, resetRates]);

  const handleRateChange = (index, value) => {
    setRates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, rate: value } : item)),
    );
    if (errors[`rate-${index}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`rate-${index}`];
        return next;
      });
    }
  };

  const handleNameChange = (index, value) => {
    setRates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item)),
    );
    if (errors[`name-${index}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`name-${index}`];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    rates.forEach((item, index) => {
      if (!item.name?.trim()) {
        nextErrors[`name-${index}`] = "Name is required";
      }
      if (item.rate === "" || item.rate === null) {
        nextErrors[`rate-${index}`] = "Rate is required";
      } else if (isNaN(parseFloat(item.rate))) {
        nextErrors[`rate-${index}`] = "Rate must be numeric";
      } else if (parseFloat(item.rate) < 0) {
        nextErrors[`rate-${index}`] = "Rate cannot be negative";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!adminId) {
      toast.error("Admin session not found. Please log in again.");
      return;
    }

    if (!validate()) {
      toast.error("Please enter valid names and rates for all gold types.");
      return;
    }

    setSaving(true);
    try {
      const latestRes = await axiosInstance.get(`/retail-gold-rate/${adminId}`);
      const latestSorted = sortByDisplayOrder(latestRes.data || []);

      for (let index = 0; index < rates.length; index++) {
        const item = rates[index];
        const payload = {
          name: item.name.trim(),
          rate: parseFloat(item.rate),
          unit: item.unit || "AED",
        };

        const existingId = item._id || latestSorted[index]?._id;

        if (existingId) {
          await axiosInstance.patch(`/retail-gold-rate/${existingId}`, payload);
        } else {
          await axiosInstance.post("/retail-gold-rate", {
            adminId,
            ...payload,
          });
        }
      }

      await onSave();
      onClose();
    } catch (error) {
      console.error("Error saving retail gold rates:", error);
      const message =
        error.response?.data?.message ||
        "Failed to save rates. Please try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "15px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 8px 25px rgba(48,110,187,0.08)",
          boxShadow: "0 25px 80px rgba(48,110,187,0.12)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        // className='card-line'
        sx={{
          padding: "1.8rem 2rem",
          borderBottom: "1px solid rgba(48,110,187,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: 'relative',
          overflow: 'hidden',
          background:
            "linear-gradient(90deg, rgba(48,110,187,0.12), rgba(255,255,255,1))",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#111",
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            Retail Gold Rates
          </Typography>

          <Typography
            sx={{
              color: "rgba(0,0,0,0.55)",
              fontSize: "0.92rem",
              marginTop: "0.2rem",
            }}
          >
            Manage live jewellery display rates
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#306ebb",
            background: "rgb(243, 243, 243)",
            position: 'relative',
            zIndex: '1',

            "&:hover": {
              background: "rgb(238, 238, 238)",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* CONTENT */}
      <DialogContent sx={{ padding: "2rem" }}>
        <Grid container spacing={2.5}>
          {rates.map((item, index) => (
            <Grid item xs={12} sm={6} key={item._id || `slot-${index}`}>
              <Box

                sx={{
                  position: "relative",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  background: "linear-gradient(145deg, #ffffff, #f7fbff)",
                  boxShadow: "0 8px 25px rgba(48,110,187,0.08)",
                  overflow: "hidden",
                  transition: "0.3s",
                  borderColor: "#b9d8ff",
                  borderWidth: "1px",

                  "&:hover": {
                    boxShadow: "0 15px 35px rgba(48,110,187,0.12)",
                  },
                }}
              >
                {/* BLUE GLOW */}
                <Box
                      className='card-line'

                  sx={{
                    position: "absolute",
                    top: "-0",
                    right: "-0",
                    width: "120px",
                    height: "120px",
                   opacity:'0.5'
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    marginBottom: "1.2rem",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #306ebb 0%, #42bce9 50%, #53cabb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: `
      0 12px 24px rgba(48,110,187,0.22),
      inset 0 1px 1px rgba(255,255,255,0.35)
    `,
                      overflow: "hidden",
                    }}
                  >
                    {/* glow layer */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "-12px",
                        right: "-12px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.22)",
                        filter: "blur(4px)",
                      }}
                    />

                    <AutoAwesomeRoundedIcon
                      sx={{
                        fontSize: "1.45rem",
                        zIndex: 1,
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: "rgba(0,0,0,0.45)",
                        fontSize: "0.8rem",
                      }}
                    >
                      Live display rate
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Gold type name"
                  value={item.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  error={Boolean(errors[`name-${index}`])}
                  helperText={errors[`name-${index}`]}
                  placeholder="e.g. 14K Gold"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DriveFileRenameOutlineRoundedIcon
                          sx={{ color: "#306ebb" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                      "& fieldset": {
                        borderColor: "rgba(48,110,187,0.28)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#42bce9",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#306ebb",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type="text"
                  value={
                    item.rate
                      ? Number(
                        String(item.rate).replace(/,/g, ""),
                      ).toLocaleString("en-IN")
                      : ""
                  }
                  // onChange={(e) => {
                  //   const rawValue = e.target.value.replace(/,/g, "");

                  //    if (/^\d*\.?\d*$/.test(rawValue)) {
                  //     handleRateChange(index, rawValue);
                  //   }
                  // }}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");

                    // allow only numbers + decimal
                    if (/^\d*\.?\d*$/.test(rawValue)) {

                      // warning only
                      if (Number(rawValue) > 1000000) {
                        toast.warning(
                          "Warning: This gold rate looks unusually high",
                          {
                            toastId: "high-rate-warning",
                          }
                        );
                      }

                      handleRateChange(index, rawValue);
                    }
                  }}
                  error={Boolean(errors[`rate-${index}`])}
                  helperText={errors[`rate-${index}`]}
                  placeholder="Enter Gold Rate"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyExchangeRoundedIcon
                          sx={{
                            color: "#306ebb",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                      color: "#111",
                      fontSize: "1.2rem",
                      fontWeight: 700,

                      "& fieldset": {
                        borderColor: "rgba(48,110,187,0.28)",
                        borderWidth: "1.5px",
                      },

                      "&:hover fieldset": {
                        borderColor: "#42bce9",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#306ebb",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 4px rgba(66,188,233,0.12)",
                      },
                    },

                    "& input": {
                      color: "#111",
                      fontWeight: 700,
                    },

                    "& .MuiFormHelperText-root": {
                      color: "#ff4d4f",
                      marginLeft: "4px",
                    },
                  }}
                />

                <Typography
                  sx={{
                    color: "rgba(0,0,0,0.45)",
                    fontSize: "0.78rem",
                    marginTop: "0.8rem",
                  }}
                >
                  Currency: {item.unit}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ACTIONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <Button onClick={onClose} className="primary-btn cancel-btn">
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="primary-btn"
          >
            {saving ? "Saving..." : "Save Rates"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(RetailGoldRateModal);
