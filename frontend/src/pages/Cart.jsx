import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared', 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-900/10 bg-white p-8 text-center shadow-2xl shadow-emerald-950/10 sm:p-12">
          <span className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-700">
            <ShoppingCart size={54} />
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-stone-950">Your cart is empty</h2>
          <p className="mb-8 text-lg font-semibold text-stone-500">Add some fresh groceries to get started.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-lg font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-1 hover:bg-emerald-800"
          >
            Continue Shopping
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Your basket</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">Shopping cart</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-[0_18px_50px_rgba(38,58,34,0.07)]">
            <div className="border-b border-emerald-900/10 bg-emerald-50/60 p-5 sm:p-6">
              <h2 className="text-xl font-black text-stone-950">Your Items ({cart.length})</h2>
              <p className="mt-1 text-sm font-semibold text-stone-500">Review quantities before checkout.</p>
            </div>
            <div>
              {cart.map(item => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-[0_18px_50px_rgba(38,58,34,0.07)] sm:p-6 dark:bg-[#14231a] dark:border-white/10">
            {/* Free Delivery Meter */}
            <div className="mb-5 rounded-2xl bg-emerald-50 p-4 border border-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-900 dark:text-emerald-200">
                  {total >= 499 ? '🎉 Free Delivery Unlocked!' : `Add ₹${Math.max(499 - total, 0).toFixed(0)} more for FREE Delivery`}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black">{Math.min(Math.round((total / 499) * 100), 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-emerald-200/60 dark:bg-emerald-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${Math.min((total / 499) * 100, 100)}%` }}
                />
              </div>
            </div>

            <h2 className="text-xl font-black text-stone-900 dark:text-white">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-stone-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-950">₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-700">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging</span>
                <span className="text-stone-950">₹0</span>
              </div>
            </div>
            <div className="my-5 border-t border-emerald-900/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-stone-950">Total</span>
                <span className="text-3xl font-black text-emerald-800">₹{total.toFixed(0)}</span>
              </div>
            </div>
            {user ? (
              <button
                onClick={() => navigate('/checkout')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-8 py-4 text-lg font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-1 hover:bg-emerald-800"
              >
                Proceed to Checkout
                <ArrowRight size={19} />
              </button>
            ) : (
              <Link
                to="/signin"
                state={{ from: '/checkout' }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-8 py-4 text-lg font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-1 hover:bg-emerald-800"
              >
                Login to Checkout
                <ArrowRight size={19} />
              </Link>
            )}
            <button
              onClick={handleClearCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 px-5 py-3 font-black text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
