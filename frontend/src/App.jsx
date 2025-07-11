import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PropertyDetail from './pages/PropertyDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './pages/AdminPanel';
import UserAddProperty from './pages/UserAddProperty';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import AdminAddProperty from './pages/AdminAddProperty';
import Footer from './components/Footer';
import EditProperty from './pages/EditProperty';
import LikedProperties from './pages/LikedProperties'; // ✅ NEW

function App() {
  const checkSessionValid = () => {
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
    if (!loginTime) return false;
    const now = Date.now();
    const diff = now - loginTime;
    const twelveHours = 12 * 60 * 60 * 1000;
    return diff <= twelveHours;
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user && checkSessionValid();

  // Auto logout if session expired
  if (user && !checkSessionValid()) {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    window.location.href = '/login';
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <UserAddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mission"
          element={
            <ProtectedRoute>
              <Mission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <UserAddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-property/:id"
          element={
            <ProtectedRoute role="admin">
              <EditProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-properties" // ✅ NEW ROUTE
          element={
            <ProtectedRoute>
              <LikedProperties />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
