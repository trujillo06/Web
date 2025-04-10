import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  const isValidJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(
    token
  );
  if (!isValidJWT) {
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
