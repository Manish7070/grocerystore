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
      className="fixed inset-0 z-[90] flex items-end justify-center bg-espresso/60 px-4 py-4 backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quantity-title"
        className="w-full max-w-md rounded-2xl border border-sandstone bg-ivory p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <ProductArtwork product={product} className="h-16 w-16 shrink-0 rounded-xl border border-sandstone" />
            <div className="min-w-0">
              <h3 id="quantity-title" className="truncate font-serif text-lg font-semibold text-espresso">{product.name}</h3>
              <p className="text-xs text-warmStone">{product.unit || product.category}</p>
              <p className="mt-1 font-serif text-base font-semibold text-espresso">₹{product.price}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close quantity picker"
            className="rounded-lg p-1.5 text-warmStone hover:bg-porcelain hover:text-espresso transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl bg-porcelain border border-sandstone p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-warmStone">Specify Portion Quantity</p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
              className="rounded-lg border border-sandstone bg-ivory p-2.5 text-espresso shadow-sm hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <Minus size={16} />
            </button>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-espresso">{quantity}</p>
              <p className="text-[11px] text-warmStone">Max {maxQty} units</p>
            </div>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQty}
              onClick={() => setQuantity((qty) => Math.min(maxQty, qty + 1))}
              className="rounded-lg border border-sandstone bg-ivory p-2.5 text-espresso shadow-sm hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-warmStone">Portion Subtotal</span>
          <span className="font-serif text-2xl font-semibold text-espresso">₹{subtotal.toFixed(0)}</span>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ivory shadow-sm transition hover:bg-terracotta/90"
        >
          <ShoppingBag size={16} />
          <span>Add {quantity} {quantity === 1 ? 'Unit' : 'Units'} to Basket</span>
        </button>
      </div>
    </div>
  );
};

export default QuantityModal;
