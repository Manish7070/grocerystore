import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, ShoppingBag, Clock, ArrowRight, Truck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    ordersAPI.getOrders()
      .then(res => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen py-16 px-4 bg-porcelain flex items-center justify-center">
        <div className="max-w-md w-full bg-ivory rounded-2xl border border-sandstone p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-porcelain border border-sandstone flex items-center justify-center text-warmStone mb-4">
            <User size={28} />
          </div>
          <h2 className="font-serif text-2xl text-espresso font-semibold mb-2">Member Authentication Required</h2>
          <p className="text-xs text-warmStone mb-6">Please sign in to access your order history, saved addresses, and active deliveries.</p>
          <Link
            to="/signin"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-terracotta border-t-transparent" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-warmStone">Loading Patron Account...</p>
        </div>
      </div>
    );
  }

  const ordersCount = orders.length;
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const pendingOrders = orders.filter(o => o.deliveryStatus !== 'delivered' && o.deliveryStatus !== 'cancelled');
  const totalSpent = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">Patron Account</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight mt-1">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-xs text-warmStone">
              Registered Member &bull; {user.email} &bull; Role: {user.role || 'Customer'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="px-4 py-2.5 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
            >
              Order Groceries
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
              <ShoppingBag size={20} className="text-terracotta" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Total Expenditure</p>
            <p className="font-serif text-2xl text-espresso font-semibold mt-1">₹{totalSpent.toFixed(0)}</p>
            <p className="text-xs text-warmStone mt-1">{paidOrders.length} completed transactions</p>
          </div>

          <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
              <Package size={20} className="text-antiqueBrass" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">All-Time Orders</p>
            <p className="font-serif text-2xl text-espresso font-semibold mt-1">{ordersCount}</p>
            <p className="text-xs text-warmStone mt-1">Direct from farm & cold chain</p>
          </div>

          <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <div className="w-10 h-10 rounded-xl bg-apricot/30 border border-terracotta/20 flex items-center justify-center text-terracotta mb-4">
              <Truck size={20} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Active Dispatches</p>
            <p className="font-serif text-2xl text-terracotta font-semibold mt-1">{pendingOrders.length}</p>
            <p className="text-xs text-warmStone mt-1">En route or packing</p>
          </div>

          <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
              <Clock size={20} className="text-aubergine" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Member Status</p>
            <p className="font-serif text-2xl text-aubergine font-semibold mt-1">Prime Club</p>
            <p className="text-xs text-warmStone mt-1">Priority slot reservations</p>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-sandstone pb-4">
            <div>
              <h2 className="font-serif text-2xl text-espresso font-semibold">Order History</h2>
              <p className="text-xs text-warmStone mt-0.5">Chronological record of deliveries and doorstep handovers</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl mb-6 text-xs">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-warmStone/50 mb-3" />
              <h3 className="font-serif text-xl font-semibold text-espresso mb-1">No orders on record</h3>
              <p className="text-xs text-warmStone mb-6">Explore our curated seasonal market and place your first pantry basket.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
              >
                <span>Browse Market Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 rounded-xl bg-porcelain border border-sandstone/60 hover:border-sandstone transition-colors gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/track/${ord.orderNumber}`}
                        className="font-medium text-sm text-espresso hover:text-terracotta transition-colors underline decoration-sandstone underline-offset-4"
                      >
                        {ord.orderNumber || `Order #${ord._id.slice(-6)}`}
                      </Link>
                      <span className="text-xs text-warmStone">
                        &bull; {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-warmStone mt-1">
                      {ord.items?.length || 0} items &bull; Payment: {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Secure'} &bull; Slot: {ord.deliverySlot || 'Standard'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="font-serif text-lg font-semibold text-espresso">₹{ord.totalAmount}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-porcelain border border-sandstone text-espresso'
                          : 'bg-apricot/30 text-terracotta'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </div>

                    <Link
                      to={`/track/${ord.orderNumber}`}
                      className="px-3 py-1.5 bg-ivory border border-sandstone hover:border-terracotta text-xs font-medium text-espresso rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Track</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
