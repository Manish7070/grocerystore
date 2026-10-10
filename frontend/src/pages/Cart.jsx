import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ArrowRight, ShoppingCart, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();

  const handleClearCart = () => {
    clearCart();
    showToast('Your basket has been cleared', 'info');
  };

  const freeDeliveryThreshold = 499;
  const deliveryFee = total >= freeDeliveryThreshold ? 0 : 49;
  const freeDeliveryProgress = Math.min(100, (total / freeDeliveryThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-porcelain px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-sandstone bg-ivory p-8 sm:p-12 text-center shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sandstone/30 text-terracotta dark:bg-white/10 dark:text-apricot">
            <ShoppingCart size={32} />
          </span>
          <h2 className="font-serif text-2xl font-normal text-espresso sm:text-3xl dark:text-ivory">
            Your basket is waiting
          </h2>
          <p className="mt-2 text-xs text-warmStone max-w-sm mx-auto dark:text-ivory/60">
            Explore daily harvested vegetables, orchard fruits, stone-milled grains, and 1-click recipe kits.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory shadow-subtle hover:bg-[#9C432A] transition"
            >
              Start Grocery Shopping
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-sandstone pb-6 flex items-baseline justify-between dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Checkout Preparation</p>
            <h1 className="mt-1 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
              Your Grocery Basket
            </h1>
          </div>
          <button
            type="button"
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-warmStone hover:text-errorRed transition"
          >
            <Trash2 size={13} />
            Clear Basket
          </button>
        </div>

        {/* 65% Items / 35% Summary Split */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart Items Table */}
          <div className="rounded-2xl border border-sandstone bg-ivory shadow-subtle overflow-hidden dark:bg-[#1D151A] dark:border-white/10">
            <div className="border-b border-sandstone bg-porcelain px-6 py-4 dark:bg-[#251D21] dark:border-white/10">
              <h2 className="font-serif text-sm font-semibold text-espresso dark:text-ivory">
                Selected Provisions ({cart.length} items)
              </h2>
            </div>
            <div>
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          {/* Sticky Summary Rail */}
          <aside className="h-fit space-y-6">
            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              {/* Free Delivery Meter */}
              <div className="mb-6 rounded-xl border border-sandstone/70 bg-porcelain p-4 dark:bg-[#251D21] dark:border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-espresso dark:text-ivory flex items-center gap-1.5">
                    <Truck size={14} className="text-terracotta" />
                    {total >= freeDeliveryThreshold ? 'Free Delivery Unlocked!' : `Add ₹${freeDeliveryThreshold - total} for Free Delivery`}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-sandstone">
                  <div
                    className="h-full bg-terracotta transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>

              <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs border-b border-sandstone pb-4 dark:border-white/10">
                <div className="flex justify-between text-warmStone dark:text-ivory/70">
                  <span>Subtotal</span>
                  <span className="font-serif font-bold text-espresso dark:text-ivory">₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-warmStone dark:text-ivory/70">
                  <span>Dispatch & Packaging</span>
                  <span className="font-serif font-bold text-espresso dark:text-ivory">
                    {deliveryFee === 0 ? <span className="text-successGreen">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-warmStone dark:text-ivory/70">
                  <span>Cold-Chain Handling</span>
                  <span className="text-successGreen font-bold">Included</span>
                </div>
              </div>

              <div className="pt-4 mb-6 flex justify-between items-baseline">
                <span className="font-serif text-sm font-semibold text-espresso dark:text-ivory">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-espresso dark:text-ivory">
                  ₹{(total + deliveryFee).toFixed(0)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition shadow-subtle"
              >
                Proceed to Delivery Details
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="rounded-xl border border-sandstone bg-porcelain p-4 text-xs text-warmStone space-y-2 dark:bg-[#1D151A] dark:border-white/10 dark:text-ivory/60">
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-terracotta shrink-0" />
                Verified Razorpay Gateway & Cash on Delivery
              </p>
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-terracotta shrink-0" />
                Doorstep Handover with 4-Digit Security PIN
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
