import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Check, ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Bakery',
  'Rice',
  'Pulses',
  'Oils',
  'Spices',
  'Breakfast',
  'Dry Fruits',
  'Snacks',
  'Beverages',
  'Frozen Foods',
  'Personal Care',
  'Household',
  'Pet Care',
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from URL / state
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [maxPrice, setMaxPrice] = useState(1200);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let active = true;
    setLoading(true);
    productsAPI.getAll()
      .then((res) => {
        if (!active) return;
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const setCategoryFilter = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    const next = new URLSearchParams(searchParams);
    if (!value.trim()) next.delete('search');
    else next.set('search', value);
    setSearchParams(next);
    setCurrentPage(1);
  };

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (p.price > maxPrice) return false;
        if (onlyOrganic && !p.isOrganic) return false;
        if (onlyInStock && (p.stock ?? 1) <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
        return 0; // recommended
      });
  }, [products, selectedCategory, searchQuery, maxPrice, onlyOrganic, onlyInStock, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] pb-24 text-[#192D2A] dark:text-[#F8F3EA]">
      {/* Editorial Page Header with High-Contrast Curated Shelves Photography */}
      <section className="relative overflow-hidden border-b border-[#DDD5C8]/80 bg-[#0F1E1B] text-white py-14 px-4 sm:px-6 lg:px-8 mb-8 shadow-inner">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
            alt="Grocery catalog collection"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1614]/90 via-[#0F231F]/80 to-[#0A1614]/90" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-md bg-emerald-700/80 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100 mb-2.5 shadow-sm">
            Catalog &bull; {selectedCategory}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight drop-shadow-sm">
            {selectedCategory === 'All' ? 'All Provisions & Pantry Staples' : selectedCategory}
          </h1>
          <p className="mt-2.5 text-[#E2E8F0] text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed font-normal">
            Direct-harvest orchard produce, cold-pressed oils, and everyday fresh kitchen essentials.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Catalog Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Left Filter Rail (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            {/* Search within catalog */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-5 shadow-sm dark:bg-[#162522] dark:border-white/10">
              <label htmlFor="shop-search" className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] mb-2.5 dark:text-white">
                Search Catalog
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[#DDD5C8] bg-[#F7F4EE] px-3 py-2 dark:bg-[#132220] dark:border-white/10">
                <Search size={14} className="text-[#625F59] dark:text-[#E7E2D9]/60" />
                <input
                  id="shop-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Apples, flour, ghee..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-[#192D2A] outline-none placeholder:text-[#625F59]/70 dark:text-white"
                />
              </div>
            </div>

            {/* Department / Category Filter */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-5 shadow-sm dark:bg-[#162522] dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#192D2A] mb-3.5 dark:text-white">
                Departments
              </h3>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-[#192D2A] text-white shadow-sm dark:bg-[#17745A]'
                        : 'text-[#55524E] hover:bg-[#F7F4EE] hover:text-[#192D2A] dark:text-[#E7E2D9]/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-5 shadow-sm dark:bg-[#162522] dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white">
                  Max Price
                </h3>
                <span className="font-serif text-base font-bold text-[#17745A] dark:text-[#D9A441]">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1200"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#17745A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#625F59] mt-1.5 dark:text-[#E7E2D9]/60">
                <span>₹30</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* Attributes Toggles */}
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-5 shadow-sm space-y-3 dark:bg-[#162522] dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white">
                Attributes
              </h3>
              <label className="flex items-center gap-2.5 text-xs font-medium text-[#192D2A] cursor-pointer dark:text-white">
                <input
                  type="checkbox"
                  checked={onlyOrganic}
                  onChange={(e) => setOnlyOrganic(e.target.checked)}
                  className="rounded border-[#DDD5C8] text-[#17745A] focus:ring-0"
                />
                <span>Certified Organic</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-medium text-[#192D2A] cursor-pointer dark:text-white">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-[#DDD5C8] text-[#17745A] focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div>
            {/* Top Sort & Mobile Filter Toggle Bar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#DDD5C8] bg-white p-3.5 shadow-sm dark:bg-[#162522] dark:border-white/10">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#DDD5C8] bg-[#F7F4EE] px-3.5 py-2 text-xs font-bold text-[#192D2A] lg:hidden dark:bg-[#132220] dark:border-white/10 dark:text-white"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown size={14} className="text-[#625F59] dark:text-[#E7E2D9]/60" />
                <label htmlFor="shop-sort" className="sr-only">Sort products</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-[#DDD5C8] bg-[#F7F4EE] px-3 py-2 text-xs font-semibold text-[#192D2A] outline-none dark:bg-[#132220] dark:border-white/10 dark:text-white"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Largest Discount</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-white border border-[#DDD5C8] dark:bg-[#162522]" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="rounded-2xl border border-[#DDD5C8] bg-white p-12 text-center dark:bg-[#162522] dark:border-white/10">
                <p className="font-serif text-lg font-semibold text-[#192D2A] dark:text-white">No items matched your current filters</p>
                <p className="mt-1 text-xs text-[#55524E] dark:text-[#E7E2D9]/70">Try widening your price range or clearing search queries.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('All');
                    handleSearchChange('');
                    setMaxPrice(1200);
                    setOnlyOrganic(false);
                    setOnlyInStock(false);
                  }}
                  className="mt-4 rounded-xl bg-[#192D2A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#253D39] transition dark:bg-[#17745A]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Compact Pagination Controls */}
            {totalPages > 1 && (() => {
              const getPageNumbers = () => {
                if (totalPages <= 7) {
                  return Array.from({ length: totalPages }, (_, i) => i + 1);
                }
                const pages = [];
                pages.push(1);
                if (currentPage > 3) {
                  pages.push('dots-left');
                }
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }
                if (currentPage < totalPages - 2) {
                  pages.push('dots-right');
                }
                pages.push(totalPages);
                return pages;
              };

              return (
                <div className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2 border-t border-[#DDD5C8]/80 pt-8 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] disabled:opacity-30 hover:bg-[#F7F4EE] transition dark:bg-[#162522] dark:border-white/10 dark:text-white"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers().map((item, idx) => {
                    if (typeof item === 'string') {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="flex h-9 w-8 items-center justify-center text-xs font-bold text-[#625F59] dark:text-gray-400 select-none"
                        >
                          &hellip;
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setCurrentPage(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`h-9 min-w-[36px] rounded-xl px-2.5 text-xs font-bold transition ${
                          currentPage === item
                            ? 'bg-[#17745A] text-white shadow-sm ring-1 ring-[#17745A]'
                            : 'border border-[#DDD5C8] bg-white text-[#55524E] hover:bg-[#F7F4EE] hover:text-[#192D2A] dark:bg-[#162522] dark:border-white/10 dark:text-white dark:hover:bg-white/10'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] disabled:opacity-30 hover:bg-[#F7F4EE] transition dark:bg-[#162522] dark:border-white/10 dark:text-white"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
