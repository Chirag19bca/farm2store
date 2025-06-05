import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHeader from "./components/MainHeader";
import MainFooter from "./components/MainFooter";
import HomePage from "./components/HomePage";
import Admin from "./components/Admin/Admin";
import Profile from "./pages/Profile";
import RetailerDashboard from "./components/RetailerDashboard/RetailerDashboard";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Products from "./pages/Products";
import CategoryPage from "./pages/CategoryPage";
import Orders from "../src/components/RetailerDashboard/OrdersTab";
import FarmerDashboard from "./components/FarmerDashboard/FarmerDashboard";
import CartTab from "./components/RetailerDashboard/CartTab";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import FeedbackForm from './pages/FeedbackForm'; // Import FeedbackForm
import SearchResult from "./pages/SearchResult";

function App() {
  return (
    <Router>
      <MainHeader />
      <div style={{ minHeight: "calc(100vh - 100px)" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/searchresult" element={<SearchResult />} />

          {/* Protected Routes - Wrap with <PrivateRoute> */}
          <Route path="/profile" element={<PrivateRoute element={<Profile />} allowedRoles={["retailer", "farmer", "admin"]} />} />
          <Route path="/cart" element={<PrivateRoute element={<CartTab />} allowedRoles={["retailer"]} />} />
          <Route path="/orders" element={<PrivateRoute element={<Orders />} allowedRoles={["retailer"]} />} />
          <Route path="/retailer-dashboard" element={<PrivateRoute element={<RetailerDashboard />} allowedRoles={["retailer"]} />} />
          <Route path="/farmer-dashboard" element={<PrivateRoute element={<FarmerDashboard />} allowedRoles={["farmer"]} />} />
          <Route path="/admin-dashboard" element={<PrivateRoute element={<Admin />} allowedRoles={["admin"]} />} />

        </Routes>
      </div>
      <MainFooter />
    </Router>
  );
}

export default App;
