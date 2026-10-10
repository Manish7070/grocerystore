import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, CheckCircle2, Clock3, CreditCard, Package, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import ProductArtwork from '../components/ProductArtwork';
import { readPendingPayment, savePendingPayment } from '../utils/checkoutSession';

const statusStyles = {
  pending: 'bg-porcelain text-warmStone border-sandstone',
  shipped: 'bg-apricot/30 text-terracotta border-terracotta/20',
  out_for_delivery: 'bg-apricot/30 text-terracotta border-terracotta/20',
  delivered: 'bg-porcelain text-espresso border-sandstone',
  paid: 'bg-porcelain text-espresso border-sandstone',
  failed: 'bg-red-50 text-red-900 border-red-200',
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const checkPayment = async (order) => {
    setSyncing(order._id);
    setError('');
    setStatusMessage('');
    try {
      const { data } = await ordersAPI.syncPayment(order.razorpayOrderId);
      if (data.paymentStatus === 'paid' && readPendingPayment(sessionStorage, user._id)?.id === order.razorpayOrderId) {
        savePendingPayment(sessionStorage, user._id, null);
      }
      setOrders((current) => current.map((item) => item._id === order._id ? { ...item, paymentStatus: data.paymentStatus } : item));
      setStatusMessage(data.paymentStatus === 'paid' ? 'Payment confirmed.' : 'Payment has not been confirmed yet. If money was debited, check again shortly.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to check payment status. Please try again.');
    } finally {
      setSyncing('');
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    ordersAPI.getOrders()
      .then(({ data }) => {
        setOrders(data || []);
        const pending = readPendingPayment(sessionStorage, user._id);
        if (pending && data?.some(order => order.razorpayOrderId === pending.id && order.paymentStatus === 'paid')) {
          savePendingPayment(sessionStorage, user._id, null);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen py-16 px-4 bg-porcelain flex items-center justify-center">
        <div className="max-w-md w-full bg-ivory rounded-2xl border border-sandstone p-8 text-center shadow-sm">
          <Package size={48} className="mx-auto mb-4 text-warmStone/60" />
          <h2 className="font-serif text-2xl text-espresso font-semibold mb-2">Member Authentication Required</h2>
          <p className="text-xs text-warmStone mb-6">Sign in to review your purchase history, active deliveries, and receipts.</p>
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
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-warmStone">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">Patron History</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight mt-1">
            Your Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-warmStone">
            Review crate allocations, payment status, and cold-chain delivery progress.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900">
            {error}
          </div>
        )}
        {statusMessage && (
          <div role="status" className="mb-6 rounded-xl border border-sandstone bg-ivory p-4 text-xs text-espresso">
            {statusMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-ivory rounded-2xl border border-sandstone p-12 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto mb-4 text-warmStone/50" />
            <h2 className="font-serif text-2xl text-espresso font-semibold mb-1">No orders yet</h2>
            <p className="text-xs text-warmStone mb-6">Discover our seasonal harvest produce and order your first market basket.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
            >
              <span>Explore the Market</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isCod = order.paymentMethod === 'cod';
              const PaymentIcon = isCod ? Banknote : CreditCard;

              return (
                <article
                  key={order._id}
                  className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-porcelain/60 border-b border-sandstone gap-4">
                    <div>
                      <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-warmStone">
                        {order.orderNumber ? order.orderNumber : `Order #${order._id.slice(-6)}`}
                      </p>
                      <p className="text-xs text-espresso font-medium mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/track/${order.orderNumber || order._id}`}
                        className="px-3 py-1.5 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-terracotta/90 transition-colors shadow-sm"
                      >
                        Track Live
                      </Link>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory border border-sandstone text-xs text-espresso">
                        <PaymentIcon size={13} className="text-warmStone" />
                        <span>{isCod ? 'Cash on Delivery' : 'Razorpay Secure'}</span>
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider border ${statusStyles[order.deliveryStatus] || statusStyles.pending}`}>
                        {order.deliveryStatus?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {order.deliveryAddress?.address && (
                      <div className="mb-5 p-3.5 rounded-xl bg-porcelain border border-sandstone/60 text-xs text-espresso">
                        <p className="font-semibold">{order.deliveryAddress.name}</p>
                        <p className="text-warmStone mt-0.5">{order.deliveryAddress.address}, {order.deliveryAddress.city} &ndash; {order.deliveryAddress.pincode}</p>
                      </div>
                    )}

                    {!isCod && order.paymentStatus !== 'paid' && order.razorpayOrderId && (
                      <button
                        type="button"
                        onClick={() => checkPayment(order)}
                        disabled={Boolean(syncing)}
                        className="mb-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-terracotta text-terracotta hover:bg-terracotta hover:text-ivory transition-colors disabled:opacity-50"
                      >
                        {syncing === order._id ? 'Verifying payment...' : 'Re-verify Payment'}
                      </button>
                    )}

                    <div className="space-y-2.5">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.productId}-${index}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-porcelain/50 border border-sandstone/40 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-espresso truncate">{item.name}</p>
                            <p className="text-[11px] text-warmStone">{item.quantity} &times; ₹{item.price}</p>
                          </div>
                          <span className="font-semibold text-espresso ml-4">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-sandstone flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-warmStone">
                        <Truck size={15} className="text-terracotta" />
                        <span>Slot: {order.deliverySlot || 'Standard Delivery'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-warmStone block">Order Total</span>
                        <span className="font-serif text-2xl text-espresso font-semibold">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
