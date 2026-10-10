import { useState, useEffect } from 'react';
import { Clock, Users, ShoppingBag, Sparkles, Check, ChefHat } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductLiveImage } from '../utils/remoteProductImages';

const RECIPE_EDITORIAL_PHOTOS = {
  'Creamy Tuscan Garlic Pasta': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281228?auto=format&fit=crop&w=900&q=80',
  'Sunday Sourdough French Toast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80',
  'Organic Supergreen Detox Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
  'Classic Shakshuka with Feta': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=80',
  'Wild Forest Mushroom Risotto': 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=900&q=80',
};

const RecipeBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    productsAPI.getBundles()
      .then((res) => {
        setBundles(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAddBundle = (bundle) => {
    bundle.items.forEach((item) => {
      addItem(item, 1);
    });
    showToast(`Added all ${bundle.items.length} recipe ingredients for "${bundle.title}" to cart!`);
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-apricot/30 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta uppercase tracking-wider mb-4">
            <ChefHat size={14} />
            <span>Culinary Discovery Studio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso font-semibold tracking-tight">
            One-Click Recipe Kits
          </h1>
          <p className="mt-4 text-warmStone text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Eliminate meal-planning friction. Every ingredient measured in pristine condition, sourced straight from our cold-chain market and bundled into your cart in a single click.
          </p>
        </div>
      </section>

      {/* Main Kits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[520px] rounded-2xl bg-ivory border border-sandstone animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => {
              const bundleTotal = bundle.items.reduce((sum, item) => sum + (item.price || 0), 0);
              const heroImg = RECIPE_EDITORIAL_PHOTOS[bundle.title] ||
                bundle.items?.[0]?.image ||
                'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80';

              return (
                <div
                  key={bundle.id}
                  className="bg-ivory rounded-2xl border border-sandstone overflow-hidden shadow-[0_2px_12px_rgba(39,34,31,0.04)] hover:shadow-[0_8px_24px_rgba(39,34,31,0.08)] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Kit Photo */}
                    <div className="relative h-56 w-full overflow-hidden bg-sandstone/30">
                      <img
                        src={heroImg}
                        alt={bundle.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 bg-ivory/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-espresso flex items-center gap-1 shadow-sm border border-sandstone/60">
                          <Clock size={12} className="text-terracotta" />
                          {bundle.timeToCook}
                        </span>
                        <span className="px-2.5 py-1 bg-ivory/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-espresso flex items-center gap-1 shadow-sm border border-sandstone/60">
                          <Users size={12} className="text-terracotta" />
                          {bundle.servings}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-espresso font-semibold mb-2">
                        {bundle.title}
                      </h3>
                      <p className="text-xs text-warmStone leading-relaxed mb-4">
                        {bundle.subtitle}
                      </p>

                      {/* Chef's Secret Note */}
                      <div className="p-3.5 bg-porcelain border border-sandstone rounded-xl mb-6">
                        <div className="flex items-center gap-1.5 text-terracotta mb-1">
                          <Sparkles size={14} />
                          <span className="text-xs font-semibold uppercase tracking-wider">Chef&apos;s Pro Tip</span>
                        </div>
                        <p className="text-xs text-espresso/90 italic leading-snug">
                          &ldquo;{bundle.chefTip}&rdquo;
                        </p>
                      </div>

                      {/* Ingredients Included */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-espresso uppercase tracking-wider">
                            Market Ingredients Included
                          </span>
                          <span className="text-xs text-warmStone">{bundle.items.length} items</span>
                        </div>
                        <div className="space-y-1.5">
                          {bundle.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-porcelain/60 text-xs text-espresso border border-sandstone/40"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </div>
                              <span className="font-semibold text-espresso shrink-0 ml-2">₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="p-6 pt-4 border-t border-sandstone bg-ivory mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs text-warmStone uppercase tracking-wider">Bundle Total</span>
                      <div className="text-right">
                        <span className="font-serif text-2xl text-espresso font-semibold">₹{bundleTotal}</span>
                        <span className="block text-[11px] text-warmStone">Includes all measured portions</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddBundle(bundle)}
                      className="w-full bg-terracotta text-ivory py-3.5 px-4 rounded-xl hover:bg-terracotta/90 transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag size={16} />
                      <span>Add Complete Recipe Kit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBundles;
