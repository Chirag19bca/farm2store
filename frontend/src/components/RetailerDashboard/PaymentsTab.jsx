import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import classes from "./PaymentsTab.module.css";

const PaymentsTab = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/orders/retailer-payments/${user.id}`
        );
        setPayments(response.data);
      } catch (err) {
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={classes.con}>
      <div className={classes.paymentsContainer}>
        <h2>Your Payments Sent</h2>

        {payments.length > 0 ? (
          <table className={classes.paymentsTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount (₹)</th>
                <th>Farmer</th>
                <th>Payment Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{Number(payment.amount).toFixed(2)}</td>
                  <td>{payment.farmer_name}</td>
                  <td>
                    <span
                      className={`${classes.status} ${
                        classes[payment.status.toLowerCase()] ||
                        classes.defaultStatus
                      }`}
                    >
                      {payment.status === "Paid" ? "Paid" : "Pending"}
                    </span>
                  </td>

                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payment records found.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;