import React, { useState } from "react";
import ProductManager from "./ProductManager";
import OrderManager from "./OrderManager";
import PaymentManager from "./PaymentManager";
import classes from "./FarmerDashboard.module.css";

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.farmerHeader}>👨‍🌾 Farmer Dashboard</div>

      <div className={classes.tabs}>
        <button
          onClick={() => setActiveTab("products")}
          className={activeTab === "products" ? classes.activeTab : ""}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={activeTab === "orders" ? classes.activeTab : ""}
        >
          Manage Orders
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={activeTab === "payments" ? classes.activeTab : ""}
        >
          Manage Payments
        </button>
      </div>
      <div className={classes.content}>
        {activeTab === "products" && <ProductManager />}
        {activeTab === "orders" && <OrderManager />}
        {activeTab === "payments" && <PaymentManager />}
      </div>
    </div>
  );
};

export default FarmerDashboard;
