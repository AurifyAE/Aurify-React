import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../axios/axiosInstance";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
  ButtonGroup,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, Toaster } from "react-hot-toast";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from "@react-pdf/renderer";
// Register fonts
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

Font.register({
  family: "Roboto-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});

// Enhanced PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  watermarkContainer: {
    position: "absolute",
    top: "50%",
    // left: '20%',
    transform: "translate(-50%, -50%) rotate(-45deg)",
    opacity: 0.04,
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 100,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  companyDetails: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.6,
  },
  invoiceDetails: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#64748b",
  },
  invoiceDate: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 5,
  },
  billingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  billingBox: {
    width: "48%",
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
  },
  billingTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  billingInfo: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.6,
  },
  table: {
    marginBottom: 30,
  },
  productImage: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    padding: 10,
    color: "#ffffff",
  },
  tableCellHeader: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 10,
  },
  tableCell: {
    fontSize: 9,
    // marginLeft:20,
    // marginRight:30,
    color: "#334155",
  },
  productName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 8,
    color: "#64748b",
  },
  summary: {
    marginLeft: "auto",
    width: "40%",
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 10,
    color: "#334155",
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: "#e2e8f0",
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  termsSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  termsText: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#1e3a8a",
    fontWeight: "bold",
    marginBottom: 5,
  },
  footerContact: {
    fontSize: 9,
    color: "#64748b",
  },
});

const ImageWithFallback = ({ src, style }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(`/proxy-image`, {
          params: { url: src },
          responseType: "blob", // Ensure binary response
        });

        // Convert blob response to a valid URL
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          // Ensure base64 starts with data:image prefix
          const base64Image = reader.result.startsWith("data:image")
            ? reader.result
            : `data:image/jpeg;base64,${reader.result}`;
          setImageSrc(base64Image);
        };
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
      }
    };

    fetchImage();
  }, [src]);

  if (error) {
    return <Text style={styles.noImageText}>No Image Available</Text>;
  }

  return imageSrc ? (
    <Image style={style} src={imageSrc} />
  ) : (
    <Text>Loading...</Text>
  );
};

