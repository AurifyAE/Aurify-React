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
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { toast, Toaster } from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
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
  
  const adminId = localStorage.getItem("adminId");

  const orderStatuses = [
    "Rejected",
    "Success",
    "User Approval Pending",
    "Pending",
    "Processing",
  ];

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/booking/${adminId}`);
      
      setOrders(prevOrders => {
        const newOrders = response.data.orderDetails;
        
        // Check if we have any new or updated orders
        const hasChanges = JSON.stringify(prevOrders) !== JSON.stringify(newOrders);
        
        // If there are changes and we already had orders loaded (not initial load)
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


   // Initial fetch on component mount
   useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Polling effect
  useEffect(() => {
    let intervalId;

    if (isPolling) {
      intervalId = setInterval(() => {
        fetchOrders();
      }, 30000); // Poll every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchOrders, isPolling]);

  // Pause polling when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPolling(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(newStatus);
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
      console.log(error);
      setError("Failed to update order status.");
    }
  };

  const handleApproval = async (order, item) => {
    if (item.quantity <= 1) {
      console.log(item);
      // If quantity is 1 or less, directly update status to Success
      try {
        await axiosInstance.put(`/update-order-quantity/${order._id}`, {
          itemStatus: "Approved",
          itemId: item._id,
          fixedPrice:item.fixedPrice,
          quantity: item.quantity,
        });
        toast.success("Order status updated successfully");
        await fetchOrders();
      } catch (error) {
        setError("Failed to update order status.");
      }
    } else {
      // If quantity is greater than 1, show quantity update modal
      setSelectedOrder(order);
      setSelectedProduct(item);
      setQuantity(item.quantity);
      setModals((prev) => ({ ...prev, quantity: true }));
    }
  };

  const handleQuantitySubmit = async () => {
    try {
      // Update product quantity and order status in a single request
      await axiosInstance.put(`/update-order-quantity/${selectedOrder._id}`, {
        itemStatus: "User Approval Pending",
        itemId: selectedProduct._id,
        fixedPrice:selectedProduct.fixedPrice,
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
     toast.success("Your order has been rejected");
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
              <TableCell>Total Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders && orders.length > 0 ? (
              (rowsPerPage > 0
                ? orders.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : orders
              ).map((order, index) => {
                return (
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

                      <TableCell>{order.totalPrice?.toFixed(2)}</TableCell>
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
                                  <TableCell>Price</TableCell>
                                  <TableCell>Purity</TableCell>
                                  <TableCell>Weight</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.product._id}>
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
                                            boxShadow: "none", // Subtle shadow effect
                                          }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                      AED {item.product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{item.product.purity}</TableCell>
                                    <TableCell>
                                      {item.product.weight}g
                                    </TableCell>
                                    <TableCell>
                                      {item.itemStatus ===
                                      "Approval Pending" ? (
                                        <Button
                                          variant="contained"
                                          color="warning" // Orange color for pending approval
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
                                          color="success" // Green color for approved
                                          size="small"
                                        >
                                          Approved
                                        </Button>
                                      ) : item.itemStatus ===
                                        "User Approval Pending" ? (
                                        <Button
                                          variant="contained"
                                          color="info" // Blue color for user approval pending
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
                                          color="error" // Red color for rejected
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
                );
              })
            ) : (
              <TableRow>
                <TableCell className="w-[20px]">
                  No Orders Available
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={orders.length}
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
              {/* <p><strong>Address:</strong> {userDetails.address}</p> */}
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
    </div>
  );
};

export default OrderManagement;
