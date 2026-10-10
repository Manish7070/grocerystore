import { Link } from 'react-router-dom';
import { Heart, Plus, ShoppingCart, Star } from 'lucide-react';
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
  const saved = isInWatchlist(product._id);

  const handleAddToCart = (quantity) => {
    addItem(product, quantity);
    setQuantityOpen(false);
    showToast(`${quantity} x ${product.name} added to cart`);
  };

  const handleWatchlist = () => {
    toggleWatchlist(product);
    showToast(saved ? `${product.name} removed from watchlist` : `${product.name} added to watchlist`, saved ? 'info' : 'success');
  };

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-emerald-900/10 bg-white shadow-[0_18px_50px_rgba(38,58,34,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-[0_26px_70px_rgba(38,58,34,0.13)]">
        <div className="relative m-3 overflow-hidden rounded-[1.35rem] bg-[#eef6e8]">
          <Link to={`/product/${product._id}`}>
            <ProductArtwork
              product={product}
              className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-60"
            />
          </Link>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-950/35 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.discount > 0 && (
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-lg shadow-orange-950/20">{product.discount}% off</span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-emerald-800 shadow-sm backdrop-blur">{product.category}</span>
          </div>
          <button
            type="button"
            onClick={handleWatchlist}
            className={`absolute right-3 top-3 rounded-full p-2.5 shadow-sm backdrop-blur transition-all hover:scale-105 ${saved ? 'bg-red-50 text-red-600' : 'bg-white/90 text-stone-600 hover:text-red-600'}`}
            aria-label="Toggle watchlist"
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-5 pt-2">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/product/${product._id}`} className="line-clamp-1 block text-lg font-black tracking-tight text-stone-950 transition hover:text-emerald-800">{product.name}</Link>
              <p className="mt-1 text-sm font-semibold text-stone-500">{product.unit || product.brand || 'Fresh pack'}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
              <Star size={13} fill="currentColor" />
              {product.rating || 4.5}
            </span>
          </div>

          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">
            {product.description || 'Freshly packed grocery essential for your daily basket.'}
          </p>

          <div className="mt-auto pt-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-400">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">₹{product.price}</span>
                  {product.discount > 0 && (
                    <span className="text-xs font-semibold text-stone-400 line-through">
                      ₹{Math.round(product.price * (1 + product.discount / 100))}
                    </span>
                  )}
                </div>
              </div>
              <p className={`rounded-full px-2.5 py-0.5 text-xs font-black ${(product.stock ?? 1) > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-600'}`}>
                {(product.stock ?? 1) > 0 ? (product.stock == null ? 'In stock' : `${product.stock} in stock`) : 'Out of stock'}
              </p>
            </div>
            <button
              onClick={() => setQuantityOpen(true)}
              disabled={(product.stock ?? 1) <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075F46] px-4 py-3 font-black text-white shadow-md shadow-emerald-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#064D3A] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
            >
              <ShoppingCart size={17} />
              {(product.stock ?? 1) > 0 ? 'Add to Cart' : 'Unavailable'}
              <Plus size={15} />
            </button>
          </div>
        </div>
      </div>
      <QuantityModal product={product} open={quantityOpen} onClose={() => setQuantityOpen(false)} onConfirm={handleAddToCart} />
    </>
  );
};

export default ProductCard;