const OrdersPDF = ({ orders, admin }) => {
  console.log(orders)
  // Convert company name to watermark text
  const watermarkText = admin?.companyName || "INVOICE";

  return (
    <Document>
      {orders.map((order) => (
        <Page size="A4" style={styles.page} key={order._id}>
          {/* Large Watermark Text */}
          <View style={styles.watermarkContainer}>
            <Text style={styles.watermarkText}>{watermarkText}</Text>
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.companyName}>
                {admin?.companyName || "Company Name"}
              </Text>
              <Text style={styles.companyDetails}>
                {admin?.address || "Business Address"}
                {"\n"}
                Tel: {admin?.contact || "N/A"}
                {"\n"}
                Email: {admin?.email || "contact@company.com"}
                {"\n"}
                {/* TRN: {admin?.trn || "N/A"} */}
              </Text>
            </View>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceTitle}>Delivery Note</Text>
              <Text style={styles.invoiceNumber}>#{order.transactionId}</Text>
              <Text style={styles.invoiceDate}>
                Date: {new Date(order.deliveryDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.billingSection}>
            <View style={styles.billingBox}>
              <Text style={styles.billingTitle}>Bill To:</Text>
              <Text style={styles.billingInfo}>
                {order.customer?.name || "N/A"}
                {"\n"}
                {order.customer?.location || "N/A"}
                {"\n"}
                Phone: {order.customer?.contact || "N/A"}
                {"\n"}
                {order.customer?.email || "N/A"}
              </Text>
            </View>
            <View style={styles.billingBox}>
              <Text style={styles.billingTitle}>Payment Details:</Text>
              <Text style={styles.billingInfo}>
                Method: {order.paymentMethod}
                {"\n"}
                Order Date: {new Date(order.deliveryDate).toLocaleDateString()}
                {"\n"}
                Transaction ID: {order.transactionId}
              </Text>
            </View>
          </View>

          {/* Products Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Image</Text>
              <Text style={[styles.tableCellHeader, { flex: 2.5 }]}>
                Item Description
              </Text>
              <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Qty</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>
              Pricing Option
              </Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Amount</Text>
            </View>

            {order.items.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff" },
                ]}
                key={item._id}
              >
                {/* Product Image with Error Handling */}
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <ImageWithFallback
                    src={item.product.images?.[0]}
                    style={styles.productImage}
                  />
                </View>
                {/* Product Info */}
                <View style={[styles.tableCell, { flex: 2.5 }]}>
                  <Text style={styles.productName}>{item.product.title}</Text>
                  <Text style={styles.productDetails}>
                    Purity: {item.product.purity} | Weight:{" "}
                    {item.product.weight}g
                  </Text>
                </View>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{order.pricingOption || 'Standard'}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {order.pricingOption === 'Discount' ? 
                    `${order.discountAmount}` : 
                    order.pricingOption === 'Premium' ? 
                    `${order.premiumAmount}` : 
                    'N/A'}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary Section */}
          {/* <View style={styles.summary}> */}
          {/* <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>AED {order.totalPrice.toFixed(2)}</Text>
            </View> */}
          {/* <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (5%):</Text>
              <Text style={styles.summaryValue}>
                AED {(order.totalPrice * 0.05).toFixed(2)}
              </Text>
            </View> */}
          {/* <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>
                AED {(order.totalPrice ).toFixed(2)}
              </Text>
            </View> */}
          {/* </View> */}

          {/* Terms Section */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            <Text style={styles.termsText}>
              • All prices are in AED and include VAT where applicable{"\n"}•
              Payment is due upon receipt of delivery{"\n"}• Goods once sold
              cannot be returned{"\n"}• This is a computer-generated delivery
              note and requires no signature
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thank you for your business!</Text>
            <Text style={styles.footerContact}>
              For any queries, please contact:{" "}
              {admin?.contact || "support@company.com"}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [modals, setModals] = useState({
    user: false,
    remark: false,
    quantity: false,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [remark, setRemark] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const adminId = localStorage.getItem("adminId");
  const userName = localStorage.getItem("userName");
  const orderStatuses = [
    "Rejected",
    "Success",
    "User Approval Pending",
    "Processing",
  ];

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/booking/${adminId}`);
      const newOrders = response.data.orderDetails;

      setOrders((prevOrders) => {
        const hasChanges =
          JSON.stringify(prevOrders) !== JSON.stringify(newOrders);
        if (hasChanges && prevOrders.length > 0) {
          toast.success("New orders received!");
        }
        return newOrders;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders.");
    }
  }, [adminId]);

  const fetchAdmin = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/data/${userName}`);
      setAdmin(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load adminData.");
    }
  }, [userName]);
  // Filter orders when active filter or orders change
  useEffect(() => {
    if (orders) {
      if (activeFilter === "All") {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(
          orders.filter((order) => order.orderStatus === activeFilter)
        );
      }
    }
  }, [orders, activeFilter]);
  useEffect(() => {
    fetchAdmin();
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let intervalId;
    if (isPolling) {
      intervalId = setInterval(() => {
        fetchOrders();
      }, 30000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchOrders, isPolling]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPolling(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "Rejected") {
      setSelectedOrder(orderId);
      setModals((prev) => ({ ...prev, remark: true }));
      return;
    }

    try {
      await axiosInstance.put(`/update-order/${orderId}`, {
        orderStatus: newStatus,
      });
      await fetchOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error(error);
      setError("Failed to update order status.");
    }
  };

  const handleApproval = async (order, item) => {
    if (item.quantity <= 1) {
      try {
        await axiosInstance.put(`/update-order-quantity/${order._id}`, {
          itemStatus: "Approved",
          itemId: item._id,
          fixedPrice: item.fixedPrice,
          quantity: item.quantity,
        });
        toast.success("Order status updated successfully");
        await fetchOrders();
      } catch (error) {
        setError("Failed to update order status.");
      }
    } else {
      setSelectedOrder(order);
      setSelectedProduct(item);
      setQuantity(item.quantity);
      setModals((prev) => ({ ...prev, quantity: true }));
    }
  };

  const handleQuantitySubmit = async () => {
    try {
      await axiosInstance.put(`/update-order-quantity/${selectedOrder._id}`, {
        itemStatus: "User Approval Pending",
        itemId: selectedProduct._id,
        fixedPrice: selectedProduct.fixedPrice,
        quantity: quantity,
      });

      setModals((prev) => ({ ...prev, quantity: false }));
      await fetchOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      setError("Failed to update quantity and order status.");
    }
  };

  const handleRemarkSubmit = async () => {
    try {
      await axiosInstance.put(`/update-order-reject/${selectedOrder}`, {
        orderStatus: "Rejected",
        remark,
      });
      setModals((prev) => ({ ...prev, remark: false }));
      setRemark("");
      await fetchOrders();
      toast.success("Order has been rejected");
    } catch (error) {
      setError("Failed to update remark.");
    }
  };

  const handleViewUser = async (order) => {
    try {
      setUserDetails(order.customer);
      setSelectedOrder(order);
      setModals((prev) => ({ ...prev, user: true }));
    } catch (error) {
      setError("Failed to fetch user details.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="-mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      {/* Filter and Export Section */}
      <Box
        sx={{
          mb: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ButtonGroup variant="contained" color="primary">
          <Button
            onClick={() => setActiveFilter("All")}
            variant={activeFilter === "All" ? "contained" : "outlined"}
          >
            All Orders
          </Button>
          {orderStatuses.map((status) => (
            <Button
              key={status}
              onClick={() => setActiveFilter(status)}
              variant={activeFilter === status ? "contained" : "outlined"}
            >
              {status}
            </Button>
          ))}
        </ButtonGroup>

        <PDFDownloadLink
          className="mr-10"
          document={<OrdersPDF orders={filteredOrders} admin={admin} />}
          fileName="orders-report.pdf"
        >
          {({ blob, url, loading, error }) => (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              disabled={loading}
            >
              {loading ? "Generating PDF..." : "Export to PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </Box>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "48px" }}></TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pricing Option</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              (rowsPerPage > 0
                ? filteredOrders.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredOrders
              ).map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleOrderExpansion(order._id)}
                      >
                        {expandedOrders[order._id] ? (
                          <KeyboardArrowDown />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{order.transactionId}</TableCell>
                    <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`status-label-${order._id}`}>
                          Update Status
                        </InputLabel>
                        <Select
                          labelId={`status-label-${order._id}`}
                          value={order.orderStatus || ""}
                          label="Update Status"
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          {orderStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{order.pricingOption}</TableCell>
                    <TableCell>
                      {order.pricingOption === "Discount"
                        ? `${order.discountAmount}`
                        : order.pricingOption === "Premium"
                        ? `${order.premiumAmount}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleViewUser(order)}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View User
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedOrders[order._id] && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Product Image</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Purity</TableCell>
                                <TableCell>Weight</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.items.map((item) => (
                                <TableRow key={item._id}>
                                  <TableCell>{item.product.title}</TableCell>
                                  <TableCell>
                                    <Tooltip title={item.product.title} arrow>
                                      <Avatar
                                        alt={item.product.title}
                                        src={item.product.images[0]}
                                        sx={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: "10px",
                                          border: "none",
                                          boxShadow: "none",
                                        }}
                                      />
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    {/* AED {item.product.price.toFixed(2)} */}
                                  </TableCell>
                                  <TableCell>{item.product.purity}</TableCell>
                                  <TableCell>{item.product.weight}g</TableCell>
                                  <TableCell>
                                    {item.itemStatus === "Approval Pending" ? (
                                      <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        onClick={() =>
                                          handleApproval(order, item)
                                        }
                                      >
                                        Approve Pending
                                      </Button>
                                    ) : item.itemStatus === "Approved" ? (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                      >
                                        Approved
                                      </Button>
                                    ) : item.itemStatus ===
                                      "User Approval Pending" ? (
                                      <Button
                                        variant="contained"
                                        color="info"
                                        size="small"
                                        onClick={() =>
                                          handleApproval(order, item)
                                        }
                                      >
                                        User Approval Pending
                                      </Button>
                                    ) : item.itemStatus === "Rejected" ? (
                                      <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                      >
                                        Rejected
                                      </Button>
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Orders Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* User Details Modal */}
      <Modal
        open={modals.user}
        onClose={() => setModals((prev) => ({ ...prev, user: false }))}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">User Details</h2>
          {userDetails && (
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Location:</strong> {userDetails.location}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.contact}
              </p>
              <Button
                variant="contained"
                onClick={() => setModals((prev) => ({ ...prev, user: false }))}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      {/* Remark Modal */}
      <Modal
        open={modals.remark}
        onClose={() => setModals((prev) => ({ ...prev, remark: false }))}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Enter Remark</h2>
          <TextField
            label="Remark"
            fullWidth
            multiline
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleRemarkSubmit}
              color="primary"
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => setModals((prev) => ({ ...prev, remark: false }))}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Quantity Update Modal */}
      <Modal
        open={modals.quantity}
        onClose={() => setModals((prev) => ({ ...prev, quantity: false }))}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Update Product Quantity</h2>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleQuantitySubmit}
              color="primary"
            >
              Update
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setModals((prev) => ({ ...prev, quantity: false }))
              }
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default OrderManagement;
