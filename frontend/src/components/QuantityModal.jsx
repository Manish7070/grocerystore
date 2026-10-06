import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductArtwork from './ProductArtwork';

const QuantityModal = ({ product, open, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !product) return null;

  const maxQty = Math.max(1, Math.min(product.stock || 20, 20));
  const subtotal = product.price * quantity;

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  return (
    <div onMouseDown={(event) => event.target === event.currentTarget && handleClose()} className="fixed inset-0 z-[90] flex items-end justify-center bg-stone-950/55 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="quantity-title" className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[#fbfdf9] p-5 shadow-2xl shadow-stone-950/25 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <ProductArtwork product={product} className="h-16 w-16 shrink-0 rounded-2xl shadow-sm" />
            <div className="min-w-0">
              <h3 id="quantity-title" className="truncate text-lg font-black text-stone-950">{product.name}</h3>
              <p className="text-sm font-semibold text-stone-500">{product.unit || product.category}</p>
              <p className="mt-1 font-black text-emerald-800">₹{product.price}</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close quantity picker" className="rounded-full p-2 text-stone-500 hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>

        <div className="rounded-[1.5rem] bg-emerald-50/70 p-4">
          <p className="mb-3 text-sm font-black text-stone-800">Choose quantity</p>
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((qty) => Math.max(1, qty - 1))} className="rounded-full border border-emerald-900/10 bg-white p-3 text-stone-700 shadow-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Minus size={18} />
            </button>
            <div className="text-center">
              <p className="text-4xl font-black text-stone-950">{quantity}</p>
              <p className="text-xs font-semibold text-stone-500">Max {maxQty}</p>
            </div>
            <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQty} onClick={() => setQuantity((qty) => Math.min(maxQty, qty + 1))} className="rounded-full border border-emerald-900/10 bg-white p-3 text-stone-700 shadow-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-semibold text-stone-500">Subtotal</span>
          <span className="text-2xl font-black text-stone-950">₹{subtotal.toFixed(0)}</span>
        </div>

        <button type="button" onClick={handleConfirm} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-4 font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800">
          <ShoppingCart size={19} />
          Add {quantity} to Cart
        </button>
      </div>
    </div>
  );
};

export default QuantityModal;
