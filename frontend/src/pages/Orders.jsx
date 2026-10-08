import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, CheckCircle2, Clock3, CreditCard, Package, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import ProductArtwork from '../components/ProductArtwork';
import { readPendingPayment, savePendingPayment } from '../utils/checkoutSession';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  shipped: 'bg-sky-50 text-sky-700 ring-sky-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
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
      <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
        <div className="max-w-lg rounded-[2rem] border border-emerald-900/10 bg-white p-8 text-center shadow-xl sm:p-12">
          <Package size={58} className="mx-auto mb-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-stone-950">Sign in to see your orders</h2>
          <p className="mt-2 text-stone-500">Your delivery status and complete basket history will appear here.</p>
          <Link to="/signin" className="mt-7 inline-flex rounded-full bg-emerald-700 px-6 py-3 font-black text-white hover:bg-emerald-800">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 font-semibold text-stone-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Purchase history</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">Your orders</h1>
          <p className="mt-2 font-medium text-stone-500">Review items, payment method, and delivery progress.</p>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-800">{error}</div>}
        {statusMessage && <p role="status" className="mb-6 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">{statusMessage}</p>}

        {orders.length === 0 ? (
          <div className="rounded-[2rem] border border-emerald-900/10 bg-white px-6 py-16 text-center shadow-xl">
            <ShoppingBag size={60} className="mx-auto mb-5 text-emerald-200" />
            <h2 className="text-2xl font-black text-stone-950">No orders yet</h2>
            <p className="mt-2 text-stone-500">Your first fresh basket is only a few taps away.</p>
            <Link to="/#shop" className="mt-7 inline-flex rounded-full bg-emerald-700 px-6 py-3 font-black text-white hover:bg-emerald-800">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const isCod = order.paymentMethod === 'cod';
              const PaymentIcon = isCod ? Banknote : CreditCard;
              return (
                <article key={order._id} className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_18px_50px_rgba(38,58,34,0.07)]">
                  <div className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Order #{order._id.slice(-6)}</p>
                      <p className="mt-1 text-sm font-semibold text-stone-600">Placed {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-stone-700 ring-1 ring-stone-200">
                        <PaymentIcon size={14} /> {isCod ? 'Cash on Delivery' : 'Razorpay'}
                      </span>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ring-1 ${statusStyles[order.deliveryStatus] || statusStyles.pending}`}>
                        Delivery: {order.deliveryStatus}
                      </span>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ring-1 ${statusStyles[order.paymentStatus] || statusStyles.pending}`}>
                        Payment: {isCod && order.paymentStatus === 'pending' ? 'due on delivery' : order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {order.deliveryAddress?.address && (
                      <div className="mb-4 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                        <p className="font-bold">Deliver to {order.deliveryAddress.name}</p>
                        <p>{order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                        <p>{order.deliveryAddress.phone}</p>
                      </div>
                    )}
                    {!isCod && order.paymentStatus !== 'paid' && order.razorpayOrderId && (
                      <button type="button" onClick={() => checkPayment(order)} disabled={Boolean(syncing)}
                        className="mb-4 rounded-xl border border-emerald-700 px-4 py-2 font-bold text-emerald-700 disabled:opacity-50">
                        {syncing === order._id ? 'Checking payment...' : 'Check payment status'}
                      </button>
                    )}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={`${item.productId}-${index}`} className="flex items-center gap-3 rounded-2xl border border-stone-100 p-3 sm:gap-4">
                          <ProductArtwork product={item} className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-black text-stone-900">{item.name}</p>
                            <p className="mt-1 text-sm font-semibold text-stone-500">{item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="shrink-0 font-black text-stone-950">₹{(item.price * item.quantity).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 rounded-2xl bg-emerald-50/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="flex items-start gap-3">
                        {order.deliveryStatus === 'delivered' ? <CheckCircle2 className="mt-0.5 text-emerald-700" size={20} /> : order.deliveryStatus === 'shipped' ? <Truck className="mt-0.5 text-sky-700" size={20} /> : <Clock3 className="mt-0.5 text-amber-600" size={20} />}
                        <div>
                          <p className="font-black capitalize text-stone-900">{order.deliveryStatus} delivery</p>
                          <p className="text-sm font-medium text-stone-600">{isCod && order.paymentStatus === 'pending' ? 'Payment will be collected at delivery.' : `Payment ${order.paymentStatus}.`}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">Order total</p>
                        <p className="text-2xl font-black text-emerald-800">₹{order.totalAmount}</p>
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
