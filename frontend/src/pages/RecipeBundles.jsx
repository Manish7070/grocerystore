import { useState, useEffect } from 'react';
import { Clock, Users, ShoppingBag, Sparkles, Check, ChefHat } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductLiveImage } from '../utils/remoteProductImages';

const RECIPE_EDITORIAL_PHOTOS = {
  'Desi Palak Paneer Kit': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
  'Royal Dum Biryani Essentials': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  'Morning Energy & Smoothie Kit': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80',
};

const RecipeBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      productsAPI.getBundles(),
      productsAPI.getAll(),
    ])
      .then(([bundlesRes, productsRes]) => {
        setBundles(bundlesRes.data || []);
        setAllProducts(productsRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAddBundle = (bundle) => {
    let addedCount = 0;
    bundle.items.forEach((item) => {
      // Ensure product has a valid catalog _id so checkout succeeds
      let itemToAdd = item;
      if (!itemToAdd._id && allProducts.length) {
        const found = allProducts.find(
          (p) => p.name.toLowerCase() === item.name.toLowerCase() ||
                 p.name.toLowerCase().includes(item.name.toLowerCase())
        );
        if (found) {
          itemToAdd = { ...found, quantity: 1 };
        }
      }
      addItem(itemToAdd, 1);
      addedCount++;
    });
    showToast(`Added all ${addedCount} ingredients for "${bundle.title}" to basket!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] pb-24 text-[#192D2A] dark:text-[#F8F3EA]">
      {/* Editorial Header Banner with Visual Background Image */}
      <section className="relative overflow-hidden border-b border-[#DDD5C8]/80 bg-[#192D2A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80"
            alt="Culinary kitchen prep"
            className="h-full w-full object-cover opacity-25 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#192D2A] via-[#192D2A]/90 to-[#192D2A]/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-[#D9A441] uppercase tracking-wider mb-4 backdrop-blur-sm">
            <ChefHat size={14} />
            <span>Culinary Discovery Studio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-semibold tracking-tight">
            One-Click Recipe Kits
          </h1>
          <p className="mt-4 text-[#F4EFE6] text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Eliminate meal-planning friction. Every ingredient measured in pristine condition, sourced straight from our cold-chain market and bundled into your cart in a single click.
          </p>
        </div>
      </section>

      {/* Main Kits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[560px] rounded-2xl bg-white border border-[#DDD5C8] animate-pulse dark:bg-[#162522]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => {
              const bundleTotal = bundle.items.reduce((sum, item) => sum + (item.price || 0), 0);
              const heroImg = RECIPE_EDITORIAL_PHOTOS[bundle.title] ||
                'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80';

              return (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl border border-[#DDD5C8] overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between dark:bg-[#162522] dark:border-white/10"
                >
                  <div>
                    {/* Kit Photo */}
                    <div className="relative h-60 w-full overflow-hidden bg-sandstone/20">
                      <img
                        src={heroImg}
                        alt={bundle.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 bg-white/95 dark:bg-[#192D2A]/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-[#192D2A] dark:text-white flex items-center gap-1 shadow-sm border border-[#DDD5C8]/60 dark:border-white/10">
                          <Clock size={12} className="text-[#17745A] dark:text-[#D9A441]" />
                          {bundle.timeToCook}
                        </span>
                        <span className="px-2.5 py-1 bg-white/95 dark:bg-[#192D2A]/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-[#192D2A] dark:text-white flex items-center gap-1 shadow-sm border border-[#DDD5C8]/60 dark:border-white/10">
                          <Users size={12} className="text-[#17745A] dark:text-[#D9A441]" />
                          {bundle.servings}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-[#192D2A] font-semibold mb-2 dark:text-white">
                        {bundle.title}
                      </h3>
                      <p className="text-sm text-[#55524E] leading-relaxed mb-4 dark:text-[#E7E2D9]/80">
                        {bundle.subtitle}
                      </p>

                      {/* Chef's Pro Tip */}
                      {bundle.chefTip && (
                        <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#DDD5C8]/60 mb-5 dark:bg-[#132220] dark:border-white/10">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#17745A] flex items-center gap-1.5 mb-1 dark:text-[#D9A441]">
                            <Sparkles size={12} />
                            <span>Chef's Pro Tip</span>
                          </p>
                          <p className="text-xs text-[#55524E] italic dark:text-[#E7E2D9]/80">
                            &ldquo;{bundle.chefTip}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Included Ingredients Table */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#625F59] mb-2.5 dark:text-[#E7E2D9]/70">
                          Market Ingredients Included ({bundle.items.length})
                        </p>
                        <div className="divide-y divide-[#DDD5C8]/40 dark:divide-white/5 rounded-xl border border-[#DDD5C8]/60 overflow-hidden bg-[#FDFBF7] dark:bg-[#132220] dark:border-white/10">
                          {bundle.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={getProductLiveImage(item)}
                                  alt={item.name}
                                  className="h-8 w-8 rounded-lg object-cover shrink-0"
                                />
                                <span className="font-medium text-[#192D2A] truncate dark:text-white">
                                  {item.name}
                                </span>
                              </div>
                              <span className="font-semibold text-[#192D2A] shrink-0 ml-2 dark:text-[#D9A441]">
                                ₹{item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Footer & Add Button */}
                  <div className="p-6 border-t border-[#DDD5C8]/60 bg-[#F7F4EE] dark:bg-[#132220] dark:border-white/10">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#625F59] block dark:text-[#E7E2D9]/60">Bundle Total</span>
                        <span className="font-serif text-2xl font-bold text-[#192D2A] dark:text-white">₹{bundleTotal}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#17745A] dark:text-[#D9A441]">
                        Includes all measured portions
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBundle(bundle)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#17745A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135E49] transition active:scale-[0.98] shadow-sm"
                    >
                      <ShoppingBag size={15} />
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
