import React, { useState } from "react";
import classes from "./RetailerDashboard.module.css";
import OrdersTab from "./OrdersTab";
import CartTab from "./CartTab";
import PaymentsTab from "./PaymentsTab";

const RetailerDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    
    <div className={classes.dashboardContainer}>
      <h2 className={classes.dashboardTitle}>Retailer Dashboard</h2>
      <div className={classes.tabContainer}>
        <button 
          className={activeTab === "orders" ? classes.activeTab : classes.tab}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button 
          className={activeTab === "cart" ? classes.activeTab : classes.tab}
          onClick={() => setActiveTab("cart")}
        >
          Cart Management
        </button>
        <button 
          className={activeTab === "payments" ? classes.activeTab : classes.tab}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>
      </div>
      <div className={classes.contentContainer}>
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "cart" && <CartTab />}
        {activeTab === "payments" && <PaymentsTab />}
      </div>
    </div>
  );
};

export default RetailerDashboard;
