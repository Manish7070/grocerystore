import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
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
    <div
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 px-4 py-4 backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quantity-title"
        className="w-full max-w-md rounded-2xl border border-[#D5E5DE] bg-white p-6 shadow-2xl dark:bg-[#16191F] dark:border-white/10"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <ProductArtwork product={product} className="h-16 w-16 shrink-0 rounded-xl border border-[#D5E5DE] dark:border-white/10" />
            <div className="min-w-0">
              <h3 id="quantity-title" className="truncate font-serif text-lg font-semibold text-[#192D2A] dark:text-white">{product.name}</h3>
              <p className="text-xs text-[#625F59] dark:text-[#94A3B8]">{product.unit || product.category}</p>
              <p className="mt-1 font-serif text-base font-semibold text-[#17745A] dark:text-[#10B981]">₹{product.price}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close quantity picker"
            className="rounded-lg p-1.5 text-[#625F59] hover:bg-[#F4F8F6] hover:text-[#192D2A] transition-colors dark:text-[#94A3B8] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl bg-[#F4F8F6] border border-[#D5E5DE] p-4 dark:bg-[#1F242C] dark:border-white/10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#17745A] dark:text-[#10B981]">Specify Portion Quantity</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
              className="rounded-lg border border-[#D5E5DE] bg-white p-2.5 text-[#192D2A] shadow-sm hover:border-[#17745A] hover:text-[#17745A] disabled:cursor-not-allowed disabled:opacity-30 transition-colors dark:bg-[#282E38] dark:text-white dark:border-white/10"
            >
              <Minus size={16} />
            </button>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-[#192D2A] dark:text-white">{quantity}</p>
              <p className="text-[11px] text-[#625F59] dark:text-[#94A3B8]">Max {maxQty} units</p>
            </div>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQty}
              onClick={() => setQuantity((qty) => Math.min(maxQty, qty + 1))}
              className="rounded-lg border border-[#D5E5DE] bg-white p-2.5 text-[#192D2A] shadow-sm hover:border-[#17745A] hover:text-[#17745A] disabled:cursor-not-allowed disabled:opacity-30 transition-colors dark:bg-[#282E38] dark:text-white dark:border-white/10"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-[#625F59] dark:text-[#94A3B8]">Portion Subtotal</span>
          <span className="font-serif text-2xl font-bold text-[#17745A] dark:text-[#10B981]">₹{subtotal.toFixed(0)}</span>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17745A] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#135E49] active:scale-[0.98]"
        >
          <ShoppingBag size={16} />
          <span>Add {quantity} Unit{quantity > 1 ? 's' : ''} to Basket</span>
        </button>
      </div>
    </div>
  );
};

export default QuantityModal;
