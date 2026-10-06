import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductArtwork from './ProductArtwork';

const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCart();
  const { showToast } = useToast();

  const updateQuantity = (delta) => {
    const maxQty = Math.max(1, Math.min(Number(item.stock) || 20, 20));
    const newQty = Math.max(1, Math.min(maxQty, item.quantity + delta));
    updateQty(item._id, newQty);
  };

  const handleRemove = () => {
    removeItem(item._id);
    showToast(`${item.name} removed from cart`, 'info');
  };

  return (
    <div className="flex flex-col gap-4 border-b border-emerald-900/10 p-4 last:border-b-0 sm:flex-row sm:items-center sm:p-5">
      <ProductArtwork product={item} className="h-28 w-full rounded-2xl shadow-sm sm:h-24 sm:w-24" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-black text-stone-950">{item.name}</h3>
        <p className="mt-1 text-sm font-semibold text-stone-500">{item.unit || item.category || 'Fresh pack'}</p>
        <p className="mt-2 text-xl font-black text-emerald-800">₹{item.price}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center rounded-full border border-emerald-900/10 bg-stone-50 p-1">
          <button onClick={() => updateQuantity(-1)} className="rounded-full bg-white p-2 shadow-sm transition hover:bg-emerald-50">
            <Minus size={16} />
          </button>
          <span className="min-w-[2.5rem] text-center text-lg font-black">{item.quantity}</span>
          <button disabled={item.quantity >= Math.max(1, Math.min(Number(item.stock) || 20, 20))} onClick={() => updateQuantity(1)} className="rounded-full bg-white p-2 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40">
            <Plus size={16} />
          </button>
        </div>
        <span className="min-w-20 text-right font-black text-stone-950">₹{(item.price * item.quantity).toFixed(0)}</span>
        <button onClick={handleRemove} className="rounded-full p-2 text-red-500 transition hover:bg-red-50">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
