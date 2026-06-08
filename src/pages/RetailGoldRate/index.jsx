import {
  Box,
  Button,
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import axiosInstance from "../../axios/axiosInstance";
import RetailGoldRateModal from "./RetailGoldRateModal";

const SOCKET_SERVER_URL =
  process.env.REACT_APP_API_URL?.replace("/api", "") || "";
const SOCKET_SECRET =
  process.env.REACT_APP_SOCKET_SECRET_KEY ||
  process.env.REACT_APP_SOCKET_SECRET;

const gradientButtonSx = {
  background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: "0.375rem",
  "&:hover": {
    background: "linear-gradient(310deg, #8a3dd1 0%, #ff339a 100%)",
  },
};

const RetailGoldRate = () => {
  const [rates, setRates] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRetailRates = useCallback(async () => {
    if (!adminId) return;
    try {
      const response = await axiosInstance.get(`/retail-gold-rate/${adminId}`);
      setRates(response.data || []);
    } catch (error) {
      console.error("Error fetching retail gold rates:", error);
      toast.error("Failed to load retail gold rates");
    } finally {
      setIsLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    const loadAdminId = async () => {
      try {
        const userName = localStorage.getItem("userName");
        if (!userName) return;
        const response = await axiosInstance.get(`/data/${userName}`);
        if (response?.data?.data?._id) {
          setAdminId(response.data.data._id);
        }
      } catch (error) {
        console.error("Error loading admin id:", error);
      }
    };
    loadAdminId();
  }, []);

  useEffect(() => {
    if (adminId) {
      setIsLoading(true);
      fetchRetailRates();
    }
  }, [adminId, fetchRetailRates]);

  useEffect(() => {
    if (!adminId || !SOCKET_SERVER_URL || !SOCKET_SECRET) return;

    const socket = io(SOCKET_SERVER_URL, {
      auth: { secret: SOCKET_SECRET },
      transports: ["websocket"],
    });

    socket.on("retail-gold-rate-updated", fetchRetailRates);

    return () => {
      socket.off("retail-gold-rate-updated", fetchRetailRates);
      socket.disconnect();
    };
  }, [adminId, fetchRetailRates]);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleSaveRates = useCallback(async () => {
    toast.success("Rates saved successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    await fetchRetailRates();
  }, [fetchRetailRates]);

  const sortedRates = useMemo(
    () =>
      [...rates].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
      ),
    [rates],
  );

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {Array.from({ length: 3 }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (sortedRates.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
            No rates found. Click UPDATE RATES to set prices.
          </TableCell>
        </TableRow>
      );
    }

    return sortedRates.map((row) => (
      <TableRow
        key={row._id || row.name}
        sx={{
          borderTop: "2px double #e0e0e0",
          borderBottom: "2px double #e0e0e0",
        }}
      >
        <TableCell>{row.name}</TableCell>
        <TableCell>{parseFloat(row.rate || 0).toFixed(2)}</TableCell>
        <TableCell>{row.unit || "AED"}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F6F8FB",
        padding: "2rem",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            Retail Gold Rates
          </Typography>

          <Typography
            sx={{
              color: "#6B7280",
              fontSize: "0.9rem",
              mt: "0.3rem",
            }}
          >
            Live jewellery display pricing management
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenModal}
          className="primary-btn"
        >
          Update Rates
        </Button>
      </Box>

      {/* TABLE CARD */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          background: "#fff",
        }}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: "transparent",
          }}
        >
          <Table>
            {/* TABLE HEAD */}
            <TableHead>
              <TableRow
                sx={{
                  background: "#FAFAFA",
                }}
              >
                {["Gold Type", "Rate", "Currency"].map((label) => (
                  <TableCell
                    key={label}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.74rem",
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderBottom: "1px solid #ECEFF3",
                      padding: "1rem 1.4rem",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* TABLE BODY */}
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 3 }).map((__, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          borderBottom: "1px solid #F3F4F6",
                          padding: "1rem 1.4rem",
                        }}
                      >
                        <Skeleton
                          variant="rounded"
                          height={30}
                          sx={{
                            borderRadius: "8px",
                            maxWidth: cellIndex === 0 ? 180 : 90,
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sortedRates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      py: 8,
                      color: "#9CA3AF",
                      borderBottom: "none",
                    }}
                  >
                    No rates found
                  </TableCell>
                </TableRow>
              ) : (
                sortedRates.map((row, idx) => {
                  const isLast = idx === sortedRates.length - 1;

                  return (
                    <TableRow
                      key={row._id || row.name}
                      sx={{
                        transition: "0.2s ease",

                        "&:hover": {
                          background: "#FAFBFC",
                        },

                        "& td": {
                          borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                          padding: "1rem 1.4rem",
                        },
                      }}
                    >
                      {/* GOLD TYPE */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.9rem",
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: "12px",
                              // background:
                              //   "linear-gradient(135deg, #306ebb 0%, #42bce9 100%)",
                                border: "1px solid #306ebb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#306ebb",
                              fontWeight: 800,
                              fontSize: "0.78rem",
                              boxShadow: "0 8px 18px rgba(48,110,187,0.05)",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {row.name?.split("K")[0]}K
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                color: "#111827",
                              }}
                            >
                              {row.name}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: "#9CA3AF",
                                mt: "2px",
                              }}
                            >
                              Live retail pricing
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* RATE */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#111827",
                          }}
                        >
                          {Number(row.rate || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}{" "}
                        </Typography>
                      </TableCell>

                      {/* CURRENCY */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: "0.8rem",
                            py: "0.35rem",
                            borderRadius: "999px",
                            // background: "#F3F7FC",
                            border: "1px solid #DCEAF8",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              color: "#306ebb",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {row.unit || "AED"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FOOTER */}
        {!isLoading && sortedRates.length > 0 && (
          <Box
            sx={{
              px: "1.4rem",
              py: "0.8rem",
              borderTop: "1px solid #F3F4F6",
              background: "#FAFAFA",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.74rem",
                color: "#9CA3AF",
                fontWeight: 500,
              }}
            >
              Rates are synced live automatically
            </Typography>
          </Box>
        )}
      </Paper>

      <RetailGoldRateModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveRates}
        existingRates={rates}
        adminId={adminId}
      />

      <ToastContainer />
    </Box>
  );
};

export default React.memo(RetailGoldRate);
