import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import axiosInstance from "../../axios/axiosInstance";

const CountryGoldRateModal = ({
  open,
  onClose,
  onSave,
  adminId,
  editData,
  existingCountryCodes,
}) => {
  const [countryCode, setCountryCode] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [masterCountries, setMasterCountries] = useState([]);

  const isEditMode = Boolean(editData);

  // Fetch master country list for dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get("/countries");
        if (response.data?.success) {
          setMasterCountries(response.data.countries);
        }
      } catch (error) {
        console.error("Error fetching master countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Filter out already-added countries (except current one in edit mode)
  const availableCountries = masterCountries.filter((c) => {
    if (isEditMode && c.countryCode === editData?.countryCode) return true;
    return !existingCountryCodes.includes(c.countryCode);
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (editData) {
        setCountryCode(editData.countryCode || "");
        setConversionRate(
          editData.conversionRate !== undefined
            ? String(editData.conversionRate)
            : ""
        );
      } else {
        setCountryCode("");
        setConversionRate("");
      }
      setErrors({});
    }
  }, [open, editData]);

  const validate = () => {
    const nextErrors = {};

    if (!countryCode) {
      nextErrors.countryCode = "Please select a country";
    }

    const rate = parseFloat(conversionRate);
    if (!conversionRate || conversionRate === "") {
      nextErrors.conversionRate = "Conversion rate is required";
    } else if (isNaN(rate) || rate <= 0) {
      nextErrors.conversionRate = "Conversion rate must be greater than 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!adminId) {
      toast.error("Admin session not found. Please log in again.");
      return;
    }

    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(
          `/country-gold-rates/${adminId}/${editData._id}`,
          { conversionRate: parseFloat(conversionRate) }
        );
        toast.success("Country updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await axiosInstance.post("/country-gold-rates", {
          adminId,
          countryCode,
          conversionRate: parseFloat(conversionRate),
        });
        toast.success("Country added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      await onSave();
      onClose();
    } catch (error) {
      console.error("Error saving country gold rate:", error);
      const message =
        error.response?.data?.message ||
        "Failed to save. Please try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "15px",
          overflow: "hidden",
          scrollbarWidth: "none",
          background: "#ffffff",
          boxShadow: "0 25px 80px rgba(48,110,187,0.12)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          padding: "1.8rem 2rem",
          borderBottom: "1px solid rgba(48,110,187,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
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
            {isEditMode ? "Edit Country" : "Add Country"}
          </Typography>

          <Typography
            sx={{
              color: "rgba(0,0,0,0.55)",
              fontSize: "0.92rem",
              marginTop: "0.2rem",
            }}
          >
            {isEditMode
              ? "Update conversion rate"
              : "Configure country conversion rate"}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#306ebb",
            background: "rgb(243, 243, 243)",
            position: "relative",
            zIndex: "1",
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
        <Box
          sx={{
            borderRadius: "15px",
            padding: "1.5rem",
            background: "linear-gradient(145deg, #ffffff, #f7fbff)",
            boxShadow: "0 8px 25px rgba(48,110,187,0.08)",
            border: "1px solid #b9d8ff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Icon header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              marginBottom: "1.5rem",
            }}
          >
            <Box
              sx={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #306ebb 0%, #42bce9 50%, #53cabb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow:
                  "0 12px 24px rgba(48,110,187,0.22), inset 0 1px 1px rgba(255,255,255,0.35)",
              }}
            >
              <PublicRoundedIcon sx={{ fontSize: "1.45rem" }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "rgba(0,0,0,0.45)",
                  fontSize: "0.8rem",
                }}
              >
                Country conversion configuration
              </Typography>
            </Box>
          </Box>

          {/* COUNTRY DROPDOWN */}
          <FormControl
            fullWidth
            error={Boolean(errors.countryCode)}
            sx={{
              mb: 2,
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
          >
            <InputLabel>Country *</InputLabel>
            <Select
              value={countryCode}
              onChange={(e) => {
                const selectedCode = e.target.value;
                setCountryCode(selectedCode);

                const selectedCountryObj = availableCountries.find(
                  (c) => c.countryCode === selectedCode
                );
                if (selectedCountryObj && selectedCountryObj.defaultRate !== undefined) {
                  setConversionRate(String(selectedCountryObj.defaultRate));
                }

                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.countryCode;
                  delete next.conversionRate;
                  return next;
                });
              }}
              label="Country *"
              disabled={isEditMode}
            >
              {availableCountries.map((c) => (
                <MenuItem key={c.countryCode} value={c.countryCode}>
                  {c.country}
                </MenuItem>
              ))}
            </Select>
            {errors.countryCode && (
              <FormHelperText>{errors.countryCode}</FormHelperText>
            )}
          </FormControl>

          {/* CONVERSION RATE */}
          <TextField
            fullWidth
            label="Conversion Rate"
            type="text"
            value={conversionRate}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              if (/^\d*\.?\d*$/.test(rawValue)) {
                setConversionRate(rawValue);
                if (errors.conversionRate) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.conversionRate;
                    return next;
                  });
                }
              }
            }}
            error={Boolean(errors.conversionRate)}
            helperText={errors.conversionRate}
            placeholder="e.g. 86.45"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    sx={{
                      color: "#306ebb",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    1 USD =
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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
                fontWeight: 700,
                color: "#111",
              },
            }}
          />
        </Box>

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
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update"
                : "Add Country"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CountryGoldRateModal);
