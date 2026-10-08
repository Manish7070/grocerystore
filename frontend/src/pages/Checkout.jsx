import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authAPI, ordersAPI } from '../utils/api';
import { initiatePayment } from '../utils/razorpay';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { readAddressDraft, readPendingPayment, savePendingPayment, cartFingerprint } from '../utils/checkoutSession';

const Checkout = () => {
  const { user, authLoading } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState('');
  const [pendingPayment, setPendingPayment] = useState(() => readPendingPayment(sessionStorage, user?._id));
  const [paymentMethod, setPaymentMethod] = useState(() => pendingPayment ? 'razorpay' : 'cod');
  const [paymentConfigured, setPaymentConfigured] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(() => readAddressDraft(sessionStorage, user));
  const submitting = useRef(false);
  const navigate = useNavigate();
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
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      if (paymentMethod === 'cod') {
        await ordersAPI.createCodOrder(orderData);
        clearCart();
        setCompletedPaymentMethod('cod');
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
        confirmation = { id: res.data.id, response: paymentResponse, cartFingerprint: cartFingerprint(cart) };
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
      <div className="min-h-screen py-12 px-4 bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle size={96} className="mx-auto text-emerald-600 mb-8" />
          <h2 className="text-4xl font-bold text-slate-950 mb-4">
            {completedPaymentMethod === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            {completedPaymentMethod === 'cod'
              ? 'Pay with cash when your groceries are delivered.'
              : 'Your order has been placed.'}
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleCheckout} className="py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between py-2">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-6">
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
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
