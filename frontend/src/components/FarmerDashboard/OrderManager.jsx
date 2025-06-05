import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import classes from "./OrderManager.module.css";

const OrderManager = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://localhost:8081/api/orders/farmer/${user.id}`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("  Error fetching orders:", error.response?.data || error);
      }
    };
    fetchOrders();
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8081/api/orders/update/${orderId}`, {
        status: newStatus,
        userType: "farmer",
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, farmer_status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("  Error updating order:", error.response?.data || error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.retailer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusFilteredOrders = statusFilter
    ? filteredOrders.filter((order) => order.farmer_status === statusFilter)
    : filteredOrders;

  const sortedOrders = [...statusFilteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === "amount") {
      return b.total_price - a.total_price;
    }
    return 0;
  });

  return (
    <div className={classes.orderTracking}>
      <h2 className={classes.title}>Order Tracking</h2>
      <div className={classes.filters}>
        <input
          type="text"
          placeholder="Search by Retailer or Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.searchInput}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={classes.dropdown}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={classes.dropdown}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Retailer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id} className={classes.row}>
              <td>{order.retailer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td className={`${classes.status} ${classes[order.farmer_status.toLowerCase()]}`}>
                {order.farmer_status}
              </td>
              <td>₹{Number(order.total_price).toFixed(2)}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>
                {order.farmer_status === "Pending" && (
                  <button onClick={() => updateOrderStatus(order.id, "Shipped")} className={classes.button}>
                    Mark as Shipped
                  </button>
                )}
                {order.farmer_status === "Shipped" && (
                  <button onClick={() => updateOrderStatus(order.id, "Delivered")} className={classes.button}>
                    Mark as Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
