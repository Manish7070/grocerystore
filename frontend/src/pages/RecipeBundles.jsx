import { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, ShoppingCart } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

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
    showToast(`Added all ${bundle.items.length} ingredients for "${bundle.title}" to cart!`, 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <ChefHat size={16} />
          1-Click Cook Baskets
        </span>
        <h1 className="mt-3 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
          Cook Tonight: Curated Meal Recipe Kits
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-stone-500">
          Skip endless searching. Get all farm-fresh ingredients in exact proportions for iconic home-cooked dishes in one click.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 animate-pulse rounded-[2.5rem] bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const bundleTotal = bundle.items.reduce((sum, item) => sum + (item.price || 0), 0);

            return (
              <div
                key={bundle.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#14231a] dark:border-white/10"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                      <Clock size={14} className="text-emerald-700" />
                      {bundle.timeToCook}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                      <Users size={14} className="text-emerald-700" />
                      {bundle.servings}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-stone-900 tracking-tight dark:text-white">
                    {bundle.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-stone-500 leading-relaxed">
                    {bundle.subtitle}
                  </p>

                  {/* Chef Tip */}
                  <div className="my-4 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/50 dark:bg-amber-950/40 dark:border-amber-800/40">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-snug">
                      <strong className="font-black text-amber-800 dark:text-amber-300">Chef&apos;s Secret: </strong>
                      {bundle.chefTip}
                    </p>
                  </div>

                  {/* Ingredients Included */}
                  <div className="my-4">
                    <p className="mb-2 text-xs font-black uppercase tracking-wider text-stone-400">
                      Ingredients Included ({bundle.items.length})
                    </p>
                    <div className="space-y-2">
                      {bundle.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 dark:bg-stone-900 dark:text-stone-300"
                        >
                          <span className="truncate">{item.name}</span>
                          <span className="font-bold text-emerald-800 dark:text-emerald-400 shrink-0 ml-2">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-stone-100 pt-4 dark:border-white/5">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-stone-500">Bundle Total</span>
                    <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">₹{bundleTotal}</span>
                  </div>
                  <button
                    onClick={() => handleAddBundle(bundle)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075F46] py-3.5 font-black text-white shadow-md transition hover:bg-[#064D3A] active:scale-[0.99]"
                  >
                    <ShoppingCart size={18} />
                    Add Recipe Kit to Basket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecipeBundles;
