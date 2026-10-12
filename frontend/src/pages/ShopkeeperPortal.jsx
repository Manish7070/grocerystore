import { useState, useEffect } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Truck,
  Phone,
  Printer,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Receipt,
  UserCheck,
  Volume2,
  MessageCircle,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateWhatsAppInvoice, playOrderAlertChime } from '../utils/billGenerator';

const ShopkeeperPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [staples, setStaples] = useState([]);
  const [rates, setRates] = useState({});

  // Helper dispatch modal
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [helperName, setHelperName] = useState('Sonu (Shop Helper)');
  const [helperPhone, setHelperPhone] = useState('9876500000');

  // Print Bill Modal
  const [printBillOrder, setPrintBillOrder] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes] = await Promise.all([
        partnerAPI.getShopkeeperDashboard(),
        partnerAPI.getShopkeeperOrders(),
      ]);
      setDashboard(dashRes.data);
      setStaples(dashRes.data.staples || []);
      setOrders(ordersRes.data || []);

      const initialRates = {};
      (dashRes.data.staples || []).forEach((item) => {
        initialRates[item.key] = item.defaultRate;
      });
      setRates(initialRates);
    } catch (err) {
      console.error('Failed to load shopkeeper dashboard:', err);
      showToast('Dukan portal data load nahi ho paya', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Lock Daily Prices
  const handleLockPrices = async () => {
    try {
      await partnerAPI.lockShopkeeperPrices({ prices: rates });
      showToast('Aaj ke daily rates successfully lock ho gaye! Dukan 300-500m me live hai.');
      loadDashboardData();
    } catch (err) {
      showToast('Rates lock karne me error aaya', 'error');
    }
  };

  // 1-Tap Out of Stock Toggle
  const handleToggleStock = async (itemKey, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await partnerAPI.toggleShopkeeperStock({ itemKey, isAvailable: newStatus });
      setStaples((prev) =>
        prev.map((item) => (item.key === itemKey ? { ...item, inStock: newStatus } : item))
      );
      showToast(newStatus ? `${itemKey} mark kiya gaya: In Stock` : `${itemKey} mark kiya gaya: Out of Stock`);
    } catch (err) {
      showToast('Stock status update nahi ho saka', 'error');
    }
  };

  // Dispatch Order with Helper
  const handleDispatchOrder = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    try {
      await partnerAPI.dispatchShopkeeperOrder(dispatchModalOrder._id, {
        helperName,
        helperPhone,
      });
      showToast(`Order #${dispatchModalOrder.orderNumber} helper ke sath dispatch ho gaya!`);
      setDispatchModalOrder(null);
      loadDashboardData();
    } catch (err) {
      showToast('Dispatch failed', 'error');
    }
  };

  // Recharge Wallet
  const handleRechargeWallet = async (amount) => {
    try {
      await partnerAPI.rechargeShopkeeperWallet(amount);
      showToast(`₹${amount} safaltapoorvak partner wallet me add ho gaye!`);
      loadDashboardData();
    } catch (err) {
      showToast('Wallet recharge failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] text-[#192D2A] dark:text-[#F8F3EA] pb-24">
      {/* Header */}
      <section className="border-b border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#121E1C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
              <Store size={14} />
              <span>Kirana / Dukan Partner Hub (300m – 500m)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {dashboard?.shopName || `${user?.name || 'Local'} Kirana Store`}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1">
              Area: {dashboard?.villageOrArea || 'Ward 3 Market'} &bull; In-house Helper Fast Handover System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F1E8D8]/60 dark:bg-white/10 rounded-2xl border border-[#DDD5C8] dark:border-white/10 flex items-center gap-3">
              <Wallet size={20} className="text-[#C66B42]" />
              <div>
                <p className="text-[10px] font-bold uppercase text-[#625F59] dark:text-[#E7E2D9]/60">Prepaid Partner Wallet</p>
                <p className="font-bold text-base text-[#192D2A] dark:text-[#F8F3EA]">₹{dashboard?.walletBalance || 0}</p>
              </div>
              <button
                onClick={() => handleRechargeWallet(100)}
                className="ml-2 px-2.5 py-1 bg-[#17745A] hover:bg-[#125c47] text-white text-[11px] font-bold rounded-lg shadow-sm"
              >
                +₹100 Add
              </button>
            </div>
            <button
              onClick={loadDashboardData}
              className="p-3 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl hover:bg-[#F1E8D8] transition"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Morning Cutoff Price Lock Alert Banner */}
        <div className={`mb-8 p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          dashboard?.todayPriceUpdated
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            {dashboard?.todayPriceUpdated ? (
              <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Clock size={24} className="text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {dashboard?.todayPriceUpdated
                  ? '✓ Aaj ke Rates Locked! (Dukan Live 300-500m Me Active Hai)'
                  : '⚠️ Morning 8:00 AM Cutoff: Aaj ke Daily Mandi Rates Lock Karein'}
              </p>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                {dashboard?.todayPriceUpdated
                  ? 'Aapke set kiye gaye base rates ke anusaar aapko fixed payout milega. Mal khatam hone par niche switch se Out of Stock karein.'
                  : 'Order lene ke liye kripya niche diye gaye aalo, pyaaz, tamatar ke rate check karein aur "Lock Rates" button dabayein.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLockPrices}
            className="px-5 py-2.5 bg-[#192D2A] dark:bg-[#C66B42] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition shadow-md whitespace-nowrap self-start md:self-auto"
          >
            {dashboard?.todayPriceUpdated ? 'Update / Re-Lock Rates' : 'Lock Rates & Open Store'}
          </button>
        </div>

        {/* Slab Commission Ledger Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Today's App Sales</p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8F3EA]">₹{dashboard?.dailySales || 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">300-500m se aaye hue orders</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Platform Slab Fee</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Fair Slab</span>
            </div>
            <p className="font-serif text-3xl font-bold mt-1 text-emerald-600">₹{dashboard?.platformFee ?? 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">
              {dashboard?.dailySales <= 100 ? 'Slab 1 (₹0-₹100): Free ₹0 fee!' : 'Slab fee wallet se deduct hogi'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Dukandar Net Payout</p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#C66B42]">₹{dashboard?.netEarnings || 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">Shuddh munafa bina dukan chode</p>
          </div>
        </div>

        {/* Daily Pricing & 1-Tap Out of Stock Grid */}
        <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
            <div>
              <h2 className="font-serif text-lg font-bold">Daily Price Lock & 1-Tap Out of Stock Switch</h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                अगर दुकान पर कोई माल खत्म हो जाए, तो स्विच को तुरंत 'Off' कर दें ताकि गलत ऑर्डर न आएं।
              </p>
            </div>
            <button
              onClick={handleLockPrices}
              className="text-xs font-bold text-[#17745A] hover:underline"
            >
              ✓ Save Current Quotes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staples.map((item) => (
              <div
                key={item.key}
                className={`p-4 rounded-xl border transition ${
                  item.inStock
                    ? 'border-[#DDD5C8] dark:border-white/10 bg-[#F1E8D8]/20 dark:bg-white/5'
                    : 'border-red-200 bg-red-50/40 dark:bg-red-950/20 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs">{item.name}</h3>
                  {/* In-Stock / Out-of-Stock Toggle */}
                  <button
                    onClick={() => handleToggleStock(item.key, item.inStock)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full transition ${
                      item.inStock
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {item.inStock ? '● In Stock' : '✕ Out of Stock'}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-semibold text-[#625F59]">Today's Rate: ₹</span>
                  <input
                    type="number"
                    value={rates[item.key] ?? item.defaultRate}
                    onChange={(e) => setRates({ ...rates, [item.key]: Number(e.target.value) })}
                    className="w-20 rounded-lg border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-2 py-1 text-xs font-bold outline-none"
                  />
                  <span className="text-xs text-[#625F59]">/ {item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hyperlocal Orders & Helper Dispatch Queue */}
        <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
            <div>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <Truck size={18} className="text-[#C66B42]" />
                <span>Nearby Customer Orders (300m – 500m Radius)</span>
              </h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                ऑर्डर पैक करें, अपने लड़के (हेल्पर) को सौंपें, और मौके पर तुरंत बिल प्रिंट/सेंड करें।
              </p>
            </div>
            <button
              onClick={() => {
                playOrderAlertChime();
                showToast('Buzzer sound test played! Order notification alert is working.');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition self-start sm:self-auto"
            >
              <Volume2 size={14} />
              <span>Test Order Buzzer</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
              No orders active right now.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-4 rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-[#F1E8D8]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#192D2A] dark:text-[#F8F3EA]">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {ord.deliveryStatus?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="font-semibold text-xs mt-1">
                      {ord.deliveryAddress?.name} ({ord.deliveryAddress?.phone || 'No phone'})
                    </p>
                    <p className="text-[11px] text-[#625F59] dark:text-[#E7E2D9]/70">
                      {ord.deliveryAddress?.address}, {ord.deliveryAddress?.city}
                    </p>
                    <p className="text-[11px] font-bold text-[#17745A] mt-0.5">
                      Total: ₹{ord.totalAmount} &bull; Payment: {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    {/* Print / View On-Spot Bill */}
                    <button
                      onClick={() => setPrintBillOrder(ord)}
                      className="px-3 py-1.5 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#F1E8D8] transition text-xs shadow-sm"
                    >
                      <Receipt size={14} className="text-[#C66B42]" />
                      <span>On-Spot Bill</span>
                    </button>

                    {/* WhatsApp Bill Direct */}
                    <button
                      onClick={() => {
                        const waUrl = generateWhatsAppInvoice(ord);
                        window.open(waUrl, '_blank');
                      }}
                      className="px-3 py-1.5 bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/40 rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#25D366]/25 transition text-xs shadow-sm"
                      title="Send Instant Bill via WhatsApp"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Bill</span>
                    </button>

                    {/* Dispatch to Helper */}
                    <button
                      onClick={() => setDispatchModalOrder(ord)}
                      className="px-3.5 py-1.5 bg-[#17745A] hover:bg-[#125c47] text-white rounded-xl font-bold flex items-center gap-1.5 text-xs transition shadow-sm uppercase tracking-wider"
                    >
                      <UserCheck size={14} />
                      <span>Send Helper (10 Mins)</span>
                    </button>

                    <a
                      href={`tel:${ord.deliveryAddress?.phone}`}
                      className="p-1.5 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] rounded-xl hover:bg-[#F1E8D8] text-[#192D2A]"
                      title="Call customer directly"
                    >
                      <Phone size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Dispatch with Helper */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#162421] p-6 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-1">Assign Local Helper for Delivery</h3>
            <p className="text-xs text-[#625F59] mb-4">
              Order #{dispatchModalOrder.orderNumber} को 300–500 मीटर में पहुंचाने के लिए दुकान के लड़के का नाम दर्ज करें:
            </p>

            <form onSubmit={handleDispatchOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Helper / Delivery Boy Name</label>
                <input
                  type="text"
                  required
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Helper Mobile Number</label>
                <input
                  type="text"
                  required
                  value={helperPhone}
                  onChange={(e) => setHelperPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed">
                ✓ ग्राहक के पते पर पहुंचने में लगभग 5–10 मिनट लगेंगे। ग्राहक से कैश/UPI लें और OTP वेरीफाई करें।
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="w-1/2 py-2.5 border border-[#DDD5C8] rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#17745A] text-white rounded-xl font-bold uppercase tracking-wider"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: On-Spot Bill / Receipt Preview */}
      {printBillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-2xl border shadow-2xl font-mono text-xs">
            <div className="text-center border-b pb-3 mb-3">
              <h2 className="font-serif text-lg font-bold">GROCERY STORE</h2>
              <p className="text-[10px] text-gray-600">Fine Provisions & Hyperlocal Express</p>
              <p className="text-[10px] text-gray-500">Local Hub 300m Delivery Slip</p>
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
                onClick={() => {
                  window.print();
                }}
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

export default ShopkeeperPortal;
