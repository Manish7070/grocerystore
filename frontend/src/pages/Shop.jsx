import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Check, ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    next.delete('page');
    setSearchParams(next);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val.trim()) {
      next.set('search', val.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
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
    <div className="min-h-screen bg-porcelain px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Editorial Page Header */}
        <div className="mb-10 border-b border-sandstone pb-8 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">
            The Grocery Catalog
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-5xl dark:text-ivory">
            {selectedCategory === 'All' ? 'All Provisions & Fresh Market' : selectedCategory}
          </h1>
          <p className="mt-2 text-xs font-normal text-warmStone max-w-xl dark:text-ivory/70">
            Carefully curated daily staples, cold-pressed virgin oils, direct-harvest orchard produce, and artisan kitchen essentials.
          </p>

          {/* Active Filter Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-warmStone dark:text-ivory/60">
              Showing {filteredProducts.length} items
            </span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-sandstone bg-ivory px-2.5 py-1 text-xs font-semibold text-espresso dark:bg-[#251D21] dark:border-white/10 dark:text-ivory">
                {selectedCategory}
                <button type="button" onClick={() => setCategoryFilter('All')} aria-label="Clear category filter">
                  <X size={12} className="text-warmStone hover:text-espresso" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md border border-sandstone bg-ivory px-2.5 py-1 text-xs font-semibold text-espresso dark:bg-[#251D21] dark:border-white/10 dark:text-ivory">
                &ldquo;{searchQuery}&rdquo;
                <button type="button" onClick={() => handleSearchChange('')} aria-label="Clear search">
                  <X size={12} className="text-warmStone hover:text-espresso" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Left Filter Rail (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            {/* Search within catalog */}
            <div className="rounded-xl border border-sandstone bg-ivory p-4 dark:bg-[#1D151A] dark:border-white/10">
              <label htmlFor="shop-search" className="block text-xs font-bold uppercase tracking-wider text-espresso mb-2 dark:text-ivory">
                Search Catalog
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-sandstone bg-porcelain px-3 py-1.5 dark:bg-[#251D21] dark:border-white/10">
                <Search size={14} className="text-warmStone" />
                <input
                  id="shop-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Apples, flour, ghee..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-espresso outline-none placeholder:text-warmStone dark:text-ivory"
                />
              </div>
            </div>

            {/* Department / Category Filter */}
            <div className="rounded-xl border border-sandstone bg-ivory p-4 dark:bg-[#1D151A] dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-espresso mb-3 dark:text-ivory">
                Departments
              </h3>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-terracotta text-ivory font-bold'
                        : 'text-warmStone hover:bg-porcelain hover:text-espresso dark:hover:bg-[#251D21] dark:text-ivory/70'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="rounded-xl border border-sandstone bg-ivory p-4 dark:bg-[#1D151A] dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">
                  Max Price
                </h3>
                <span className="font-serif text-sm font-bold text-terracotta dark:text-apricot">
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
                className="w-full accent-terracotta cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-warmStone mt-1">
                <span>₹30</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* Attributes Toggles */}
            <div className="rounded-xl border border-sandstone bg-ivory p-4 space-y-3 dark:bg-[#1D151A] dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">
                Attributes
              </h3>
              <label className="flex items-center gap-2 text-xs font-medium text-espresso cursor-pointer dark:text-ivory">
                <input
                  type="checkbox"
                  checked={onlyOrganic}
                  onChange={(e) => setOnlyOrganic(e.target.checked)}
                  className="rounded border-sandstone text-terracotta focus:ring-0"
                />
                <span>Certified Organic</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-espresso cursor-pointer dark:text-ivory">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-sandstone text-terracotta focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div>
            {/* Top Sort & Mobile Filter Toggle Bar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-sandstone bg-ivory p-3 dark:bg-[#1D151A] dark:border-white/10">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-sandstone bg-porcelain px-3 py-1.5 text-xs font-bold text-espresso lg:hidden dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown size={14} className="text-warmStone" />
                <label htmlFor="shop-sort" className="sr-only">Sort products</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-sandstone bg-porcelain px-3 py-1.5 text-xs font-semibold text-espresso outline-none dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-sandstone/30" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="rounded-2xl border border-sandstone bg-ivory p-12 text-center dark:bg-[#1D151A] dark:border-white/10">
                <p className="font-serif text-lg text-espresso dark:text-ivory">No items matched your current filters</p>
                <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">Try widening your price range or clearing search queries.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('All');
                    handleSearchChange('');
                    setMaxPrice(1200);
                    setOnlyOrganic(false);
                    setOnlyInStock(false);
                  }}
                  className="mt-4 rounded-xl bg-terracotta px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Numbered Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-sandstone pt-8 dark:border-white/10">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-sandstone bg-ivory text-espresso disabled:opacity-40 hover:bg-sandstone/30 transition dark:bg-[#1D151A] dark:border-white/10 dark:text-ivory"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
                      currentPage === page
                        ? 'bg-terracotta text-ivory'
                        : 'border border-sandstone bg-ivory text-espresso hover:bg-sandstone/30 dark:bg-[#1D151A] dark:border-white/10 dark:text-ivory'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-sandstone bg-ivory text-espresso disabled:opacity-40 hover:bg-sandstone/30 transition dark:bg-[#1D151A] dark:border-white/10 dark:text-ivory"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-espresso/50 backdrop-blur-sm lg:hidden">
          <div className="ml-auto flex h-full w-[min(85vw,340px)] flex-col bg-ivory p-6 shadow-floating dark:bg-[#1D151A]">
            <div className="flex items-center justify-between pb-4 border-b border-sandstone dark:border-white/10">
              <h2 className="font-serif text-lg font-bold text-espresso dark:text-ivory">Filter Catalog</h2>
              <button type="button" onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X size={18} className="text-warmStone" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-espresso mb-2 dark:text-ivory">Department</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        setMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategory === cat ? 'bg-terracotta text-ivory font-bold' : 'text-warmStone'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full rounded-xl bg-terracotta py-3 text-xs font-bold uppercase tracking-wider text-ivory"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
