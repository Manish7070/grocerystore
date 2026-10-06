import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../utils/api';
import { initiatePayment } from '../utils/razorpay';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentConfigured, setPaymentConfigured] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!cart.length || !user) {
      navigate('/cart');
    }
  }, [cart.length, user, navigate]);

  useEffect(() => {
    ordersAPI.getPaymentConfig()
      .then(({ data }) => setPaymentConfigured(Boolean(data.configured)))
      .catch(() => setPaymentConfigured(false));
  }, []);

  const handleCheckout = async () => {
    if (!cart.length) return;

    setLoading(true);
    setPaymentError('');
    try {
      const orderData = {
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

      const res = await ordersAPI.createOrder(orderData);
      const paymentKey = res.data.keyId;
      if (!paymentKey) {
        throw new Error('Razorpay key is missing');
      }
      const paymentResponse = await initiatePayment(paymentKey, res.data, user);
      await ordersAPI.verifyPayment(res.data.id, {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      });
      clearCart();
      setCompletedPaymentMethod('razorpay');
      setPaymentSuccess(true);
      showToast('Payment successful. Your order has been placed.');
    } catch (error) {
      console.error('Payment failed', error);
      const message = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      setPaymentError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
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
    <div className="py-8 px-4 sm:py-12">
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
                onChange={() => setPaymentMethod('razorpay')}
                className="mr-3"
              />
              <span className="font-semibold text-slate-900">Pay Online with Razorpay</span>
            </label>
          </div>
          {paymentMethod === 'razorpay' && paymentConfigured === false && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Razorpay test keys are not configured. Add them to <code>backend/.env</code> and restart the backend.
            </div>
          )}
          {paymentError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {paymentError}
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={loading || (paymentMethod === 'razorpay' && paymentConfigured !== true)}
            className="w-full bg-emerald-600 text-white py-4 px-8 rounded-xl hover:bg-emerald-700 font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {paymentMethod === 'razorpay' && paymentConfigured === null ? (
              'Checking payment...'
            ) : loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
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
    </div>
  );
};
export default Checkout;
