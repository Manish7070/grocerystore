import { Link } from 'react-router-dom';
import { Heart, Plus, ShoppingBag, Star, Check } from 'lucide-react';
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

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sandstoneBorder bg-surface shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-copper/40 hover:shadow-card dark:bg-charcoal dark:border-white/10 dark:hover:border-ochre/40">
        {/* Product Image Frame */}
        <div className="relative overflow-hidden bg-oat/30 dark:bg-forest/50 aspect-[4/3] sm:aspect-square">
          <Link to={`/product/${product._id}`} tabIndex={-1}>
            <ProductArtwork
              product={product}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pointer-events-none">
            {product.discount > 0 && (
              <span className="rounded-lg bg-copper px-2.5 py-1 text-[11px] font-bold text-surface shadow-sm uppercase tracking-wider">
                {product.discount}% OFF
              </span>
            )}
            <span className="rounded-lg bg-surface/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-forest shadow-sm dark:bg-forest/90 dark:text-surface">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWatchlist}
            className={`absolute right-3 top-3 rounded-full p-2.5 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95 ${
              saved
                ? 'bg-surface text-copper dark:bg-forest dark:text-ochre'
                : 'bg-surface/90 text-mutedStone hover:text-copper dark:bg-forest/90 dark:text-surface/80 dark:hover:text-ochre'
            }`}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Product Information Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Title and Rating Row */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${product._id}`}
                className="line-clamp-1 font-serif text-base sm:text-[17px] font-semibold text-forest transition-colors hover:text-copper dark:text-surface dark:hover:text-ochre"
              >
                {product.name}
              </Link>
              <p className="mt-0.5 text-xs text-mutedStone font-medium dark:text-surface/65">
                {product.unit || product.brand || 'Standard Harvest Pack'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-md bg-oat/70 px-2 py-0.5 text-xs font-bold text-forest dark:bg-forest dark:text-ochre">
              <Star size={12} className="fill-current text-ochre" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-mutedStone mb-4 dark:text-surface/65">
            {product.description || 'Carefully graded daily harvest essential, preserved in cold-chain conditions.'}
          </p>

          {/* Price & Action Section */}
          <div className="mt-auto pt-3 border-t border-sandstoneBorder/60 dark:border-white/5">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-mutedStone block dark:text-surface/50">Market Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-forest dark:text-surface">
                    ₹{product.price}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xs text-mutedStone line-through font-mono dark:text-surface/50">
                      ₹{Math.round(product.price * (1 + product.discount / 100))}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock status indicator */}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  isOutOfStock
                    ? 'bg-red-50 text-errorRed border border-red-200 dark:bg-red-950/40 dark:border-red-900'
                    : 'bg-oat text-forest border border-sandstoneBorder dark:bg-forest dark:text-ochre dark:border-white/10'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : 'Available'}
              </span>
            </div>

            {/* Primary Action Button — Burnt Copper with micro-interaction */}
            <button
              type="button"
              onClick={() => setQuantityOpen(true)}
              disabled={isOutOfStock}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-[0.98] ${
                addedAnimation
                  ? 'bg-forest text-surface'
                  : 'bg-copper text-surface hover:bg-[#B05932] disabled:cursor-not-allowed disabled:bg-sandstoneBorder disabled:text-mutedStone'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={15} />
                  <span>Crated</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Basket'}</span>
                  {!isOutOfStock && <Plus size={14} />}
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
