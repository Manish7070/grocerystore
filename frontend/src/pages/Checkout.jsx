import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authAPI, ordersAPI, couponsAPI } from '../utils/api';
import { initiatePayment } from '../utils/razorpay';
import { CreditCard, CheckCircle, Tag, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { readAddressDraft, readPendingPayment, savePendingPayment, cartFingerprint } from '../utils/checkoutSession';

const Checkout = () => {
  const { user, authLoading } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [deliverySlot, setDeliverySlot] = useState('Express Dispatch (Next 2-hour window)');
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
      <div className="min-h-screen bg-porcelain px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-sandstone bg-ivory p-8 text-center shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
          <CheckCircle size={56} className="mx-auto text-terracotta mb-4 dark:text-apricot" />
          <h1 className="font-serif text-2xl font-normal text-espresso mb-1 dark:text-ivory">
            {completedPaymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Verified & Confirmed!'}
          </h1>
          <p className="text-xs text-warmStone mb-6 dark:text-ivory/70">
            {completedPaymentMethod === 'cod'
              ? 'Please keep exact cash ready upon doorstep delivery.'
              : 'Payment captured securely. Distribution hub is packing your fresh provisions.'}
          </p>

          {placedOrder?.orderNumber && (
            <div className="mb-6 rounded-xl border border-sandstone bg-porcelain p-4 text-left dark:bg-[#251D21] dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warmStone dark:text-ivory/60">
                Order Tracking Reference
              </span>
              <p className="font-serif text-xl font-bold text-espresso dark:text-ivory">
                {placedOrder.orderNumber}
              </p>
              {placedOrder.deliveryOtp && (
                <div className="mt-2.5 rounded-lg border border-terracotta/20 bg-terracotta/5 p-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-terracotta dark:text-apricot">Doorstep Handover OTP:</span>
                  <span className="font-mono text-base font-black text-espresso dark:text-ivory">{placedOrder.deliveryOtp}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {placedOrder?.orderNumber && (
              <button
                type="button"
                onClick={() => navigate(`/track/${placedOrder.orderNumber}`)}
                className="w-full rounded-xl bg-terracotta py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition"
              >
                Track Delivery Timeline
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="w-full rounded-xl border border-sandstone bg-porcelain py-3 text-xs font-bold uppercase tracking-wider text-espresso hover:bg-sandstone/30 transition dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-sandstone pb-6 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Secure Checkout</p>
          <h1 className="mt-1 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
            Delivery & Payment
          </h1>
        </div>

        <form onSubmit={handleCheckout} className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Basket Items & Delivery Details */}
          <div className="space-y-6">
            {/* Basket Items Summary */}
            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <h2 className="font-serif text-base font-semibold text-espresso dark:text-ivory mb-4">
                Basket Items ({cart.length})
              </h2>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 border-b border-sandstone pb-4 dark:border-white/10">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-espresso truncate max-w-[200px] dark:text-ivory">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-serif font-bold text-espresso dark:text-ivory">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon */}
              <div className="mt-4 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-warmStone flex items-center gap-1.5 mb-2 dark:text-ivory/60">
                  <Tag size={13} className="text-terracotta" /> Promotional Voucher
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50, SAVER100"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 rounded-lg border border-sandstone bg-porcelain px-3 py-2 text-xs font-bold uppercase text-espresso outline-none focus:border-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="rounded-lg bg-terracotta px-4 py-2 text-xs font-bold text-ivory hover:bg-[#9C432A] transition disabled:opacity-40"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="mt-2 text-xs font-bold text-successGreen">
                    Voucher Applied: {appliedCoupon} (-₹{couponDiscount})
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 border-t border-sandstone pt-4 space-y-2 text-xs dark:border-white/10">
                <div className="flex justify-between text-warmStone dark:text-ivory/70">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold text-espresso dark:text-ivory">₹{total.toFixed(0)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-bold text-successGreen">
                    <span>Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-sandstone font-serif text-lg font-bold text-espresso dark:text-ivory dark:border-white/10">
                  <span>Grand Total</span>
                  <span className="text-terracotta dark:text-apricot">
                    ₹{Math.max(total - couponDiscount, 1).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Slot Choice */}
            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <h3 className="font-serif text-sm font-semibold text-espresso flex items-center gap-2 mb-3 dark:text-ivory">
                <Truck size={15} className="text-terracotta" /> Preferred Delivery Window
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  'Express Dispatch (Next 2-hour window)',
                  'Morning Window (7:00 AM – 10:00 AM)',
                  'Evening Window (5:00 PM – 8:00 PM)',
                ].map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer font-medium transition ${
                      deliverySlot === slot
                        ? 'border-terracotta bg-terracotta/5 text-espresso font-bold dark:border-apricot dark:bg-apricot/10 dark:text-ivory'
                        : 'border-sandstone text-warmStone hover:bg-porcelain dark:border-white/10 dark:text-ivory/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={slot}
                      checked={deliverySlot === slot}
                      onChange={() => setDeliverySlot(slot)}
                      className="accent-terracotta"
                    />
                    <span>{slot}</span>
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
              className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-subtle space-y-3 dark:bg-[#1D151A] dark:border-white/10"
            >
              <legend className="font-serif text-base font-semibold text-espresso dark:text-ivory px-2">
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
                <label key={key} className="block text-xs font-semibold text-warmStone dark:text-ivory/70">
                  {label}
                  <input
                    {...inputProps}
                    required
                    value={deliveryAddress[key]}
                    onChange={(event) =>
                      setDeliveryAddress({ ...deliveryAddress, [key]: event.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-sandstone bg-porcelain px-3.5 py-2 text-xs font-medium text-espresso outline-none focus:border-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
                  />
                </label>
              ))}
            </fieldset>

            {/* Payment Method Selection */}
            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <h3 className="font-serif text-base font-semibold text-espresso mb-3 dark:text-ivory">
                Payment Method
              </h3>
              <div className="space-y-2 mb-4 text-xs">
                <label
                  className={`block rounded-xl border p-3.5 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-terracotta bg-terracotta/5 dark:border-apricot dark:bg-apricot/10'
                      : 'border-sandstone text-warmStone hover:bg-porcelain dark:border-white/10 dark:text-ivory/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    disabled={loading || Boolean(pendingPayment)}
                    onChange={() => setPaymentMethod('cod')}
                    className="mr-2.5 accent-terracotta"
                  />
                  <span className="font-bold text-espresso dark:text-ivory">Cash on Delivery</span>
                  <span className="block pl-6 text-[11px] text-warmStone mt-0.5 dark:text-ivory/60">
                    Pay securely in cash or via driver QR upon arrival.
                  </span>
                </label>

                <label
                  className={`block rounded-xl border p-3.5 cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-terracotta bg-terracotta/5 dark:border-apricot dark:bg-apricot/10'
                      : 'border-sandstone text-warmStone hover:bg-porcelain dark:border-white/10 dark:text-ivory/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    disabled={loading || Boolean(pendingPayment)}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mr-2.5 accent-terracotta"
                  />
                  <span className="font-bold text-espresso dark:text-ivory">Pay Online (Razorpay)</span>
                  <span className="block pl-6 text-[11px] text-warmStone mt-0.5 dark:text-ivory/60">
                    UPI, Credit / Debit Cards & Net Banking with instant HMAC verification.
                  </span>
                </label>
              </div>

              {paymentError && (
                <div className="mb-4 rounded-xl border border-errorRed/30 bg-errorRed/10 p-3 text-xs text-errorRed">
                  {paymentError}
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
                className="w-full rounded-xl bg-terracotta py-3.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition shadow-subtle disabled:opacity-50"
              >
                {authLoading
                  ? 'Verifying session...'
                  : loading
                  ? 'Processing Order...'
                  : pendingPayment
                  ? 'Check Payment Status'
                  : paymentMethod === 'cod'
                  ? `Confirm COD Order (₹${Math.max(total - couponDiscount, 1).toFixed(0)})`
                  : `Pay Now (₹${Math.max(total - couponDiscount, 1).toFixed(0)})`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
