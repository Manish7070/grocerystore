import { Link } from 'react-router-dom';
import { Heart, Plus, ShoppingBag, Star, Check, Sparkles, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWatchlist } from '../context/WatchlistContext';
import QuantityModal from './QuantityModal';
import ProductArtwork from './ProductArtwork';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const saved = isInWatchlist(product._id);

  const handleAddToCart = (quantity) => {
    addItem(product, quantity);
    setQuantityOpen(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
    showToast(`${quantity} x ${product.name} added to basket`);
  };

  const handleWatchlist = () => {
    toggleWatchlist(product);
    showToast(
      saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
      saved ? 'info' : 'success'
    );
  };

  const isOutOfStock = (product.stock ?? 1) <= 0;
  const isKisanHarvest = product.addedBy?.role === 'kisan' || product.farmSource;

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5DFD5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#10B981]/50 hover:shadow-xl dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F] dark:hover:border-[#55D6A0]/60">
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#F3EFE6] dark:bg-[#10221B]">
          <Link to={`/product/${product._id}`} className="block h-full w-full" tabIndex={-1}>
            <ProductArtwork
              product={product}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay - Small, clean & attractive (no cluttered generic stacked tags) */}
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 pointer-events-none">
            {product.discount > 0 && (
              <span className="rounded-md bg-amber-500/95 dark:bg-[#E6BC70] dark:text-[#0B1714] backdrop-blur-md px-2 py-0.5 text-[10px] font-black shadow-sm uppercase tracking-wider">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWatchlist}
            className={`absolute right-2.5 top-2.5 rounded-full p-2 shadow-sm backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
              saved
                ? 'bg-rose-500 text-white'
                : 'bg-white/85 text-[#736F69] hover:text-rose-500 dark:bg-[#0B1714]/85 dark:text-[#CBD5E1] dark:hover:text-rose-400 dark:border dark:border-[#30483C]'
            }`}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Product Information Body */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title and Rating Row */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${product._id}`}
                className="line-clamp-1 font-serif text-base font-bold text-[#192D2A] transition-colors hover:text-[#17745A] dark:text-[#F3F0E6] dark:hover:text-[#55D6A0] capitalize"
              >
                {product.name}
              </Link>
              <p className="mt-0.5 text-xs font-medium text-[#7A746E] dark:text-[#B6C7BD] capitalize">
                {product.unit || 'Standard Pack'} {product.origin ? `• ${product.origin}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-md bg-[#F4EFE6] px-1.5 py-0.5 text-[11px] font-bold text-[#192D2A] dark:bg-[#20392F] dark:text-[#E6BC70]">
              <Star size={11} className="fill-current text-amber-400 dark:text-[#E6BC70]" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6E6862] mb-3 dark:text-[#B6C7BD]">
            {product.description || 'Verified fresh stock direct from partner dispatch.'}
          </p>

          {/* Price & Action Section */}
          <div className="mt-auto pt-2.5 border-t border-[#EDE7DD] dark:border-[#30483C]">
            <div className="mb-2.5 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-[#55D6A0] block">
                  Farm Direct Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-black text-[#192D2A] dark:text-[#F3F0E6]">
                    ₹{product.price}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-[#9B958D] line-through font-mono dark:text-[#B6C7BD]/70">
                      ₹{product.mrp}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock status indicator */}
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isOutOfStock
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#20392F] dark:border-[#30483C] dark:text-[#55D6A0]'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : 'In Stock'}
              </span>
            </div>

            {/* Primary Action Button with Motion */}
            <button
              type="button"
              onClick={() => setQuantityOpen(true)}
              disabled={isOutOfStock}
              className={`btn-motion flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-[0.98] ${
                addedAnimation
                  ? 'bg-emerald-700 text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'bg-[#17745A] text-white hover:bg-[#135E49] disabled:cursor-not-allowed disabled:bg-[#DDD5C8] disabled:text-[#8C847A] dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E] dark:hover:shadow-[0_4px_16px_rgba(85,214,160,0.3)]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={14} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>{isOutOfStock ? 'Unavailable' : 'Add to Basket'}</span>
                  {!isOutOfStock && <Plus size={13} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <QuantityModal
        product={product}
        open={quantityOpen}
        onClose={() => setQuantityOpen(false)}
        onConfirm={handleAddToCart}
      />
    </>
  );
};

export default ProductCard;
