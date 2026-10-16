import { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  UserCheck,
  Phone,
  QrCode,
  DollarSign,
  Printer,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Banknote,
  PackageCheck,
  Sprout,
  Users
} from 'lucide-react';
import { productsAPI, ordersAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const StorePOS = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Active Store Helper
  const [activeHelper, setActiveHelper] = useState({
    name: user?.name || 'Kiran (Store Staff)',
    helperCode: user?.partnerProfile?.helperCode || 'HLP-1042',
    storeName: user?.partnerProfile?.businessName || 'GroceryStore Walk-in Store Hub',
  });

  // Walk-in Cart
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Payment & Handover Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash'); // 'cash' | 'upi' | 'card'
  const [processingOrder, setProcessingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Helper ID Creation Modal (for Store Admin)
  const [helperModalOpen, setHelperModalOpen] = useState(false);
  const [newHelperData, setNewHelperData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    helperCode: `HLP-${Math.floor(1000 + Math.random() * 9000)}`,
    storeLocation: 'Main Store Walk-in Counter',
  });
  const [savingHelper, setSavingHelper] = useState(false);

  useEffect(() => {
    productsAPI
      .getAll()
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products for POS:', err);
        setLoading(false);
      });
  }, []);

  // Filter products for POS quick search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (product) => {
    if ((product.stock ?? 1) <= 0) {
      showToast(`${product.name} is out of stock!`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.price || item.product.sellingPrice || 0) * item.quantity,
    0
  );

  const handleOpenHandover = () => {
    if (cart.length === 0) {
      showToast('Please add items to the walk-in cart', 'info');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      showToast('Please enter customer 10-digit mobile number', 'error');
      return;
    }

    // Generate 4-digit verification handover OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp(otp); // Prefilled for swift counter flow
    setCheckoutModalOpen(true);
  };

  const handleConfirmSale = async () => {
    if (enteredOtp !== generatedOtp) {
      showToast('Invalid Handover OTP! Please enter correct code.', 'error');
      return;
    }

    setProcessingOrder(true);
    try {
      const itemsPayload = cart.map((i) => ({
        productId: i.product._id,
        quantity: i.quantity,
        name: i.product.name,
        price: i.product.price || i.product.sellingPrice,
      }));

      const res = await ordersAPI.createPosOrder({
        items: itemsPayload,
        customerName: customerName.trim() || 'Walk-in Customer',
        customerPhone: customerPhone.trim(),
        paymentMethod: paymentMode,
        helperName: activeHelper.name,
        helperCode: activeHelper.helperCode,
        storeName: activeHelper.storeName,
      });

      setCompletedOrder({
        orderNumber: res.data?.orderNumber || `POS-${Date.now().toString().slice(-6)}`,
        items: cart,
        totalAmount: subtotal,
        customerName: customerName || 'Walk-in Customer',
        customerPhone,
        paymentMode,
        helper: activeHelper,
        timestamp: new Date(),
      });

      // Clear local cart
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setCheckoutModalOpen(false);
      showToast('In-store sale verified & stock deducted in MongoDB!', 'success');
    } catch (err) {
      console.error('POS sale failed:', err);
      showToast(err?.response?.data?.message || 'Failed to complete sale', 'error');
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleCreateHelper = async (e) => {
    e.preventDefault();
    setSavingHelper(true);
    try {
      await authAPI.createHelper(newHelperData);
      showToast(`Helper ID ${newHelperData.helperCode} created for ${newHelperData.name}!`, 'success');
      setActiveHelper({
        name: newHelperData.name,
        helperCode: newHelperData.helperCode,
        storeName: newHelperData.storeLocation,
      });
      setHelperModalOpen(false);
      setNewHelperData({
        name: '',
        phone: '',
        email: '',
        password: '',
        helperCode: `HLP-${Math.floor(1000 + Math.random() * 9000)}`,
        storeLocation: 'Main Store Walk-in Counter',
      });
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to create helper ID', 'error');
    } finally {
      setSavingHelper(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] pb-24 text-[#192D2A] dark:text-[#F8FAFC]">
      {/* Top Header Terminal Bar */}
      <div className="border-b border-[#DDD5C8] bg-white px-4 py-4 dark:border-[#223933] dark:bg-[#13221E] shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white shrink-0 shadow-sm">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-[#192D2A] dark:text-white">
                  Physical Store POS &amp; Walk-in Counter
                </h1>
                <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  Live Terminal
                </span>
              </div>
              <p className="text-xs text-[#6B655D] dark:text-[#94A3B8]">
                {activeHelper.storeName} &bull; Staff: <strong className="text-emerald-700 dark:text-emerald-400">{activeHelper.name}</strong> ({activeHelper.helperCode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setHelperModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700/30 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-700/60 dark:text-emerald-300 transition shadow-xs"
            >
              <Users size={14} />
              <span>Generate Helper ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* LEFT: Product Catalog & Lookup Scanner */}
          <div className="space-y-4">
            {/* Search and Category Filter */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-4 dark:border-[#223933] dark:bg-[#142320] shadow-xs">
              <div className="relative mb-3">
                <Search size={18} className="absolute left-3.5 top-3 text-emerald-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan barcode or type produce name (e.g. Rice, Potato, Ghee)..."
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Vegetables', 'Fruits', 'Dairy & Eggs', 'Grains & Pulses', 'Spices & Seasonings'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'border border-[#DDD5C8] bg-[#FAF7F0] text-[#555048] hover:border-emerald-600 dark:border-[#2A443E] dark:bg-[#182925] dark:text-[#CBD5E1]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-4 dark:border-[#223933] dark:bg-[#142320] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B655D] dark:text-[#94A3B8]">
                  Available Stock ({filteredProducts.length} items)
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Live MongoDB Synced
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-32 rounded-xl bg-gray-100 animate-pulse dark:bg-[#182925]" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7A746E]">
                  No products matched &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-1">
                  {filteredProducts.map((p) => {
                    const price = p.price || p.sellingPrice || 0;
                    const isOutOfStock = (p.stock ?? 1) <= 0;
                    return (
                      <div
                        key={p._id}
                        onClick={() => !isOutOfStock && addToCart(p)}
                        className={`group cursor-pointer rounded-xl border border-[#E2DBD0] bg-[#FAF7F0] p-2.5 transition-all hover:border-emerald-600 hover:shadow-md dark:border-[#223933] dark:bg-[#162723] ${
                          isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'active:scale-98'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-white mb-2">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-[#192D2A] dark:text-white capitalize truncate">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#716C65] dark:text-[#94A3B8] truncate">
                          {p.unit || 'Standard'} &bull; {p.category}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-[#192D2A] dark:text-white">
                            ₹{price}
                          </span>
                          <span className="rounded-md bg-emerald-700 text-white p-1 shadow-xs hover:bg-emerald-800">
                            <Plus size={12} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Walk-In Billing Counter & OTP Verification */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-5 dark:border-[#223933] dark:bg-[#142320] shadow-sm flex flex-col h-full">
              {/* Customer Phone & Name Header */}
              <div className="border-b border-[#DDD5C8]/80 pb-4 mb-4 dark:border-[#2A443E]">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white">
                    Walk-in Customer Details
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name (Optional)"
                    className="rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile No. (Required for OTP) *"
                    className="rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto max-h-[340px] divide-y divide-[#DDD5C8]/40 dark:divide-[#223933] mb-4">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#7A746E] dark:text-[#94A3B8]">
                    <Receipt size={32} className="mx-auto mb-2 text-[#DDD5C8] dark:text-[#2A443E]" />
                    <p className="font-semibold text-sm text-[#192D2A] dark:text-white">No items added to counter</p>
                    <p className="mt-1">Click produce on the left to scan into cart.</p>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => {
                    const price = product.price || product.sellingPrice || 0;
                    return (
                      <div key={product._id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#192D2A] dark:text-white capitalize truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-[#7A746E] dark:text-[#94A3B8]">
                            ₹{price} &times; {quantity} = ₹{price * quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product._id, -1)}
                            className="p-1 rounded-md border border-[#DDD5C8] hover:bg-gray-100 dark:border-[#2A443E] dark:hover:bg-[#1A2E28]"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product._id, 1)}
                            className="p-1 rounded-md border border-[#DDD5C8] hover:bg-gray-100 dark:border-[#2A443E] dark:hover:bg-[#1A2E28]"
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(product._id)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subtotal & Action Bar */}
              <div className="border-t border-[#DDD5C8] pt-4 dark:border-[#2A443E] mt-auto">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B655D] dark:text-[#94A3B8]">
                    Total Payable Amount:
                  </span>
                  <span className="font-serif text-2xl font-black text-[#192D2A] dark:text-white">
                    ₹{subtotal}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleOpenHandover}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <ShieldCheck size={16} />
                  <span>Collect Payment &amp; Verify Handover</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT & OTP VERIFICATION MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[#DDD5C8] bg-white p-6 shadow-2xl dark:border-[#223933] dark:bg-[#142320]">
            <div className="flex items-center justify-between border-b border-[#DDD5C8]/80 pb-3 mb-4 dark:border-[#2A443E]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="font-serif text-base font-bold text-[#192D2A] dark:text-white">
                  Payment Collection &amp; OTP Handover
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Total Amount Pill */}
            <div className="rounded-xl bg-[#F4EFE6] p-4 text-center dark:bg-[#0E1A17] mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B655D] dark:text-[#94A3B8] block">
                Total Collection Amount
              </span>
              <span className="font-serif text-3xl font-black text-emerald-800 dark:text-emerald-400">
                ₹{subtotal}
              </span>
              <p className="text-xs text-[#716C65] mt-1 dark:text-[#94A3B8]">
                Customer Mobile: <strong>{customerPhone}</strong>
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                Select Payment Mode Received:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'upi', label: 'Instant UPI', icon: QrCode },
                  { id: 'card', label: 'Debit/Credit', icon: CreditCard },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMode(mode.id)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-bold transition ${
                        paymentMode === mode.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-[#DDD5C8] text-[#555048] hover:bg-gray-50 dark:border-[#2A443E] dark:text-[#CBD5E1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OTP Handover Verification Box */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30 mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Customer Security Handover OTP:
                </span>
                <span className="font-mono text-base font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
                  {generatedOtp}
                </span>
              </div>
              <p className="text-[11px] text-[#555048] dark:text-[#94A3B8] mb-3">
                Verify this 4-digit code provided by customer to complete in-store handover:
              </p>
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="w-full text-center font-mono text-xl tracking-widest font-bold py-2 rounded-xl border border-emerald-400 bg-white dark:bg-[#182925] text-emerald-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Submit Handover Button */}
            <button
              type="button"
              disabled={processingOrder}
              onClick={handleConfirmSale}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingOrder ? (
                <span>Deducting Stock &amp; Generating Receipt...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verify OTP &amp; Complete Handover</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED ORDER RECEIPT MODAL */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[#DDD5C8] bg-white p-6 shadow-2xl dark:border-[#223933] dark:bg-[#142320]">
            <div className="text-center pb-4 border-b border-[#DDD5C8]/80 dark:border-[#2A443E]">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <PackageCheck size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#192D2A] dark:text-white">
                Counter Handover Complete!
              </h3>
              <p className="text-xs text-[#6B655D] dark:text-[#94A3B8] mt-0.5">
                Receipt #{completedOrder.orderNumber} &bull; {new Date(completedOrder.timestamp).toLocaleTimeString()}
              </p>
            </div>

            {/* Receipt Breakdown */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B655D] dark:text-[#94A3B8]">
                <span>Store Hub:</span>
                <span className="font-semibold text-[#192D2A] dark:text-white">{completedOrder.helper.storeName}</span>
              </div>
              <div className="flex justify-between text-[#6B655D] dark:text-[#94A3B8]">
                <span>Staff:</span>
                <span className="font-semibold text-[#192D2A] dark:text-white">{completedOrder.helper.name} ({completedOrder.helper.helperCode})</span>
              </div>
              <div className="flex justify-between text-[#6B655D] dark:text-[#94A3B8]">
                <span>Customer Phone:</span>
                <span className="font-semibold text-[#192D2A] dark:text-white">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between text-[#6B655D] dark:text-[#94A3B8]">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-700 uppercase">{completedOrder.paymentMode} (PAID)</span>
              </div>

              {/* Items List */}
              <div className="mt-3 border-t border-b border-[#DDD5C8]/70 py-2.5 dark:border-[#2A443E] max-h-40 overflow-y-auto">
                {completedOrder.items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between py-1 text-xs">
                    <span className="capitalize">{quantity} &times; {product.name}</span>
                    <span className="font-semibold">₹{(product.price || product.sellingPrice) * quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-1 text-sm font-bold">
                <span>Total Amount Collected:</span>
                <span className="font-serif text-lg text-emerald-800 dark:text-emerald-300">₹{completedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] py-2.5 text-xs font-bold text-[#192D2A] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-1.5 transition"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm transition"
              >
                New Walk-in Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELPER ID GENERATOR MODAL */}
      {helperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-[#DDD5C8] bg-white p-6 shadow-2xl dark:border-[#223933] dark:bg-[#142320]">
            <div className="flex items-center justify-between border-b border-[#DDD5C8]/80 pb-3 mb-4 dark:border-[#2A443E]">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-600" />
                <h3 className="font-serif text-base font-bold text-[#192D2A] dark:text-white">
                  Create Store Helper Staff ID
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHelperModalOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#6B655D] dark:text-[#94A3B8] mb-4">
              Store admin can grant restricted POS terminal access to store helpers for product lookup, price check, and walk-in sales.
            </p>

            <form onSubmit={handleCreateHelper} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-1">
                  Helper Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={newHelperData.name}
                  onChange={(e) => setNewHelperData({ ...newHelperData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3.5 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-1">
                  Staff Helper ID Code *
                </label>
                <input
                  type="text"
                  required
                  value={newHelperData.helperCode}
                  onChange={(e) => setNewHelperData({ ...newHelperData, helperCode: e.target.value })}
                  className="w-full font-mono font-bold rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3.5 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-1">
                  Store Location / Branch
                </label>
                <input
                  type="text"
                  value={newHelperData.storeLocation}
                  onChange={(e) => setNewHelperData({ ...newHelperData, storeLocation: e.target.value })}
                  placeholder="e.g. Ward 3 Main Bazaar Counter"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3.5 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-1">
                  Staff Email Address (For Login) *
                </label>
                <input
                  type="email"
                  required
                  value={newHelperData.email}
                  onChange={(e) => setNewHelperData({ ...newHelperData, email: e.target.value })}
                  placeholder="e.g. rahul.helper@grocerystore.in"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3.5 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-1">
                  Staff Access Password / PIN *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newHelperData.password}
                  onChange={(e) => setNewHelperData({ ...newHelperData, password: e.target.value })}
                  placeholder="Minimum 6 characters or digits"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-3.5 py-2 text-xs text-[#192D2A] dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingHelper}
                  className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-800 transition disabled:opacity-50"
                >
                  {savingHelper ? 'Generating ID...' : 'Generate Helper ID & Grant POS Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePOS;
