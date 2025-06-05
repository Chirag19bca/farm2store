import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext"; // Ensure correct path
import classes from "./PaymentManager.module.css";

const PaymentManager = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.id;

  const [payments, setPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (!farmerId) return; // Ensure farmerId exists before making API calls

    const fetchPayments = () => {
      axios.get(`http://localhost:8081/api/orders/farmer-payments/${farmerId}`)
        .then((response) => {
          console.log("API Response:", response.data); // Debugging

          setPayments(response.data);

          //   Calculate total earnings for only "Received" payments
          const total = response.data
            .filter((p) => p.status?.toLowerCase() === "received")
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

          setTotalEarnings(total);
        })
        .catch((error) => console.error("Error fetching payments:", error));
    };

    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);

    return () => clearInterval(interval);
  }, [farmerId]);

  if (!user || !farmerId) return <p>Loading payments...</p>; // Handle loading state

  return (
    <div className={classes.payments}>
      <h2 className={classes.title}>Earnings</h2>
      <div className={classes.summary}>
        <p><strong>Total Earnings: ₹{totalEarnings.toFixed(2)}</strong></p>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Retailer</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className={classes.row}>
              <td>{payment.id}</td>
              <td>{payment.product_name || "N/A"}</td>
              <td>₹{parseFloat(payment.amount).toFixed(2)}</td>
              <td>{payment.retailer_name}</td>
              <td>
                <span className={`${classes.status} ${classes[payment.status.toLowerCase()] || classes.defaultStatus}`}>
                  {payment.status}
                </span>
              </td>
              <td>{new Date(payment.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManager;
