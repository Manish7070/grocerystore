import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Truck, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-xl shadow-emerald-950/10 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 size={44} />
      </div>

      <span className="mt-6 inline-block text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        Booking Confirmed
      </span>
      <h1 className="mt-2 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
        Order Placed Successfully!
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Your harvest-fresh basket has been scheduled for packaging and express dispatch.
      </p>

      {order && (
        <div className="mt-8 rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 text-left shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Order Reference</span>
              <p className="text-xl font-black text-stone-900 dark:text-white">{order.orderNumber || 'TD-Order'}</p>
            </div>
            {order.deliveryOtp && (
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Delivery OTP</span>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{order.deliveryOtp}</p>
              </div>
            )}
          </div>

          <div className="my-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold text-stone-400">Delivery Slot</span>
              <p className="font-bold text-stone-800 dark:text-stone-200">{order.deliverySlot || 'Express (30-45 mins)'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-stone-400">Payment Mode</span>
              <p className="font-bold text-stone-800 dark:text-stone-200 uppercase">{order.paymentMethod || 'COD'}</p>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 dark:border-white/5">
            <span className="text-xs font-bold text-stone-400">Deliver To</span>
            <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5">
              {order.deliveryAddress?.name}, {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        {order?.orderNumber && (
          <Link
            to={`/track/${order.orderNumber}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#075F46] px-8 py-3.5 font-black text-white shadow-lg transition hover:bg-[#064D3A]"
          >
            <Truck size={18} />
            Track Order Live
          </Link>
        )}
        <Link
          to="/shop"
          className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-8 py-3.5 font-bold text-stone-800 shadow-sm hover:bg-stone-50 dark:bg-stone-900 dark:border-white/10 dark:text-white"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
