import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Import AuthContext

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(AuthContext); // Get user from context

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  // Check if the user has the correct role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect if not authorized
  }

  return element;
};

export default PrivateRoute;
