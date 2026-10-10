import { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, KeyRound, CheckCircle2, RefreshCw, Package } from 'lucide-react';
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
        showToast(res.data.message);
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
        showToast('Delivery confirmed and verified successfully!');
        setOtpInputs((prev) => ({ ...prev, [orderId]: '' }));
        loadAssigned();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Invalid Delivery OTP entered', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-apricot/30 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta uppercase tracking-wider mb-3">
              <Truck size={13} />
              <span>Fleet Operations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight">
              Active Delivery Queue
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-warmStone max-w-xl leading-relaxed">
              Doorstep handover verification using customer security PIN and COD cash collection ledger.
            </p>
          </div>
          <button
            onClick={loadAssigned}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-porcelain hover:bg-sandstone/30 border border-sandstone rounded-xl text-xs font-semibold text-espresso uppercase tracking-wider transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Sync Runs</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 bg-ivory rounded-2xl border border-sandstone animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-ivory rounded-2xl border border-dashed border-sandstone p-12 text-center shadow-sm">
            <CheckCircle2 size={44} className="mx-auto text-terracotta mb-3" />
            <h3 className="font-serif text-2xl text-espresso font-semibold">Delivery Queue Clear</h3>
            <p className="text-xs text-warmStone mt-1">All assigned cold-chain crates have been safely delivered to patrons.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-sandstone pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-warmStone">ORDER #{order.orderNumber}</span>
                    <p className="font-serif text-xl text-espresso font-semibold mt-0.5">{order.deliverySlot}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      order.paymentMethod === 'cod'
                        ? 'bg-apricot/40 border border-terracotta/20 text-terracotta'
                        : 'bg-porcelain border border-sandstone text-espresso'
                    }`}>
                      {order.paymentMethod === 'cod' ? `Collect Cash: ₹${order.totalAmount}` : 'Paid Online'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-porcelain border border-sandstone text-[11px] font-semibold uppercase tracking-wider text-warmStone">
                      {order.deliveryStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-porcelain border border-sandstone/60">
                    <MapPin className="text-terracotta shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="font-medium text-xs text-espresso">{order.deliveryAddress?.name}</p>
                      <p className="text-[11px] text-warmStone mt-0.5 leading-relaxed">
                        {order.deliveryAddress?.address || order.deliveryAddress?.street}, {order.deliveryAddress?.city} &ndash; {order.deliveryAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-porcelain border border-sandstone/60">
                    <Phone className="text-terracotta shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="font-medium text-xs text-espresso">Recipient Contact</p>
                      <p className="text-xs text-warmStone mt-0.5 font-mono">{order.deliveryAddress?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6 p-4 rounded-xl bg-porcelain/50 border border-sandstone/40">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone mb-2">Crate Manifest ({order.items?.length || 0} items)</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-ivory border border-sandstone text-xs text-espresso">
                        {item.name} &times; {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="border-t border-sandstone pt-5">
                  {order.deliveryStatus !== 'out_for_delivery' ? (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
                    >
                      <Truck size={16} />
                      <span>Start Delivery Run</span>
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex flex-1 items-center gap-2 bg-porcelain border border-sandstone rounded-xl px-3 py-2.5">
                        <KeyRound size={16} className="text-terracotta shrink-0" />
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Customer 4-digit PIN"
                          value={otpInputs[order._id] || ''}
                          onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                          className="bg-transparent font-mono font-bold tracking-widest text-espresso placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-warmStone text-sm outline-none w-full"
                        />
                      </div>
                      <button
                        onClick={() => handleVerifyOtp(order._id)}
                        className="px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm shrink-0"
                      >
                        Verify PIN & Complete Handover
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPortal;
