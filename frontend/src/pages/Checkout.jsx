import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authAPI, ordersAPI, couponsAPI, productsAPI } from '../utils/api';
import { initiatePayment } from '../utils/razorpay';
import { CreditCard, CheckCircle, Tag, Truck, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { readAddressDraft, readPendingPayment, savePendingPayment, cartFingerprint } from '../utils/checkoutSession';

const Checkout = () => {
  const { user, authLoading } = useAuth();
  const { cart, total, clearCart, addItem, updateQty } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [deliverySlot, setDeliverySlot] = useState('⚡ Hyperlocal Express 300m–500m (10–15 Mins by Local Helper)');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(() => readPendingPayment(sessionStorage, user?._id));
  const [paymentMethod, setPaymentMethod] = useState(() => (pendingPayment ? 'razorpay' : 'cod'));
  const [paymentConfigured, setPaymentConfigured] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(() => readAddressDraft(sessionStorage, user));
  const submitting = useRef(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponsAPI.apply(couponInput.trim(), total);
      setAppliedCoupon(res.data.code);
      setCouponDiscount(res.data.discount);
      showToast(res.data.message, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid promotional voucher', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || paymentSuccess) return;
    if (!user) navigate('/signin', { replace: true, state: { from: '/checkout' } });
    else if (!cart.length && !pendingPayment) navigate('/cart', { replace: true });
  }, [cart.length, user, navigate, paymentSuccess, authLoading, pendingPayment]);

  useEffect(() => {
    if (user && !paymentSuccess) {
      try {
        sessionStorage.setItem(`checkout-address:${user._id}`, JSON.stringify(deliveryAddress));
      } catch {
        /* Storage may be disabled. */
      }
    }
    if (user && paymentSuccess) {
      try {
        sessionStorage.removeItem(`checkout-address:${user._id}`);
      } catch {
        /* Storage may be disabled. */
      }
    }
  }, [deliveryAddress, user, paymentSuccess]);

  useEffect(() => {
    ordersAPI
      .getPaymentConfig()
      .then(({ data }) => {
        setPaymentConfigured(Boolean(data.configured));
        setPaymentMode(data.mode);
      })
      .catch(() => setPaymentConfigured(false));
  }, []);

  const handleSyncCart = async () => {
    try {
      const { data: allProducts } = await productsAPI.getAll();
      if (!allProducts?.length) return;
      let reconciled = 0;
      cart.forEach((item) => {
        const found = allProducts.find(
          (p) => String(p._id).toLowerCase() === String(item._id).toLowerCase() ||
                 p.name.toLowerCase() === item.name.toLowerCase()
        );
        if (found && String(found._id) !== String(item._id)) {
          updateQty(item._id, 0);
          addItem(found, item.quantity);
          reconciled++;
        }
      });
      setPaymentError('');
      showToast(reconciled > 0 ? `Synchronized ${reconciled} items with active catalog.` : 'Basket is verified with catalog.');
    } catch {
      showToast('Unable to synchronize basket with catalog.', 'error');
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if ((!cart.length && !pendingPayment) || !user || authLoading || submitting.current) return;

    submitting.current = true;
    setLoading(true);
    setPaymentError('');
    try {
      await authAPI.profile();
      const orderData = {
        deliveryAddress,
        deliverySlot,
        couponCode: appliedCoupon,
        couponDiscount,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      if (paymentMethod === 'cod') {
        const res = await ordersAPI.createCodOrder(orderData);
        clearCart();
        setCompletedPaymentMethod('cod');
        setPlacedOrder(res.data.order);
        setPaymentSuccess(true);
        showToast('Cash on Delivery order confirmed.');
        return;
      }

      let confirmation = pendingPayment;
      if (!confirmation) {
        const res = await ordersAPI.createOrder(orderData);
        const paymentKey = res.data.keyId;
        if (!paymentKey) throw new Error('Online payment is currently unavailable');
        const paymentResponse = await initiatePayment(paymentKey, res.data, {
          ...user,
          phone: deliveryAddress.phone,
        });
        confirmation = {
          id: res.data.id,
          response: paymentResponse,
          cartFingerprint: cartFingerprint(cart),
          orderNumber: res.data.orderNumber,
        };
        savePendingPayment(sessionStorage, user._id, confirmation);
        setPendingPayment(confirmation);
      }
      const paymentResponse = confirmation.response;
      await ordersAPI.verifyPayment(confirmation.id, {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      });
      savePendingPayment(sessionStorage, user._id, null);
      if (confirmation.cartFingerprint === cartFingerprint(cart)) clearCart();
      setCompletedPaymentMethod('razorpay');
      setPlacedOrder({
        orderNumber: confirmation.orderNumber || 'GS-Verified',
        totalAmount: Math.max(total - couponDiscount, 1),
        deliverySlot,
      });
      setPaymentSuccess(true);
      showToast('Payment verified. Order confirmed.');
    } catch (error) {
      if (error.response?.status === 401) return;
      const message =
        error.response?.data?.message || error.message || 'Unable to complete checkout. Please try again.';
      setPaymentError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] px-4 py-16 flex items-center justify-center transition-colors">
        <div className="max-w-md w-full rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#17745A] dark:text-[#10B981] flex items-center justify-center mb-5 shadow-xs">
            <CheckCircle size={36} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#192D2A] mb-2 dark:text-[#F8FAFC]">
            {completedPaymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Verified & Confirmed!'}
          </h1>
          <p className="text-xs text-[#625F59] mb-6 dark:text-[#A7B3AF] leading-relaxed">
            {completedPaymentMethod === 'cod'
              ? 'Please keep exact cash ready upon doorstep delivery or pay via driver UPI QR.'
              : 'Payment captured securely. The local distribution hub is packing your fresh harvest.'}
          </p>

          {placedOrder?.orderNumber && (
            <div className="mb-6 rounded-2xl border border-[#DDD5C8] bg-[#FDFBF7] p-4 text-left dark:bg-[#162723] dark:border-[#2A443E]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
                Order Tracking Reference
              </span>
              <p className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC] mt-0.5">
                {placedOrder.orderNumber}
              </p>
              {placedOrder.deliveryOtp && (
                <div className="mt-3 rounded-xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Doorstep Verification OTP:</span>
                  <span className="font-mono text-lg font-black text-[#192D2A] dark:text-[#F8FAFC] tracking-widest">{placedOrder.deliveryOtp}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {placedOrder?.orderNumber && (
              <button
                type="button"
                onClick={() => navigate(`/track/${placedOrder.orderNumber}`)}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Track Delivery Timeline
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="btn-secondary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] px-4 py-10 sm:px-6 lg:py-14 transition-colors">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[#DDD5C8]/80 pb-6 dark:border-[#223832]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-[#17745A] dark:text-[#10B981] border border-emerald-200 dark:border-emerald-800/60 mb-2">
            <ShieldCheck size={13} />
            <span>Encrypted Checkout Protocol</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
            Doorstep Delivery & Payment
          </h1>
        </div>

        <form onSubmit={handleCheckout} className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Basket Items & Delivery Details */}
          <div className="space-y-6">
            {/* Basket Items Summary */}
            <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-4">
                Basket Items ({cart.length})
              </h2>
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 border-b border-[#DDD5C8]/70 pb-4 dark:border-[#223832]">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#192D2A] truncate max-w-[220px] dark:text-[#F8FAFC]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-serif font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon */}
              <div className="mt-5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF] flex items-center gap-1.5 mb-2">
                  <Tag size={13} className="text-[#17745A] dark:text-[#10B981]" /> Promotional Voucher
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50, SAVER100"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="input-field uppercase font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Voucher Applied: {appliedCoupon} (-₹{couponDiscount})
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="mt-5 border-t border-[#DDD5C8]/70 pt-4 space-y-2 text-xs dark:border-[#223832]">
                <div className="flex justify-between text-[#625F59] dark:text-[#A7B3AF]">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold text-[#192D2A] dark:text-[#F8FAFC]">₹{total.toFixed(0)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-400">
                    <span>Voucher Savings</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-[#DDD5C8]/70 font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC] dark:border-[#223832]">
                  <span>Grand Total</span>
                  <span className="text-[#17745A] dark:text-[#10B981]">
                    ₹{Math.max(total - couponDiscount, 1).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Slot Choice */}
            <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#192D2A] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
                <Truck size={17} className="text-[#17745A] dark:text-[#10B981]" /> Preferred Delivery Window
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  '⚡ Hyperlocal Express 300m–500m (10–15 Mins by Local Helper)',
                  'Express Dispatch (Next 2-hour window)',
                  'Morning Window (7:00 AM – 10:00 AM)',
                  'Evening Window (5:00 PM – 8:00 PM)',
                ].map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer font-medium transition ${
                      deliverySlot === slot
                        ? 'border-[#17745A] bg-[#17745A]/5 text-[#192D2A] font-bold dark:border-[#10B981] dark:bg-[#10B981]/10 dark:text-[#F8FAFC]'
                        : 'border-[#DDD5C8] text-[#625F59] hover:bg-[#FDFBF7] dark:border-[#2A443E] dark:text-[#A7B3AF] dark:hover:bg-[#162723]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={slot}
                      checked={deliverySlot === slot}
                      onChange={() => setDeliverySlot(slot)}
                      className="accent-[#17745A] h-4 w-4"
                    />
                    <span className="text-xs">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address Form & Payment Gateway */}
          <div className="space-y-6">
            {/* Delivery Address Details */}
            <fieldset
              disabled={loading || Boolean(pendingPayment)}
              className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-sm space-y-4"
            >
              <legend className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC] px-1">
                Delivery Address Details
              </legend>
              {[
                { key: 'name', label: 'Full name', autoComplete: 'name', maxLength: 100 },
                {
                  key: 'phone',
                  label: 'Mobile phone (10 digits)',
                  type: 'tel',
                  autoComplete: 'tel-national',
                  pattern: '[6-9][0-9]{9}',
                  maxLength: 10,
                },
                {
                  key: 'address',
                  label: 'Flat, house number & street',
                  autoComplete: 'street-address',
                  maxLength: 500,
                },
                { key: 'city', label: 'City', autoComplete: 'address-level2', maxLength: 100 },
                {
                  key: 'pincode',
                  label: 'Postal PIN code',
                  autoComplete: 'postal-code',
                  pattern: '[1-9][0-9]{5}',
                  maxLength: 6,
                },
              ].map(({ key, label, ...inputProps }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    {label}
                  </label>
                  <input
                    {...inputProps}
                    required
                    value={deliveryAddress[key]}
                    onChange={(event) =>
                      setDeliveryAddress({ ...deliveryAddress, [key]: event.target.value })
                    }
                    className="input-field"
                  />
                </div>
              ))}
            </fieldset>

            {/* Payment Method Selection */}
            <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-4">
                Payment Method
              </h3>
              <div className="space-y-3 mb-5 text-xs">
                <label
                  className={`block rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#17745A] bg-[#17745A]/5 ring-1 ring-[#17745A] dark:border-[#10B981] dark:bg-[#10B981]/10 dark:ring-[#10B981]'
                      : 'border-[#DDD5C8] text-[#625F59] hover:bg-[#FDFBF7] dark:border-[#2A443E] dark:text-[#A7B3AF] dark:hover:bg-[#162723]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      disabled={loading || Boolean(pendingPayment)}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#17745A] h-4 w-4"
                    />
                    <span className="font-bold text-sm text-[#192D2A] dark:text-[#F8FAFC]">Cash on Delivery (COD)</span>
                  </div>
                  <span className="block pl-6 text-xs text-[#625F59] mt-1 dark:text-[#A7B3AF]">
                    Pay securely in cash or scan the driver UPI QR code upon doorstep arrival.
                  </span>
                </label>

                <label
                  className={`block rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#17745A] bg-[#17745A]/5 ring-1 ring-[#17745A] dark:border-[#10B981] dark:bg-[#10B981]/10 dark:ring-[#10B981]'
                      : 'border-[#DDD5C8] text-[#625F59] hover:bg-[#FDFBF7] dark:border-[#2A443E] dark:text-[#A7B3AF] dark:hover:bg-[#162723]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      disabled={loading || Boolean(pendingPayment)}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-[#17745A] h-4 w-4"
                    />
                    <span className="font-bold text-sm text-[#192D2A] dark:text-[#F8FAFC]">Pay Online (Razorpay Gateway)</span>
                  </div>
                  <span className="block pl-6 text-xs text-[#625F59] mt-1 dark:text-[#A7B3AF]">
                    Instant UPI, Cards & Net Banking with automated HMAC verification.
                  </span>
                </label>
              </div>

              {paymentError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300">
                  <p className="font-semibold">{paymentError}</p>
                  <button
                    type="button"
                    onClick={handleSyncCart}
                    className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#17745A] underline hover:no-underline dark:text-[#10B981]"
                  >
                    <RefreshCw size={13} />
                    <span>Synchronize & verify basket with catalog</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  authLoading ||
                  !user ||
                  loading ||
                  (!pendingPayment && paymentMethod === 'razorpay' && paymentConfigured !== true)
                }
                className="btn-primary w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider"
              >
                {authLoading
                  ? 'Verifying session...'
                  : loading
                  ? 'Processing Order...'
                  : pendingPayment
                  ? 'Check Payment Status'
                  : paymentMethod === 'cod'
                  ? `Confirm COD Order (₹${Math.max(total - couponDiscount, 1).toFixed(0)})`
                  : `Pay Online (₹${Math.max(total - couponDiscount, 1).toFixed(0)})`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
