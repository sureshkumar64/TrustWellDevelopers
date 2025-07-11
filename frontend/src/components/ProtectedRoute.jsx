// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginTime = localStorage.getItem('loginTime');

  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const now = Date.now();

  // Auto logout if 12 hours passed
  if (user && loginTime && now - parseInt(loginTime, 10) > twelveHours) {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    return <Navigate to="/login" replace />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
