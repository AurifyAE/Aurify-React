import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosInstance";
import CountryGoldRateModal from "./CountryGoldRateModal";

const CountryGoldRateSection = ({ adminId, goldBidSpot }) => {
  const [countries, setCountries] = useState([]);
  const [countryRatesLoading, setCountryRatesLoading] = useState(true);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [countryEditData, setCountryEditData] = useState(null);
  const [countryDeleteDialogOpen, setCountryDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const fetchCountryRates = useCallback(async () => {
    if (!adminId) return;
    try {
      setCountryRatesLoading(true);
      const response = await axiosInstance.get(
        `/country-gold-rates/${adminId}`
      );
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error("Error fetching country gold rates:", error);
      toast.error("Failed to load country gold rates");
    } finally {
      setCountryRatesLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) {
      fetchCountryRates();
    }
  }, [adminId, fetchCountryRates]);

  const existingCountryCodes = useMemo(() => {
    return countries.map((c) => c.countryCode.toUpperCase());
  }, [countries]);

  const handleOpenAddCountryModal = useCallback(() => {
    setCountryEditData(null);
    setCountryModalOpen(true);
  }, []);

  const handleOpenEditCountryModal = useCallback((country) => {
    setCountryEditData(country);
    setCountryModalOpen(true);
  }, []);

  const handleCloseCountryModal = useCallback(() => {
    setCountryModalOpen(false);
    setCountryEditData(null);
  }, []);

  const handleSaveCountrySuccess = useCallback(async () => {
    await fetchCountryRates();
  }, [fetchCountryRates]);

  const handleDeleteCountryClick = useCallback((country) => {
    setCountryToDelete(country);
    setCountryDeleteDialogOpen(true);
  }, []);

  const handleDeleteCountryConfirm = useCallback(async () => {
    if (!countryToDelete) return;
    try {
      await axiosInstance.delete(
        `/country-gold-rates/${adminId}/${countryToDelete._id}`
      );
      toast.success("Country deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setCountryDeleteDialogOpen(false);
      setCountryToDelete(null);
      await fetchCountryRates();
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.error("Failed to delete country");
    }
  }, [adminId, countryToDelete, fetchCountryRates]);

  const handleDeleteCountryCancel = useCallback(() => {
    setCountryDeleteDialogOpen(false);
    setCountryToDelete(null);
  }, []);

  const handleCloseCountryDeleteDialog = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    handleDeleteCountryCancel();
  };

  return (
    <Box sx={{ mt: 8 }}>
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-t-lg border-b border-gray-200 text-gray-500">
        <div className="flex items-center gap-4  ">
          <Typography
            className="font-black text-xl tracking-wide"
            color="text.primary"
            sx={{ fontWeight: "bold" }}
          >
            Country Gold Conversion Rates
          </Typography>
          {goldBidSpot > 0 && (
            <div className="flex items-center gap-2 bg-[#53CABB]/10 px-3 py-1 rounded-full text-xs font-semibold text-[#306EBB]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Gold Bid Spot: {goldBidSpot.toFixed(2)} USD</span>
            </div>
          )}
        </div>
        <Button
          variant="contained"
          onClick={handleOpenAddCountryModal}
          className="primary-btn"
        >
          ADD COUNTRY
        </Button>
      </div>
      <TableContainer component={Paper} className="shadow-lg">
        <Table sx={{ minWidth: 650 }} aria-label="country conversion table">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Conversion Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Live 1gm Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countryRatesLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 4 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : countries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary", py: 4 }}>
                  No countries configured. Click "ADD COUNTRY" to get started.
                </TableCell>
              </TableRow>
            ) : (
              countries.map((row) => {
                const livePrice =
                  goldBidSpot > 0
                    ? (goldBidSpot / 31.1035) * row.conversionRate
                    : null;

                return (
                  <TableRow key={row._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{row.countryCode}</span>
                        <span className="text-gray-500">- {row.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>{row.conversionRate}</TableCell>
                    <TableCell>
                      {livePrice !== null ? (
                        <span className="font-semibold text-green-600">
                          {row.currency} {livePrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">Waiting...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEditCountryModal(row)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "10px",
                          background: "#fff",
                          color: "#306ebb",
                          border: "1px solid #e5e7eb",
                          transition: "all 0.2s ease",
                          margin: "1px",
                          "&:hover": {
                            background: "#f4f8ff",
                            borderColor: "#b9d8ff",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(48,110,187,0.12)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCountryClick(row)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "10px",
                          background: "#fff",
                          color: "#ef4444",
                          border: "1px solid #e5e7eb",
                          transition: "all 0.2s ease",
                          margin: "1px",
                          "&:hover": {
                            background: "#fef2f2",
                            borderColor: "#fecaca",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(239,68,68,0.12)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CountryGoldRateModal
        open={countryModalOpen}
        onClose={handleCloseCountryModal}
        onSave={handleSaveCountrySuccess}
        adminId={adminId}
        editData={countryEditData}
        existingCountryCodes={existingCountryCodes}
      />

      <Dialog
        open={countryDeleteDialogOpen}
        onClose={handleCloseCountryDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown={true}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ marginTop: 2 }}
          >
            Are you sure you want to delete <strong>{countryToDelete?.country}</strong> ({countryToDelete?.countryCode})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 1 }}>
          <Button
            onClick={handleDeleteCountryCancel}
            sx={{
              color: "#7928CA",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(121, 40, 202, 0.1)",
              },
            }}
          >
              Cancel
          </Button>
          <Button
            onClick={handleDeleteCountryConfirm}
            sx={{
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                background:
                  "linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)",
              },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(CountryGoldRateSection);
