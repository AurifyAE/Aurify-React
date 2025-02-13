import React, { useState, useEffect, useCallback, memo } from "react";
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
  console.log(orders);
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
                Date:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
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
                Order Date:{" "}
                {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
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
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {order.pricingOption ? order.pricingOption : "Nil"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {order.pricingOption === "Discount"
                    ? order.discountAmount && order.discountAmount !== 0
                      ? order.discountAmount
                      : "Nil"
                    : order.pricingOption === "Premium"
                    ? order.premiumAmount && order.premiumAmount !== 0
                      ? order.premiumAmount
                      : "Nil"
                    : "Nil"}
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
// Components
const UserDetailsModal = memo(({ open, onClose, userDetails }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 420,
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar sx={{ width: 80, height: 80, bgcolor: "#3B82F6" }}>
          {userDetails?.name ? userDetails.name[0].toUpperCase() : "U"}
        </Avatar>

        <h2 className="text-2xl font-bold text-gray-800">User Details</h2>

        <div className="w-full bg-gray-100 p-4 rounded-lg text-left space-y-2">
          <p className="text-gray-700">
            <strong className="text-gray-900">Name:</strong>{" "}
            {userDetails?.name || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-gray-900">Email:</strong>{" "}
            {userDetails?.email || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-gray-900">Phone:</strong>{" "}
            {userDetails?.contact || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-gray-900">Location:</strong>{" "}
            {userDetails?.location || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="text-gray-900">Cash Balance:</strong>{" "}
            {userDetails?.cashBalance?.toFixed(2) || "0.00"}
          </p>
          <p className="text-gray-700">
            <strong className="text-gray-900">Gold Balance:</strong>{" "}
            {userDetails?.goldBalance?.toFixed(2) || "0.00"}
          </p>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ width: "100%" }}
        >
          Close
        </Button>
      </div>
    </Box>
  </Modal>
));

const RemarkModal = memo(({ open, onClose, remark, setRemark, onSubmit }) => (
  <Modal open={open} onClose={onClose}>
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
        <Button variant="contained" onClick={onSubmit} color="primary">
          Submit
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  </Modal>
));

const QuantityModal = memo(
  ({ open, onClose, quantity, setQuantity, onSubmit }) => (
    <Modal open={open} onClose={onClose}>
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
          <Button variant="contained" onClick={onSubmit} color="primary">
            Update
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
);

// Main Component
const OrderManagement = () => {
  // State management with custom hooks
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

  // Optimized API calls with useCallback
  const fetchOrders = useCallback(async () => {
    const loadingToastId = toast.loading("Fetching orders...");
    try {
      const response = await axiosInstance.get(`/booking/${adminId}`);
      const newOrders = response.data.orderDetails;

      setOrders((prevOrders) => {
        const hasChanges =
          JSON.stringify(prevOrders) !== JSON.stringify(newOrders);
        if (hasChanges && prevOrders.length > 0) {
          toast.success("Orders updated!", {
            id: loadingToastId,
            duration: 3000,
          });
        } else {
          toast.dismiss(loadingToastId);
        }
        return newOrders;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders", { id: loadingToastId });
      setError("Failed to load orders.");
    }
  }, [adminId]);

  const fetchAdmin = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/data/${userName}`);
      setAdmin(response.data.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
      setError("Failed to load admin data.");
    }
  }, [userName]);

  // Optimized status update handler
  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;

    if (newStatus === "Rejected") {
      setSelectedOrder(orderId);
      setModals((prev) => ({ ...prev, remark: true }));
      return;
    }

    const loadingToastId = toast.loading("Updating status...");
    try {
      await axiosInstance.put(`/update-order/${orderId}`, {
        orderStatus: newStatus,
      });

      // Optimistic update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      toast.success("Status updated successfully", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status", { id: loadingToastId });
      setError("Failed to update order status.");
    }
  };

  // Optimized approval handler
  const handleApproval = async (order, item) => {
    if (!order._id || !item._id) return;

    if (item.quantity <= 1) {
      const loadingToastId = toast.loading("Processing approval...");
      try {
        await axiosInstance.put(`/update-order-quantity/${order._id}`, {
          itemStatus: "Approved",
          itemId: item._id,
          fixedPrice: item.fixedPrice,
          quantity: item.quantity,
        });

        // Optimistic update
        setOrders((prevOrders) =>
          prevOrders.map((prevOrder) =>
            prevOrder._id === order._id
              ? {
                  ...prevOrder,
                  items: prevOrder.items.map((prevItem) =>
                    prevItem._id === item._id
                      ? { ...prevItem, itemStatus: "Approved" }
                      : prevItem
                  ),
                }
              : prevOrder
          )
        );

        toast.success("Order approved", {
          id: loadingToastId,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error approving order:", error);
        toast.error("Failed to approve order", { id: loadingToastId });
        setError("Failed to approve order.");
      }
    } else {
      setSelectedOrder(order);
      setSelectedProduct(item);
      setQuantity(item.quantity);
      setModals((prev) => ({ ...prev, quantity: true }));
    }
  };

  // Optimized quantity submission handler
  const handleQuantitySubmit = async () => {
    if (!selectedOrder?._id || !selectedProduct?._id) return;

    const loadingToastId = toast.loading("Updating quantity...");
    try {
      await axiosInstance.put(`/update-order-quantity/${selectedOrder._id}`, {
        itemStatus: "User Approval Pending",
        itemId: selectedProduct._id,
        fixedPrice: selectedProduct.fixedPrice,
        quantity: quantity,
      });

      // Optimistic update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === selectedProduct._id
                    ? {
                        ...item,
                        quantity,
                        itemStatus: "User Approval Pending",
                      }
                    : item
                ),
              }
            : order
        )
      );

      setModals((prev) => ({ ...prev, quantity: false }));
      toast.success("Quantity updated", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity", { id: loadingToastId });
      setError("Failed to update quantity.");
    }
  };

  // Optimized remark submission handler
  const handleRemarkSubmit = async () => {
    if (!selectedOrder || !remark.trim()) return;

    const loadingToastId = toast.loading("Submitting remark...");
    try {
      await axiosInstance.put(`/update-order-reject/${selectedOrder}`, {
        orderStatus: "Rejected",
        remark,
      });

      // Optimistic update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder
            ? { ...order, orderStatus: "Rejected", remark }
            : order
        )
      );

      setModals((prev) => ({ ...prev, remark: false }));
      setRemark("");
      toast.success("Order rejected", {
        id: loadingToastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting remark:", error);
      toast.error("Failed to submit remark", { id: loadingToastId });
      setError("Failed to submit remark.");
    }
  };

  // Effects
  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Optimized polling with debounce
  useEffect(() => {
    let timeoutId;

    const debouncedFetch = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (isPolling) {
          fetchOrders();
        }
      }, 30000);
    };

    debouncedFetch();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
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

  // Filter orders when active filter changes
  useEffect(() => {
    if (orders) {
      setFilteredOrders(
        activeFilter === "All"
          ? orders
          : orders.filter((order) => order.orderStatus === activeFilter)
      );
    }
  }, [orders, activeFilter]);

  // Utility functions
  const toggleOrderExpansion = useCallback((orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  const handleViewUser = useCallback((order) => {
    setUserDetails(order.customer);
    setSelectedOrder(order);
    setModals((prev) => ({ ...prev, user: true }));
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }, []);

  // Render functions
  const renderOrderActions = useCallback(
    (order) => (
      <Button
        variant="contained"
        onClick={() => handleViewUser(order)}
        color="primary"
        size="small"
        sx={{ mr: 1 }}
      >
        View User
      </Button>
    ),
    [handleViewUser]
  );

  const renderItemActions = useCallback(
    (order, item) => {
      if (item.itemStatus === "Approval Pending") {
        return (
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleApproval(order, item)}
          >
            Approve Pending
          </Button>
        );
      } else if (item.itemStatus === "Approved") {
        return (
          <Button variant="contained" color="success" size="small">
            Approved
          </Button>
        );
      } else if (item.itemStatus === "User Approval Pending") {
        return (
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => handleApproval(order, item)}
          >
            User Approval Pending
          </Button>
        );
      } else if (item.itemStatus === "Rejected") {
        return (
          <Button variant="contained" color="error" size="small">
            Rejected
          </Button>
        );
      }
      return null;
    },
    [handleApproval]
  );

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
          {({ loading }) => (
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
                    <TableCell>
                      {order.pricingOption ? order.pricingOption : "Nil"}
                    </TableCell>
                    <TableCell>
                      {order.pricingOption === "Discount"
                        ? order.discountAmount && order.discountAmount !== 0
                          ? `${order.discountAmount}`
                          : "Nil"
                        : order.pricingOption === "Premium"
                        ? order.premiumAmount && order.premiumAmount !== 0
                          ? `${order.premiumAmount}`
                          : "Nil"
                        : "Nil"}
                    </TableCell>
                    <TableCell>{renderOrderActions(order)}</TableCell>
                  </TableRow>

                  {expandedOrders[order._id] && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Product Image</TableCell>
                                <TableCell>Quantity</TableCell>
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
                                  <TableCell>{item.product.purity}</TableCell>
                                  <TableCell>{item.product.weight}g</TableCell>
                                  <TableCell>
                                    {renderItemActions(order, item)}
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
                <TableCell colSpan={8} align="center">
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

      {/* Modals */}
      <UserDetailsModal
        open={modals.user}
        onClose={() => setModals((prev) => ({ ...prev, user: false }))}
        userDetails={userDetails}
      />

      <RemarkModal
        open={modals.remark}
        onClose={() => setModals((prev) => ({ ...prev, remark: false }))}
        remark={remark}
        setRemark={setRemark}
        onSubmit={handleRemarkSubmit}
      />

      <QuantityModal
        open={modals.quantity}
        onClose={() => setModals((prev) => ({ ...prev, quantity: false }))}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleQuantitySubmit}
      />

      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      /> */}
    </div>
  );
};

export default OrderManagement;
