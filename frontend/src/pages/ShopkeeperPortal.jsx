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
  PlusCircle,
  Lock,
  X,
  Languages,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateWhatsAppInvoice, playOrderAlertChime } from '../utils/billGenerator';
import ImageCaptureInput from '../components/ImageCaptureInput';

const ShopkeeperPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [staples, setStaples] = useState([]);
  const [rates, setRates] = useState({});
  const [isLockedToday, setIsLockedToday] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  // Add Custom Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customProduct, setCustomProduct] = useState({
    name: '',
    category: 'Vegetables',
    rate: '',
    unit: '1 kg',
    image: '',
  });

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
      const incomingStaples = dashRes.data.staples || [];
      setStaples(incomingStaples);
      setOrders(ordersRes.data || []);
      setIsLockedToday(Boolean(dashRes.data.todayPriceUpdated));

      const initialRates = {};
      incomingStaples.forEach((item) => {
        initialRates[item.key] = item.defaultRate;
      });
      setRates(initialRates);
    } catch (err) {
      console.error('Failed to load merchant dashboard:', err);
      showToast('Failed to load store dashboard data', 'error');
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
      setIsLockedToday(true);
      showToast(
        isHindi
          ? 'आज के दैनिक दरें सफलतापूर्वक लॉक हो गईं! दुकान 300–500m दायरे में लाइव है।'
          : "Today's daily prices locked successfully! Store is live within 300m–500m."
      );
      loadDashboardData();
    } catch (err) {
      showToast(isHindi ? 'दरें लॉक करने में त्रुटि हुई' : 'Error locking daily prices', 'error');
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
      showToast(
        newStatus
          ? `${itemKey} marked: In Stock`
          : `${itemKey} marked: Out of Stock`
      );
    } catch (err) {
      showToast('Failed to update stock status', 'error');
    }
  };

  // Add Custom Store Product
  const handleAddCustomProduct = async (e) => {
    e.preventDefault();
    if (!customProduct.name || !customProduct.rate) {
      showToast('Please provide product name and rate', 'error');
      return;
    }

    try {
      await partnerAPI.addShopkeeperProduct({
        name: customProduct.name,
        category: customProduct.category || 'Vegetables',
        price: Number(customProduct.rate),
        mrp: Math.round(Number(customProduct.rate) * 1.2),
        unit: customProduct.unit || '1 kg',
        image: customProduct.image || '',
        description: `Fresh inventory from local merchant store`,
      });

      const key = `custom_${Date.now()}`;
      const newStaple = {
        key,
        name: customProduct.name,
        defaultRate: Number(customProduct.rate),
        unit: customProduct.unit,
        inStock: true,
        image: customProduct.image,
      };

      setStaples((prev) => [newStaple, ...prev]);
      setRates((prev) => ({ ...prev, [key]: Number(customProduct.rate) }));
      setShowAddModal(false);
      setCustomProduct({ name: '', category: 'Vegetables', rate: '', unit: '1 kg', image: '' });
      showToast(
        isHindi
          ? 'नया प्रोडक्ट सबमिट हो गया! एडमिन अप्रूवल के बाद लाइव फ्रंट पर दिखेगा।'
          : 'New product submitted! Will appear on live storefront upon admin approval.'
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit product', 'error');
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
      showToast(`Order #${dispatchModalOrder.orderNumber} dispatched with helper!`);
      setDispatchModalOrder(null);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to dispatch order with helper', 'error');
    }
  };

  // Quick Wallet Top-up
  const handleRechargeWallet = async () => {
    try {
      await partnerAPI.rechargeShopkeeperWallet(100);
      showToast('₹100 added to merchant wallet!');
      loadDashboardData();
    } catch (err) {
      showToast('Wallet recharge failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] text-[#192D2A] dark:text-[#F8FAFC] pb-24 transition-colors">
      {/* Top Header Bar */}
      <section className="border-b border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-full text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                <Store size={14} />
                <span>{isHindi ? 'दुकानदार / किराना हब' : 'Merchant Storefront Hub'}</span>
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setIsHindi((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#162723] text-[#17745A] dark:text-[#10B981] hover:bg-[#F1E8D8]/50 transition"
              >
                <Languages size={13} />
                <span>{isHindi ? 'English Mode' : 'हिंदी मोड'}</span>
              </button>
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {dashboard?.shopName || 'Neighborhood Grocery Store'}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1">
              {isHindi
                ? `क्षेत्र: ${dashboard?.villageOrArea || 'स्थानीय वार्ड'} • इन-हाउस हेल्पर 10–15 मिनट हैंडओवर सिस्टम`
                : `Sector: ${dashboard?.villageOrArea || 'Local Ward'} • Rapid 10–15 Min Helper Handover Engine`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle size={15} />
              <span>{isHindi ? '+ नया प्रोडक्ट जोड़ें' : '+ Add Store Product'}</span>
            </button>

            {/* Wallet Card */}
            <div className="bg-[#FDFBF7] dark:bg-[#162723] border border-[#DDD5C8] dark:border-[#2A443E] rounded-2xl p-3 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#17745A] dark:text-[#10B981]">
                <Wallet size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF] block">
                  {isHindi ? 'पार्टनर वॉलेट' : 'Partner Wallet'}
                </span>
                <span className="font-serif text-lg font-bold text-[#17745A] dark:text-[#10B981]">
                  ₹{dashboard?.walletBalance ?? 150}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRechargeWallet}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#17745A] text-white hover:bg-[#135E49] transition ml-1"
              >
                +₹100 Add
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Status Alert Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isLockedToday
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            {isLockedToday ? <CheckCircle2 size={22} className="text-emerald-700 shrink-0" /> : <AlertTriangle size={22} className="text-amber-700 shrink-0" />}
            <div>
              <p className="font-bold text-sm">
                {isLockedToday
                  ? (isHindi ? '✓ आज के रेट्स लॉक हैं! दुकान 300–500m में लाइव सक्रिय है।' : "✓ Today's Daily Rates Locked! Store is live within 300m–500m.")
                  : (isHindi ? '⚠️ आज के रेट्स अभी लॉक नहीं हुए हैं।' : "⚠️ Today's daily rates are not locked yet.")}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {isLockedToday
                  ? (isHindi ? 'तय दरों के अनुसार फिक्स्ड पेआउट मिलेगा। कीमतें अब 24 घंटे के लिए लॉक हैं।' : 'Daily base rates are frozen for 24h to prevent price tampering during customer orders.')
                  : (isHindi ? 'नीचे दिए गए बटन पर क्लिक करके आज के रेट्स लॉक करें।' : 'Review daily produce rates below and lock them to start receiving 10–15 min customer orders.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLockPrices}
            disabled={isLockedToday}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              isLockedToday
                ? 'bg-emerald-700 text-white cursor-not-allowed opacity-90'
                : 'bg-amber-700 text-white hover:bg-amber-800'
            }`}
          >
            {isLockedToday ? <Lock size={13} /> : <CheckCircle2 size={13} />}
            <span>{isLockedToday ? (isHindi ? 'रेट्स लॉक हैं' : 'Rates Locked') : (isHindi ? 'रेट्स लॉक करें' : 'Lock Daily Rates')}</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#13221E] border border-[#DDD5C8] dark:border-[#223832] rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF] block mb-1">
              {isHindi ? "आज की बिक्री" : "Today's App Sales"}
            </span>
            <div className="font-serif text-3xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
              ₹{dashboard?.dailySales ?? 0}
            </div>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-2">
              {isHindi ? '300–500m दायरे से आए ऑर्डर्स' : 'Orders within 300m–500m sector'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#13221E] border border-[#DDD5C8] dark:border-[#223832] rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF] block mb-1">
              {isHindi ? 'प्लेटफॉर्म स्लैब शुल्क' : 'Platform Slab Fee'}
            </span>
            <div className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">
              ₹{dashboard?.platformFee ?? 0}
            </div>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-2">
              {isHindi ? 'स्लैब 1 (₹0–₹100): शून्य ₹0 शुल्क' : 'Slab 1 (₹0–₹100): ₹0 free tier'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#13221E] border border-[#DDD5C8] dark:border-[#223832] rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF] block mb-1">
              {isHindi ? 'दुकानदार शुद्ध पेआउट' : 'Merchant Net Payout'}
            </span>
            <div className="font-serif text-3xl font-bold text-[#17745A] dark:text-[#10B981]">
              ₹{dashboard?.netEarnings ?? 0}
            </div>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-2">
              {isHindi ? 'शुद्ध मुनाफा बिना दुकान छोड़े' : 'Direct payout with zero intermediary margin'}
            </p>
          </div>
        </div>

        {/* Daily Produce Quotes & Out-of-Stock Switch */}
        <section className="bg-white dark:bg-[#13221E] border border-[#DDD5C8] dark:border-[#223832] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                  {isHindi ? 'दैनिक मूल्य निर्धारण एवं स्टॉक स्विच' : 'Daily Price Lock & 1-Tap Out-of-Stock Switch'}
                </h2>
                {isLockedToday && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-[#17745A] dark:text-[#10B981] border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <Lock size={11} /> Locked
                  </span>
                )}
              </div>
              <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1">
                {isHindi
                  ? 'अगर दुकान पर कोई माल खत्म हो जाए, तो स्विच को तुरंत Off कर दें ताकि गलत ऑर्डर न आएं।'
                  : 'Toggle the switch to Out-of-Stock instantly if an item runs out. Prices freeze once locked for the day.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <PlusCircle size={14} />
                <span>{isHindi ? '+ नया आइटम' : '+ Add Item'}</span>
              </button>

              <button
                type="button"
                onClick={handleLockPrices}
                disabled={isLockedToday}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Lock size={14} />
                <span>{isLockedToday ? (isHindi ? 'कीमतें लॉक हैं' : 'Prices Locked') : (isHindi ? 'कीमतें लॉक करें' : 'Save & Lock Rates')}</span>
              </button>
            </div>
          </div>

          {/* Produce List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staples.map((item) => {
              const inStock = item.inStock !== false;
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    inStock
                      ? 'border-[#DDD5C8] dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#162723]'
                      : 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#DDD5C8] dark:border-[#2A443E]"
                        />
                      )}
                      <div>
                        <span className="font-bold text-sm text-[#192D2A] dark:text-[#F8FAFC] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#625F59] dark:text-[#A7B3AF]">
                          Unit: {item.unit}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStock(item.key, inStock)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {inStock ? '● In Stock' : '✕ Out of Stock'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DDD5C8]/60 dark:border-[#223832]">
                    <span className="text-xs text-[#625F59] dark:text-[#A7B3AF] font-medium">
                      {isHindi ? 'आज का रेट: ' : "Today's Rate: "}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC]">₹</span>
                      <input
                        type="number"
                        disabled={isLockedToday}
                        value={rates[item.key] ?? item.defaultRate}
                        onChange={(e) =>
                          setRates({ ...rates, [item.key]: Number(e.target.value) })
                        }
                        className={`w-16 rounded-lg border px-2 py-1 text-xs font-bold outline-none text-right ${
                          isLockedToday
                            ? 'bg-black/5 dark:bg-white/5 border-transparent text-[#625F59] dark:text-[#A7B3AF] cursor-not-allowed'
                            : 'border-[#DDD5C8] bg-white text-[#192D2A] dark:bg-[#13221E] dark:border-[#2A443E] dark:text-[#F8FAFC]'
                        }`}
                      />
                      <span className="text-xs text-[#625F59] dark:text-[#A7B3AF]">/ {item.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hyperlocal Incoming Orders (300m - 500m) */}
        <section className="bg-white dark:bg-[#13221E] border border-[#DDD5C8] dark:border-[#223832] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'नजदीकी ग्राहक ऑर्डर्स (300m–500m दायरा)' : 'Nearby Customer Orders (300m – 500m Radius)'}
              </h2>
              <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1">
                {isHindi
                  ? 'ऑर्डर पैक करें, अपने लड़के (हेल्पर) को सौंपें, और मौके पर तुरंत बिल प्रिंट/सेंड करें।'
                  : 'Pack order, assign to your helper, and dispatch for 10–15 min doorstep handover.'}
              </p>
            </div>

            <button
              type="button"
              onClick={playOrderAlertChime}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#162723] hover:border-[#17745A] flex items-center gap-1.5 transition"
            >
              <Volume2 size={14} className="text-[#17745A] dark:text-[#10B981]" />
              <span>{isHindi ? 'टेस्ट बाजार सायरन' : 'Test Order Buzzer'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#625F59] dark:text-[#A7B3AF] col-span-2">
                <Store size={36} className="mx-auto mb-2 text-[#DDD5C8] dark:text-[#2A443E]" />
                <p className="font-bold text-sm">No pending orders in your 500m radius right now.</p>
                <p className="mt-1">When a customer in your sector places an order, the alert will chime!</p>
              </div>
            ) : (
              orders.slice(0, 6).map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl border border-[#DDD5C8] dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#162723] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#192D2A] dark:text-[#F8FAFC]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                      {order.deliveryStatus || 'confirmed'}
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-xs text-[#192D2A] dark:text-[#F8FAFC]">
                      {order.deliveryAddress?.name} ({order.deliveryAddress?.phone})
                    </p>
                    <p className="text-[11px] text-[#625F59] dark:text-[#A7B3AF] truncate mt-0.5">
                      {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-[#17745A] dark:text-[#10B981] flex justify-between items-center">
                    <span>Total: ₹{order.totalAmount}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
                      Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus})
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#DDD5C8]/60 dark:border-[#223832]">
                    <button
                      type="button"
                      onClick={() => setPrintBillOrder(order)}
                      className="flex-1 py-1.5 rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-white dark:bg-[#13221E] text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] hover:bg-[#F1E8D8]/50 transition flex items-center justify-center gap-1"
                    >
                      <Printer size={13} /> Bill
                    </button>
                    <button
                      type="button"
                      onClick={() => setDispatchModalOrder(order)}
                      className="flex-1 py-1.5 rounded-xl bg-[#17745A] text-white text-xs font-bold hover:bg-[#135E49] transition flex items-center justify-center gap-1"
                    >
                      <Truck size={13} /> Send Helper
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Add Custom Store Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
              <h3 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'नया प्रोडक्ट जोड़ें' : 'Add Store Produce / Staple'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#625F59] hover:bg-black/5 dark:text-[#A7B3AF]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Ghee or Green Chillies"
                  value={customProduct.name}
                  onChange={(e) => setCustomProduct({ ...customProduct, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 60"
                    value={customProduct.rate}
                    onChange={(e) => setCustomProduct({ ...customProduct, rate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg / 500g"
                    value={customProduct.unit}
                    onChange={(e) => setCustomProduct({ ...customProduct, unit: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Integrated Image & Camera Capture */}
              <ImageCaptureInput
                value={customProduct.image}
                onChange={(img) => setCustomProduct({ ...customProduct, image: img })}
                label="Product Photo"
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD5C8]/60 dark:border-[#223832]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Add to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Helper Dispatch Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC]">
              Dispatch Order #{dispatchModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF]">
              Assign this 300m–500m order to your shop helper for fast 10–15 min delivery.
            </p>
            <form onSubmit={handleDispatchOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                  Helper Name
                </label>
                <input
                  type="text"
                  required
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                  Helper Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={helperPhone}
                  onChange={(e) => setHelperPhone(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperPortal;
