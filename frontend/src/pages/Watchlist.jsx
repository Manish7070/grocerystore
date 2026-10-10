import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();
  const { showToast } = useToast();

  const handleClear = () => {
    clearWatchlist();
    showToast('Saved list cleared');
  };

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="max-w-md w-full bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-porcelain border border-sandstone flex items-center justify-center text-warmStone/60 mb-4">
            <Heart size={28} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-semibold mb-2">Your wishlist is empty</h1>
          <p className="text-xs sm:text-sm text-warmStone mb-6 leading-relaxed">
            Save seasonal produce, artisan staples, and household favorites to quickly assemble your basket anytime.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
          >
            <span>Explore Market Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">Curated Favorites</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight mt-1">
              Your Wishlist
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-warmStone">
              {watchlist.length} saved {watchlist.length === 1 ? 'essential' : 'essentials'} curated for your household pantry.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto px-4 py-2 border border-sandstone bg-porcelain text-xs font-medium text-warmStone hover:text-espresso rounded-xl transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
