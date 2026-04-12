import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/AuthForms';
import { CredentialsHelper } from './components/CredentialsHelper';
import {
  Home,
  LoginPage,
  SignupPage,
  BookingPage,
  MyBookingsPage,
  AdminPage,
} from './pages';
import MenuPage from './pages/MenuPage';
import ReviewPage from './pages/ReviewPage';
import LoyaltyPage from './pages/LoyaltyPage';
import EventBookingPage from './pages/EventBookingPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout><PageTransition><Home /></PageTransition></Layout>} />
        <Route path="/login" element={<Layout><PageTransition><LoginPage /></PageTransition></Layout>} />
        <Route path="/signup" element={<Layout><PageTransition><SignupPage /></PageTransition></Layout>} />
        <Route path="/menu" element={<Layout><PageTransition><MenuPage /></PageTransition></Layout>} />
        <Route path="/checkout" element={<Layout><PageTransition><CheckoutPage /></PageTransition></Layout>} />
        <Route path="/order-confirmation" element={<Layout><PageTransition><OrderConfirmationPage /></PageTransition></Layout>} />
        <Route path="/reviews" element={<Layout><PageTransition><ReviewPage /></PageTransition></Layout>} />
        <Route path="/group-events" element={<Layout><PageTransition><EventBookingPage /></PageTransition></Layout>} />
        
        {/* Protected User Routes */}
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><BookingPage /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><MyBookingsPage /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loyalty"
          element={
            <ProtectedRoute>
              <Layout><PageTransition><LoyaltyPage /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout><PageTransition><AdminPage /></PageTransition></Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <CredentialsHelper />
      </AuthProvider>
    </Router>
  );
}

export default App;
