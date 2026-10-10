import { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { deliveryAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const DeliveryPortal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const { showToast } = useToast();

  const loadAssigned = () => {
    setLoading(true);
    deliveryAPI.getAssigned()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        showToast('Unable to load assigned delivery queue', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  const handleStatusUpdate = (orderId, status) => {
    deliveryAPI.updateStatus(orderId, { status })
      .then((res) => {
        showToast(res.data.message, 'success');
        loadAssigned();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to update delivery status', 'error');
      });
  };

  const handleVerifyOtp = (orderId) => {
    const otp = otpInputs[orderId];
    if (!otp || otp.length < 4) {
      showToast('Enter the 4-digit customer delivery OTP', 'error');
      return;
    }

    deliveryAPI.updateStatus(orderId, { status: 'delivered', otp })
      .then(() => {
        showToast('Delivery confirmed and verified successfully!', 'success');
        setOtpInputs((prev) => ({ ...prev, [orderId]: '' }));
        loadAssigned();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Invalid Delivery OTP entered', 'error');
      });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Truck size={14} />
            Delivery Partner Terminal
          </span>
          <h1 className="mt-2 text-2xl font-black text-stone-900 tracking-tight dark:text-white sm:text-3xl">
            Active Delivery Runs
          </h1>
          <p className="mt-1 text-xs font-medium text-stone-500">
            Verify doorstep handovers using customer security OTP and collect COD payments.
          </p>
        </div>
        <button
          onClick={loadAssigned}
          className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-2 text-sm font-bold text-stone-800 shadow-sm hover:bg-stone-50 dark:bg-stone-900 dark:border-white/10 dark:text-white"
        >
          <RefreshCw size={16} />
          Sync
        </button>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-[2.5rem] bg-stone-200 dark:bg-stone-800" />
      ) : orders.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-stone-200 bg-white p-12 text-center dark:bg-stone-900 dark:border-white/10">
          <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-3" />
          <p className="text-xl font-bold text-stone-800 dark:text-white">Delivery Queue Clear</p>
          <p className="mt-1 text-sm text-stone-500">No pending orders awaiting dispatch right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-4 dark:border-white/5">
                <div>
                  <span className="text-xs font-mono font-bold text-stone-400">Order #{order.orderNumber}</span>
                  <p className="text-lg font-black text-stone-900 dark:text-white">{order.deliverySlot}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
                    order.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {order.paymentMethod === 'cod' ? `Collect Cash: ₹${order.totalAmount}` : 'Paid Online'}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black capitalize text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {order.deliveryStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <MapPin className="text-emerald-700 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white text-sm">{order.deliveryAddress?.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <Phone className="text-emerald-700 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white text-sm">Customer Contact</p>
                    <p className="text-xs text-stone-500 mt-0.5 font-mono">{order.deliveryAddress?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="mb-6 rounded-2xl border border-stone-100 p-4 dark:border-white/5">
                <p className="text-xs font-black uppercase tracking-wider text-stone-400 mb-2">Package Contents</p>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item, i) => (
                    <span key={i} className="rounded-xl bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step Action Buttons */}
              <div className="border-t border-stone-100 pt-5 dark:border-white/5">
                {order.deliveryStatus !== 'out_for_delivery' ? (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white hover:bg-amber-700 transition"
                  >
                    <Truck size={18} />
                    Mark Out For Delivery
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800">
                      <KeyRound size={18} className="text-emerald-700 dark:text-emerald-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Customer 4-digit OTP"
                        value={otpInputs[order._id] || ''}
                        onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                        className="bg-transparent font-black tracking-widest text-emerald-950 outline-none placeholder:text-emerald-700/50 dark:text-emerald-100 text-sm w-full"
                      />
                    </div>
                    <button
                      onClick={() => handleVerifyOtp(order._id)}
                      className="rounded-2xl bg-[#075F46] px-6 py-3 font-black text-white hover:bg-[#064D3A] transition shadow-md"
                    >
                      Verify OTP & Handover
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPortal;
