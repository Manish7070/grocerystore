import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authAPI, ordersAPI, couponsAPI } from '../utils/api';
import { initiatePayment } from '../utils/razorpay';
import { CreditCard, CheckCircle, Tag, Truck } from 'lucide-react';
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
  const [deliverySlot, setDeliverySlot] = useState('Express Delivery (30-45 mins)');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(() => readPendingPayment(sessionStorage, user?._id));
  const [paymentMethod, setPaymentMethod] = useState(() => pendingPayment ? 'razorpay' : 'cod');
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
      showToast(err.response?.data?.message || 'Invalid coupon code', 'error');
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
      try { sessionStorage.setItem(`checkout-address:${user._id}`, JSON.stringify(deliveryAddress)); } catch { /* Storage may be disabled. */ }
    }
    if (user && paymentSuccess) {
      try { sessionStorage.removeItem(`checkout-address:${user._id}`); } catch { /* Storage may be disabled. */ }
    }
  }, [deliveryAddress, user, paymentSuccess]);

  useEffect(() => {
    ordersAPI.getPaymentConfig()
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
      // Validate this session before creating an order or opening the payment gateway.
      await authAPI.profile();
      const orderData = {
        deliveryAddress,
        deliverySlot,
        couponCode: appliedCoupon,
        couponDiscount,
        items: cart.map(item => ({
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
        showToast('Cash on Delivery order placed successfully.');
        return;
      }

      let confirmation = pendingPayment;
      if (!confirmation) {
        const res = await ordersAPI.createOrder(orderData);
        const paymentKey = res.data.keyId;
        if (!paymentKey) throw new Error('Online payment is currently unavailable');
        const paymentResponse = await initiatePayment(paymentKey, res.data, { ...user, phone: deliveryAddress.phone });
        confirmation = { id: res.data.id, response: paymentResponse, cartFingerprint: cartFingerprint(cart), orderNumber: res.data.orderNumber };
        // Save before verification: a session expiry or refresh must not ask for a second payment.
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
      // A resumed receipt must not empty a different basket added since the payment.
      if (confirmation.cartFingerprint === cartFingerprint(cart)) clearCart();
      setCompletedPaymentMethod('razorpay');
      setPlacedOrder({ orderNumber: confirmation.orderNumber || 'TD-Verified', totalAmount: Math.max(total - couponDiscount, 1), deliverySlot });
      setPaymentSuccess(true);
      showToast('Payment successful. Your order has been placed.');
    } catch (error) {
      if (error.response?.status === 401) return;
      const message = error.response?.data?.message || error.message || 'Unable to complete checkout. Please try again.';
      setPaymentError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };
  if (paymentSuccess) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md rounded-[2.5rem] bg-white p-8 border border-emerald-900/10 shadow-xl dark:bg-[#14231a] dark:border-white/10">
          <CheckCircle size={80} className="mx-auto text-emerald-600 mb-6" />
          <h2 className="text-3xl font-black text-stone-900 mb-2 dark:text-white">
            {completedPaymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Verified & Placed!'}
          </h2>
          <p className="text-sm font-medium text-stone-600 mb-4 dark:text-stone-300">
            {completedPaymentMethod === 'cod'
              ? 'Pay with cash upon doorstep delivery.'
              : 'Payment captured securely. Fulfillment center preparing your produce.'}
          </p>
          {placedOrder?.orderNumber && (
            <div className="mb-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800">
              <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">Order ID</span>
              <p className="text-xl font-black text-emerald-900 dark:text-emerald-100">{placedOrder.orderNumber}</p>
              {placedOrder.deliveryOtp && (
                <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Doorstep OTP: <span className="font-mono text-base">{placedOrder.deliveryOtp}</span>
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {placedOrder?.orderNumber && (
              <button
                onClick={() => navigate(`/track/${placedOrder.orderNumber}`)}
                className="w-full bg-[#075F46] text-white py-3.5 rounded-2xl font-black hover:bg-[#064D3A] transition shadow-md"
              >
                Track Delivery Live
              </button>
            )}
            <button
              onClick={() => navigate('/orders')}
              className="w-full border border-stone-200 bg-white text-stone-800 py-3 rounded-2xl font-bold hover:bg-stone-50 transition dark:bg-stone-800 dark:border-white/10 dark:text-white"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleCheckout} className="py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-[2rem] border border-emerald-900/10 shadow-sm p-6 sm:p-8 dark:bg-[#14231a] dark:border-white/10">
          <h2 className="text-2xl font-black text-stone-900 mb-6 dark:text-white">Order Summary</h2>
          <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center py-2 text-sm">
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">{item.name} ×{item.quantity}</span>
                <span className="font-black text-emerald-800 dark:text-emerald-400 shrink-0 ml-2">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="mb-6 rounded-2xl bg-stone-50 p-4 border border-stone-200/60 dark:bg-stone-900 dark:border-white/5">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5 mb-2">
              <Tag size={14} className="text-emerald-700" />
              Promo Coupon
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TAAZA20, WELCOME50"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-white px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 uppercase outline-none dark:bg-stone-800 dark:border-white/10 dark:text-white"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="rounded-xl bg-[#075F46] px-4 py-2 text-xs font-black text-white hover:bg-[#064D3A] disabled:opacity-40"
              >
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
            {appliedCoupon && (
              <p className="mt-2 text-xs font-bold text-emerald-700">
                Applied: {appliedCoupon} (-₹{couponDiscount})
              </p>
            )}
          </div>

          <div className="border-t border-stone-100 pt-4 dark:border-white/5 space-y-2">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Subtotal</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm font-bold text-emerald-700">
                <span>Coupon Savings</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-black pt-2 text-stone-900 dark:text-white border-t border-stone-100 dark:border-white/5">
              <span>Final Total</span>
              <span className="text-emerald-800 dark:text-emerald-400">₹{Math.max(total - couponDiscount, 1).toFixed(0)}</span>
            </div>
          </div>

          {/* Delivery Slot Selector */}
          <div className="mt-6 border-t border-stone-100 pt-6 dark:border-white/5">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5 mb-3">
              <Truck size={16} className="text-emerald-700" />
              Choose Delivery Slot
            </h3>
            <div className="space-y-2">
              {[
                'Express Delivery (30-45 mins)',
                'Morning Slot (7:00 AM - 10:00 AM)',
                'Evening Slot (5:00 PM - 8:00 PM)',
              ].map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs font-bold transition ${
                    deliverySlot === slot
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    value={slot}
                    checked={deliverySlot === slot}
                    onChange={() => setDeliverySlot(slot)}
                    className="accent-[#075F46]"
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
          </div>
          <fieldset disabled={loading || Boolean(pendingPayment)} className="space-y-4 border-t pt-6">
            <legend className="text-xl font-bold text-slate-950">Delivery details</legend>
            {[
              { key: 'name', label: 'Full name', autoComplete: 'name', maxLength: 100 },
              { key: 'phone', label: 'Mobile number (10 digits)', type: 'tel', autoComplete: 'tel-national', pattern: '[6-9][0-9]{9}', maxLength: 10 },
              { key: 'address', label: 'House, street and area', autoComplete: 'street-address', maxLength: 500 },
              { key: 'city', label: 'City', autoComplete: 'address-level2', maxLength: 100 },
              { key: 'pincode', label: 'Pincode', autoComplete: 'postal-code', pattern: '[1-9][0-9]{5}', maxLength: 6 },
            ].map(({ key, label, ...inputProps }) => (
              <label key={key} className="block text-sm font-semibold text-slate-700">
                {label}
                <input {...inputProps} required value={deliveryAddress[key]}
                  onChange={(event) => setDeliveryAddress({ ...deliveryAddress, [key]: event.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3" />
              </label>
            ))}
          </fieldset>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <CreditCard size={56} className="mx-auto text-emerald-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-950 mb-2">Payment Method</h2>
            <p className="text-slate-600">Choose how you want to pay</p>
          </div>
          <div className="mb-5 grid gap-3">
            <label className={`cursor-pointer rounded-xl border p-4 transition-colors ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                disabled={loading || Boolean(pendingPayment)}
                onChange={() => setPaymentMethod('cod')}
                className="mr-3"
              />
              <span className="font-semibold text-slate-900">Cash on Delivery</span>
              <span className="mt-1 block pl-7 text-sm text-slate-600">Pay when your groceries arrive.</span>
            </label>
            <label className={`cursor-pointer rounded-xl border p-4 transition-colors ${paymentMethod === 'razorpay' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                disabled={loading || Boolean(pendingPayment)}
                onChange={() => setPaymentMethod('razorpay')}
                className="mr-3"
              />
              <span className="font-semibold text-slate-900">Pay Online with Razorpay</span>
            </label>
          </div>
          {paymentMethod === 'razorpay' && paymentConfigured === false && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Online payment is currently unavailable. Please choose Cash on Delivery.
            </div>
          )}
          {paymentError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {paymentError}
            </div>
          )}
          {paymentMethod === 'razorpay' && paymentMode === 'test' && (
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Test checkout: no real money is charged.</p>
          )}
          {pendingPayment && (
            <p role="status" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Payment was submitted. Use Check payment status to confirm it without paying again.
              You can also check payment status from Your orders.
            </p>
          )}
          <button
            type="submit"
            disabled={authLoading || !user || loading || (!pendingPayment && paymentMethod === 'razorpay' && paymentConfigured !== true)}
            className="w-full bg-emerald-600 text-white py-4 px-8 rounded-xl hover:bg-emerald-700 font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {authLoading ? 'Checking your session...' : paymentMethod === 'razorpay' && paymentConfigured === null ? (
              'Checking payment...'
            ) : loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : pendingPayment ? 'Check payment status' : (
              paymentMethod === 'cod'
                ? `Place COD Order ₹${total.toFixed(0)}`
                : `Pay Now ₹${total.toFixed(0)}`
            )}
          </button>
          <p className="text-xs text-slate-500 text-center mt-4">
            {paymentMethod === 'cod'
              ? 'No online payment is required.'
              : 'Secure payment powered by Razorpay.'}
          </p>
        </div>
      </div>
    </form>
  );
};
export default Checkout;
