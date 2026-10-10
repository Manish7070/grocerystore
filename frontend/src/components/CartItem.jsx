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
    showToast(`Removed ${item.name} from basket`, 'info');
  };

  return (
    <div className="flex flex-col gap-4 border-b border-sandstone p-4 last:border-b-0 sm:flex-row sm:items-center sm:p-5 dark:border-white/10">
      <ProductArtwork product={item} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-base font-semibold text-espresso dark:text-ivory">{item.name}</h3>
        <p className="mt-0.5 text-xs text-warmStone dark:text-ivory/60">{item.unit || item.category || 'Provisions'}</p>
        <p className="mt-1 font-serif text-sm font-bold text-terracotta dark:text-apricot">₹{item.price}</p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-xl border border-sandstone bg-porcelain px-1 dark:bg-[#251D21] dark:border-white/10">
          <button
            type="button"
            onClick={() => updateQuantity(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-sandstone/30 text-espresso transition dark:text-ivory"
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="min-w-[2rem] text-center text-xs font-bold font-sans text-espresso dark:text-ivory">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={item.quantity >= Math.max(1, Math.min(Number(item.stock) || 20, 20))}
            onClick={() => updateQuantity(1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-sandstone/30 text-espresso transition disabled:opacity-40 dark:text-ivory"
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>

        <span className="min-w-16 text-right font-serif text-sm font-bold text-espresso dark:text-ivory">
          ₹{(item.price * item.quantity).toFixed(0)}
        </span>

        <button
          type="button"
          onClick={handleRemove}
          className="rounded-lg p-1.5 text-warmStone hover:bg-errorRed/10 hover:text-errorRed transition"
          aria-label="Remove from basket"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
