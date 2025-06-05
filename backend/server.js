const express = require("express");
const cors = require("cors");
const path = require("path");

// Import Routes
const authRoutes = require("./api/authRoutes");
const productRoutes = require("./api/productRoutes");
const categoryRoutes = require("./api/categoryRoutes");
const adminRoutes = require("./api/Admin");
const ordersRoutes = require("./api/ordersRoutes");
const feedbackRoutes = require("./api/feedbackRoutes");
const reportRoutes = require("./api/reportRoutes");
const emailRoutes = require("./api/emailRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// Use API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use ("/api/admin", adminRoutes);
app.use ("/api/orders", ordersRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/email", emailRoutes);

// Start the server
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
