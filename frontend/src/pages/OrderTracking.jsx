import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../utils/api';

const steps = [
  { key: 'placed', title: 'Order Placed', desc: 'Received & sent to mandi fulfillment' },
  { key: 'confirmed', title: 'Confirmed & Paid', desc: 'Inventory allocated from fresh batches' },
  { key: 'packed', title: 'Quality Packed', desc: 'Temperature-sealed in eco-friendly crates' },
  { key: 'out_for_delivery', title: 'Out for Delivery', desc: 'Assigned to verified local partner' },
  { key: 'delivered', title: 'Delivered', desc: 'Verified doorstep handover' },
];

const OrderTracking = () => {
  const { orderNumber: urlOrderNumber } = useParams();
  const [query, setQuery] = useState(urlOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(urlOrderNumber));
  const [error, setError] = useState('');

  const fetchTracking = (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    ordersAPI.trackOrder(num.trim())
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Order number not found. Please verify your order ID.');
        setOrder(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (urlOrderNumber) {
      fetchTracking(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Search Header */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Truck size={14} />
          Live Freshness & Delivery Tracker
        </span>
        <h1 className="mt-3 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
          Track Your TaazaDaily Basket
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Enter your order number to check real-time packing, route dispatch & doorstep OTP.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-2xl bg-white p-2 shadow-lg shadow-emerald-950/5 border border-emerald-900/10 dark:bg-stone-900 dark:border-white/10">
          <Search size={20} className="ml-2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. TD-2026-123456"
            className="flex-1 bg-transparent px-2 text-sm font-bold uppercase tracking-wider text-stone-900 outline-none dark:text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#075F46] px-5 py-2.5 text-sm font-black text-white hover:bg-[#064D3A] transition"
          >
            Track
          </button>
        </form>
      </div>

      {loading && (
        <div className="rounded-[2.5rem] bg-white p-12 text-center shadow-sm dark:bg-stone-900">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
          <p className="mt-4 font-bold text-stone-700 dark:text-stone-300">Retrieving live order tracking...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Order Banner */}
          <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-6 dark:border-white/5">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-stone-400">Order ID</span>
                <p className="text-2xl font-black text-stone-900 tracking-tight dark:text-white">{order.orderNumber}</p>
                <p className="text-xs font-medium text-stone-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>

              {/* Secure Delivery OTP Card */}
              {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && order.deliveryOtp && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:bg-emerald-950/60 dark:border-emerald-800 text-center sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Doorstep Verification OTP</span>
                  <p className="text-3xl font-black tracking-widest text-emerald-900 dark:text-emerald-100">{order.deliveryOtp}</p>
                  <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Share with delivery agent upon arrival</p>
                </div>
              )}
            </div>

            {/* Stepper Timeline */}
            <div className="mt-8">
              <h2 className="mb-6 text-sm font-black uppercase tracking-wider text-stone-400">Delivery Status Timeline</h2>
              <div className="relative space-y-6 pl-6 before:absolute before:left-2.5 before:top-3 before:h-[calc(100%-24px)] before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                {steps.map((step) => {
                  const state = getStepStatus(step.key, order.deliveryStatus);
                  const isDone = state === 'completed';
                  const isCurr = state === 'current';

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      <span
                        className={`absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          isDone
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isCurr
                            ? 'border-emerald-600 bg-white text-emerald-700 animate-pulse dark:bg-stone-900'
                            : 'border-stone-300 bg-white text-stone-300 dark:bg-stone-900'
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                      <div>
                        <p className={`font-black ${isCurr ? 'text-emerald-800 dark:text-emerald-400 text-base' : 'text-stone-800 dark:text-stone-200 text-sm'}`}>
                          {step.title}
                          {isCurr && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Active</span>}
                        </p>
                        <p className="text-xs text-stone-500 font-medium">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-stone-100 pt-6 dark:border-white/5">
              <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                <span className="text-[10px] font-black uppercase text-stone-400">Delivery Slot</span>
                <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-1">{order.deliverySlot}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                <span className="text-[10px] font-black uppercase text-stone-400">Deliver To</span>
                <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-1">
                  {order.deliveryAddress?.name}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
            <h2 className="mb-4 text-base font-black text-stone-900 dark:text-white">Basket Items ({order.items?.length || 0})</h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl bg-stone-50 p-3 dark:bg-stone-900">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-stone-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity} · {item.unit || 'Pack'}</p>
                  </div>
                  <span className="font-black text-emerald-800 dark:text-emerald-400 text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-white/5">
              <span className="font-semibold text-stone-500">Total Paid</span>
              <span className="text-xl font-black text-emerald-800 dark:text-emerald-400">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
