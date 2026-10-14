import { useState, useEffect } from 'react';
import { Leaf, Award, Calendar, Search, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const FreshMarket = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    productsAPI.getAll()
      .then((res) => {
        if (!active) return;
        // Filter only fresh produce categories: Vegetables and Fruits
        const freshProduce = (res.data || []).filter(
          (p) => p.category === 'Vegetables' || p.category === 'Fruits'
        );
        setProducts(freshProduce);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] pb-24 text-[#192D2A] dark:text-[#F8F3EA]">
      {/* Editorial Page Header with Fresh Farm Produce Background */}
      <section className="relative overflow-hidden border-b border-[#DDD5C8]/80 bg-[#142621] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1600&q=80"
            alt="Farm fresh market produce"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E1A]/90 via-[#142621]/80 to-[#0F1E1A]/90" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-700/80 border border-emerald-500/40 rounded-md text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-2.5 shadow-sm">
            <Leaf size={12} className="text-emerald-300" />
            <span>Farm-to-Door Transparency</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            The Fresh Market
          </h1>
          <p className="mt-2.5 text-[#E2E8F0] text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed font-normal">
            Direct daily harvests from verified partner orchards, delivered with cold-chain freshness.
          </p>
        </div>
      </section>

      {/* Produce Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD5C8]/80 dark:border-white/10">
          {/* Category Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'All', label: 'All Fresh Harvest' },
              { id: 'Vegetables', label: 'Daily Vegetables' },
              { id: 'Fruits', label: 'Seasonal Fruits' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === tab.id
                    ? 'bg-[#192D2A] text-white shadow-sm dark:bg-[#17745A]'
                    : 'border border-[#DDD5C8] bg-white text-[#55524E] hover:border-[#192D2A] dark:bg-[#1A2826] dark:text-[#E7E2D9] dark:border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick produce search */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#E7E2D9]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter fresh produce..."
              className="w-full rounded-xl border border-[#DDD5C8] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#192D2A] outline-none placeholder:text-[#625F59]/70 focus:border-[#17745A] dark:bg-[#1A2826] dark:border-white/10 dark:text-white"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="pt-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white border border-[#DDD5C8] animate-pulse dark:bg-[#1A2826]" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <Leaf size={40} className="mx-auto mb-3 text-[#DDD5C8]" />
              <p className="font-serif text-lg font-semibold text-[#192D2A] dark:text-white">No fresh produce matching your filter</p>
              <p className="text-xs text-[#55524E] mt-1 dark:text-[#E7E2D9]/70">Try clearing your search term or exploring All Fresh Harvest.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreshMarket;
