import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Truck, ShoppingBag, KeyRound, MapPin, Calendar } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-xl w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-apricot/30 border border-terracotta/30 text-terracotta shadow-sm">
          <CheckCircle2 size={40} />
        </div>

        <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-terracotta">
          Confirmed & Allocated
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight mt-2">
          Thank you for your order
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-warmStone max-w-md mx-auto leading-relaxed">
          Your harvest crate has been allocated under strict FEFO cold-chain governance and routed for express fulfillment.
        </p>

        {order && (
          <div className="mt-8 bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8 text-left">
            <div className="flex items-center justify-between border-b border-sandstone pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warmStone">Order Reference</span>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-semibold mt-0.5">{order.orderNumber || 'GS-Order'}</p>
              </div>
              {order.deliveryOtp && (
                <div className="text-right bg-porcelain border border-terracotta/30 px-3 py-1.5 rounded-lg">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta flex items-center justify-end gap-1">
                    <KeyRound size={11} /> PIN
                  </span>
                  <p className="font-mono text-xl font-bold tracking-widest text-espresso">{order.deliveryOtp}</p>
                </div>
              )}
            </div>

            <div className="my-5 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-porcelain rounded-xl border border-sandstone/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warmStone block mb-1">Delivery Slot</span>
                <p className="font-medium text-espresso">{order.deliverySlot || 'Standard Cold Chain'}</p>
              </div>
              <div className="p-3 bg-porcelain rounded-xl border border-sandstone/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warmStone block mb-1">Payment Method</span>
                <p className="font-medium text-espresso uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Secure'}</p>
              </div>
            </div>

            <div className="border-t border-sandstone pt-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-warmStone block mb-1">Delivery Destination</span>
              <p className="font-medium text-xs text-espresso">
                {order.deliveryAddress?.name}, {order.deliveryAddress?.address || order.deliveryAddress?.street}, {order.deliveryAddress?.city} &ndash; {order.deliveryAddress?.pincode}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {order?.orderNumber && (
            <Link
              to={`/track/${order.orderNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
            >
              <Truck size={15} />
              <span>Track Live Dispatch</span>
            </Link>
          )}
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-ivory border border-sandstone hover:border-terracotta text-espresso text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            <ShoppingBag size={15} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
