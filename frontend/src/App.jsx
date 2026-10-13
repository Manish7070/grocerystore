import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import FreshMarket from './pages/FreshMarket';
import RecipeBundles from './pages/RecipeBundles';
import SmartSavings from './pages/SmartSavings';
import OrderTracking from './pages/OrderTracking';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryPortal from './pages/DeliveryPortal';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FarmerPortal from './pages/FarmerPortal';
import ShopkeeperPortal from './pages/ShopkeeperPortal';
import DistributorPortal from './pages/DistributorPortal';
import Footer from './components/Footer';
import Settings from './pages/Settings';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';

/**
 * ScrollToTop ensures every page navigation scrolls smoothly to the top of the window,
 * solving previous scroll state persistence issues.
 */
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-[#192D2A] transition-colors duration-300 dark:bg-[#0B1311] dark:text-[#F8FAFC]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/fresh-market" element={<FreshMarket />} />
          <Route path="/bundles" element={<RecipeBundles />} />
          <Route path="/smart-savings" element={<SmartSavings />} />
          <Route path="/waste-center" element={<SmartSavings />} />
          <Route path="/waste-radar" element={<SmartSavings />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/track/:orderNumber" element={<OrderTracking />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<Signin adminMode={true} />} />
          <Route path="/delivery" element={<DeliveryPortal />} />
          <Route path="/helper" element={<DeliveryPortal />} />
          <Route path="/partner/helper" element={<DeliveryPortal />} />
          <Route path="/farmer" element={<FarmerPortal />} />
          <Route path="/partner/farmer" element={<FarmerPortal />} />
          <Route path="/shopkeeper" element={<ShopkeeperPortal />} />
          <Route path="/partner/shop" element={<ShopkeeperPortal />} />
          <Route path="/distributor" element={<DistributorPortal />} />
          <Route path="/partner/distributor" element={<DistributorPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WatchlistProvider>
                <NotificationProvider>
                  <AppContent />
                </NotificationProvider>
              </WatchlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
