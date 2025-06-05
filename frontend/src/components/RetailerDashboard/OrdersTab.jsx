import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import classes from "./OrdersTab.module.css";

function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8081/api/orders/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Orders:", data);
          setOrders(data);
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [user]);

  const markAsReceived = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/orders/update/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed", userType: "retailer" }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, retailer_status: "Completed" } : order
          )
        );
      } else {
        console.error("Failed to update order:", data.message);
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.ordersContainer}>
        <h2>Your Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className={classes.orderCard}>
              <div className={classes.imageContainer}>
                <img src={order.image} alt={order.product_name} />
              </div>
              <div className={classes.orderDetails}>
                <p><strong>Product:</strong> {order.product_name}</p>
                <p><strong>Price:</strong> ₹{order.unit_price}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Total:</strong> ₹{order.total_price}</p>
                <p><strong>Farmer:</strong> {order.farmer_name}</p>
                <p><strong>Payment:</strong> COD</p>
                <p><strong>Status:</strong>
                  <span className={classes[order.retailer_status.toLowerCase()] || classes.defaultStatus}>
                    {order.retailer_status === "Completed" ? "Received" : order.retailer_status}
                  </span>
                </p>

                {order.farmer_status === "Delivered" && order.retailer_status !== "Completed" && (
                  <button
                    onClick={() => markAsReceived(order.id)}
                    className={classes.recivebtn}
                  >
                    Mark as Received
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;