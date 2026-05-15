// App.jsx
import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// ✅ Layout Components
import Navbar from "./NavFooter/Navbar";
import Footer from "./NavFooter/Footer";
import WhatsappFloat from "./Components/WhatsappFloating";

// ✅ Public Pages
import Home from "./Components/HomePage/Home";
import AboutUs from "./Components/About/AboutUs";
import Contacts from "./Components/Contact/Contacts";
import ProductListing from "./Components/ProductListing";
import ProductDetails from "./Components/ProductDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// ✅ Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// ✅ User Dashboard
import MyOrders from "./pages/UserDashboard/MyOrders";
import Wishlist from "./pages/UserDashboard/Wishlist";
import ProfileSettings from "./pages/UserDashboard/ProfileSettings";
import Reviews from "./pages/UserDashboard/Reviews";
import SupportTickets from "./pages/UserDashboard/SupportTickets";

// ✅ Context
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

// ✅ SEO Provider (React Helmet Async)
import { HelmetProvider } from "react-helmet-async";

// ✅ Redux Store
import { Provider } from "react-redux";
import { store } from "./redux/store";

// ✅ Toast Notification (Sonner)
import { Toaster } from "sonner";



// ----------------------------------------------
// 🔐 Protected Route Component
// ----------------------------------------------
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, authChecked } = React.useContext(AuthContext);

  if (!authChecked || (user && role == null)) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ----------------------------------------------
// 🔀 Role-Based Dashboard Redirect
// ----------------------------------------------
const DashboardRedirect = () => {
  const { role, authChecked } = React.useContext(AuthContext);

  if (!authChecked || role == null) {
    return <div className="text-center py-10">Loading...</div>;
  }

  switch (role) {
    case "admin":
      return <Navigate to="/admindashboard" replace />;
    case "superadmin":
      return <Navigate to="/superadmindashboard" replace />;
    default:
      return <Navigate to="/orders" replace />;
  }
};

// ----------------------------------------------
// 🧭 Main App Wrapper
// ----------------------------------------------
const AppWrapper = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/register"];
  const shouldHide = hideNavAndFooter.includes(location.pathname);

  return (
    <>
      {/* Navbar (hidden on auth pages) */}
      {!shouldHide && <Navbar />}

      {/* Routes */}
      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/admin" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* 🧑‍💼 Admin Routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmindashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Shared Dashboard Redirect */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin", "user"]}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* 👤 User Dashboard Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
              <SupportTickets />
            </ProtectedRoute>
          }
        />

        {/* 🧭 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating WhatsApp Button */}
      {!shouldHide && <WhatsappFloat />}

      {/* Footer */}
      {!shouldHide && <Footer />}

      {/* Global Toast Notifications */}
      <Toaster richColors position="top-right" />
    </>
  );
};

// ----------------------------------------------
// 🌍 Main App Entry
// ----------------------------------------------
function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <HelmetProvider>
            <AppWrapper />
            <Toaster position="top-right" richColors />
          </HelmetProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;
