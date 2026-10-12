import { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Package,
  Receipt,
  Printer,
  X,
  DollarSign,
  ShieldCheck,
  Navigation,
  MessageCircle,
} from 'lucide-react';
import { deliveryAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { generateWhatsAppInvoice } from '../utils/billGenerator';

const DeliveryPortal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [cashCollected, setCashCollected] = useState({});
  const [printBillOrder, setPrintBillOrder] = useState(null);
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

  const handleVerifyOtp = (orderId, isCod, amount) => {
    const otp = otpInputs[orderId];
    if (!otp || otp.length < 4) {
      showToast('Enter the 4-digit customer delivery OTP (ग्राहक का 4-अंकों का पिन दर्ज करें)', 'error');
      return;
    }

    if (isCod && !cashCollected[orderId]) {
      if (!window.confirm(`Did you collect ₹${amount} cash from the customer? (क्या आपने ग्राहक से ₹${amount} नकद प्राप्त कर लिए?)`)) {
        return;
      }
    }

    deliveryAPI.updateStatus(orderId, { status: 'delivered', otp })
      .then(() => {
        showToast('Delivery verified with OTP & successfully handed over!');
        setOtpInputs((prev) => ({ ...prev, [orderId]: '' }));
        loadAssigned();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Invalid Delivery OTP entered. Please check with customer.', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] text-[#192D2A] dark:text-[#F8F3EA] pb-24">
      {/* Header */}
      <section className="border-b border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#121E1C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
              <Navigation size={13} />
              <span>Hyperlocal 300m–500m Helper Fleet</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              Distribute Helper Delivery Portal
            </h1>
            <p className="mt-1 text-xs text-[#625F59] dark:text-[#E7E2D9]/70 leading-relaxed">
              10-Minute doorstep handover, Cash on Delivery (COD) collection ledger, and On-Spot Bill issuance.
            </p>
          </div>
          <button
            onClick={loadAssigned}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl text-xs font-bold hover:bg-[#F1E8D8] transition shadow-sm self-start sm:self-auto"
          >
            <RefreshCw size={14} />
            <span>Sync Runs</span>
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-[#162421] rounded-2xl border border-dashed border-[#DDD5C8] dark:border-white/15 p-12 text-center shadow-sm">
            <CheckCircle2 size={44} className="mx-auto text-emerald-600 mb-3" />
            <h3 className="font-serif text-2xl font-bold">Delivery Queue Clear!</h3>
            <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1">
              सभी 300–500m ऑर्डर्स सफलतापूर्वक डिलीवर हो चुके हैं। नए ऑर्डर आते ही यहाँ दिखाई देंगे।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isCod = order.paymentMethod === 'cod';

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm p-6 sm:p-7"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDD5C8]/60 dark:border-white/10 pb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#C66B42]">ORDER #{order.orderNumber}</span>
                      <p className="font-serif text-lg font-bold mt-0.5">{order.deliverySlot}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isCod
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {isCod ? `Cash Collection: ₹${order.totalAmount}` : 'Paid Online'}
                      </span>

                      <button
                        onClick={() => setPrintBillOrder(order)}
                        className="px-3 py-1 rounded-full bg-[#F1E8D8] dark:bg-white/10 border border-[#DDD5C8] dark:border-white/10 text-xs font-bold flex items-center gap-1 hover:border-[#C66B42]"
                      >
                        <Receipt size={13} className="text-[#C66B42]" />
                        <span>Print Bill</span>
                      </button>

                      <button
                        onClick={() => {
                          const waUrl = generateWhatsAppInvoice(order);
                          window.open(waUrl, '_blank');
                        }}
                        className="px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E] dark:text-[#25D366] text-xs font-bold flex items-center gap-1 hover:bg-[#25D366]/25"
                        title="Send Instant WhatsApp Bill to Customer"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp Bill</span>
                      </button>
                    </div>
                  </div>

                  {/* Recipient Contact & Location */}
                  <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FDFBF7] dark:bg-white/5 border border-[#DDD5C8]/60 dark:border-white/10">
                      <MapPin className="text-[#C66B42] shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="font-bold text-xs">{order.deliveryAddress?.name}</p>
                        <p className="text-[11px] text-[#625F59] dark:text-[#E7E2D9]/70 mt-0.5 leading-relaxed">
                          {order.deliveryAddress?.address}, {order.deliveryAddress?.city} &ndash; {order.deliveryAddress?.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between p-4 rounded-xl bg-[#FDFBF7] dark:bg-white/5 border border-[#DDD5C8]/60 dark:border-white/10">
                      <div className="flex items-start gap-3">
                        <Phone className="text-[#17745A] shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="font-bold text-xs">Customer Phone</p>
                          <p className="text-xs font-mono text-[#625F59] dark:text-[#E7E2D9]/80 mt-0.5">{order.deliveryAddress?.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <a
                        href={`tel:${order.deliveryAddress?.phone}`}
                        className="px-3 py-1.5 bg-[#17745A] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#125c47] flex items-center gap-1"
                      >
                        <Phone size={12} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  {/* Crate Manifest */}
                  <div className="mb-6 p-4 rounded-xl bg-[#FDFBF7]/60 dark:bg-white/5 border border-[#DDD5C8]/40 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60 mb-2">
                      Package Manifest ({order.items?.length || 0} items)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 text-xs font-semibold">
                          {item.name} &times; {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* COD Cash Collection Indicator */}
                  {isCod && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          Cash Collection Required: ₹{order.totalAmount}
                        </span>
                        <p className="text-[11px] text-amber-800/80">ग्राहक से नकद राशि लेकर रसीद थमाएं</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 dark:text-amber-100">
                        <input
                          type="checkbox"
                          checked={!!cashCollected[order._id]}
                          onChange={(e) => setCashCollected({ ...cashCollected, [order._id]: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600"
                        />
                        <span>Cash Received</span>
                      </label>
                    </div>
                  )}

                  {/* Actions & OTP Verification */}
                  <div className="border-t border-[#DDD5C8]/60 dark:border-white/10 pt-4">
                    {order.deliveryStatus !== 'out_for_delivery' ? (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#192D2A] dark:bg-[#C66B42] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition shadow-sm"
                      >
                        <Truck size={15} />
                        <span>Start 10-Min Delivery Run</span>
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex flex-1 items-center gap-2 bg-[#FDFBF7] dark:bg-white/5 border border-[#DDD5C8] dark:border-white/10 rounded-xl px-3 py-2.5">
                          <KeyRound size={16} className="text-[#C66B42] shrink-0" />
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Customer 4-digit PIN (OTP)"
                            value={otpInputs[order._id] || ''}
                            onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                            className="bg-transparent font-mono font-bold tracking-widest text-[#192D2A] dark:text-[#F8F3EA] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-[#625F59] text-sm outline-none w-full"
                          />
                        </div>
                        <button
                          onClick={() => handleVerifyOtp(order._id, isCod, order.totalAmount)}
                          className="px-6 py-3 bg-[#17745A] hover:bg-[#125c47] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm shrink-0"
                        >
                          Verify PIN & Complete Handover
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {printBillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-2xl border shadow-2xl font-mono text-xs">
            <div className="text-center border-b pb-3 mb-3">
              <h2 className="font-serif text-lg font-bold">GROCERY STORE</h2>
              <p className="text-[10px] text-gray-600">Fine Provisions & Hyperlocal Express</p>
              <p className="text-[10px] text-gray-500">Local Helper Doorstep Invoice</p>
            </div>

            <div className="space-y-1 mb-3 border-b pb-2 text-[11px]">
              <p><strong>Order #:</strong> {printBillOrder.orderNumber}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              <p><strong>Customer:</strong> {printBillOrder.deliveryAddress?.name}</p>
              <p><strong>Address:</strong> {printBillOrder.deliveryAddress?.address}</p>
              <p><strong>Payment Mode:</strong> {printBillOrder.paymentMethod?.toUpperCase()} ({printBillOrder.paymentStatus})</p>
            </div>

            <div className="border-b pb-3 mb-3">
              <div className="flex justify-between font-bold border-b pb-1 mb-1 text-[10px] uppercase">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
              {(printBillOrder.items || []).map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px] py-0.5">
                  <span className="truncate max-w-[140px]">{it.name}</span>
                  <span>x{it.quantity}</span>
                  <span>₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm mb-4">
              <span>TOTAL BILLED:</span>
              <span>₹{printBillOrder.totalAmount}</span>
            </div>

            <div className="text-center text-[10px] text-gray-500 mb-4 border-t pt-2">
              <p>Thank you for shopping with GroceryStore!</p>
              <p>Delivery verified by local helper.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPrintBillOrder(null)}
                className="w-1/2 py-2 border rounded font-sans font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2 bg-black text-white rounded font-sans font-bold flex items-center justify-center gap-1"
              >
                <Printer size={14} />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPortal;
