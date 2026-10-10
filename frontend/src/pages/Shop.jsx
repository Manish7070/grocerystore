import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const categories = [
  'All',
  'Rice',
  'Pulses',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Bakery',
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
  // Filters from URL / state
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [maxPrice, setMaxPrice] = useState(1000);
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
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Failed to load products');
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
    setSearchParams(next);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    setSearchParams(next);
    setMaxPrice(1000);
    setOnlyOrganic(false);
    setOnlyInStock(false);
    setSortBy('recommended');
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (onlyOrganic) {
      list = list.filter((p) => p.isOrganic || p.name.toLowerCase().includes('organic'));
    }

    if (onlyInStock) {
      list = list.filter((p) => (p.stock ?? 1) > 0);
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, maxPrice, onlyOrganic, onlyInStock, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <nav className="mb-2 text-xs font-semibold text-stone-500">
          <Link to="/" className="hover:text-emerald-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900 font-bold dark:text-stone-100">Shop Groceries</span>
          {selectedCategory !== 'All' && (
            <>
              <span className="mx-2">/</span>
              <span className="text-emerald-700 font-bold">{selectedCategory}</span>
            </>
          )}
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight dark:text-white">
              {selectedCategory === 'All' ? 'All Grocery Aisles' : `${selectedCategory} Pantry`}
            </h1>
            <p className="text-sm font-medium text-stone-500">
              Farm-fresh produce and daily household essentials, direct to your door.
            </p>
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 shadow-sm lg:hidden dark:bg-stone-900 dark:text-stone-100"
          >
            <SlidersHorizontal size={18} />
            Filters & Sorting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/5">
            <span className="font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Filter size={18} className="text-emerald-700" />
              Smart Filters
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-stone-400">Categories</h3>
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#075F46] text-white shadow-sm font-bold'
                      : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory.toLowerCase() === cat.toLowerCase() && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-stone-100 pt-5 dark:border-white/5">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-400">
              <span>Max Price</span>
              <span className="text-sm font-black text-emerald-800 dark:text-emerald-400">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#075F46] cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[11px] font-bold text-stone-400">
              <span>₹20</span>
              <span>₹1,000</span>
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="space-y-3 border-t border-stone-100 pt-5 dark:border-white/5">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">Dietary & Stock</h3>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-stone-700 cursor-pointer dark:text-stone-300">
              <input
                type="checkbox"
                checked={onlyOrganic}
                onChange={(e) => setOnlyOrganic(e.target.checked)}
                className="rounded text-emerald-700 accent-emerald-700 h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                Organic Certified Only
              </span>
            </label>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-stone-700 cursor-pointer dark:text-stone-300">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-700 accent-emerald-700 h-4 w-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Products Grid */}
        <div>
          {/* Controls Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-emerald-900/10 shadow-sm dark:bg-[#14231a] dark:border-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-300">
              <span>Showing <strong className="text-stone-900 dark:text-white">{filteredProducts.length}</strong> fresh products</span>
              {(selectedCategory !== 'All' || maxPrice < 1000 || onlyOrganic || onlyInStock) && (
                <button
                  onClick={clearAllFilters}
                  className="ml-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700 hover:bg-orange-200"
                >
                  Clear Active Filters
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300">
              <ArrowUpDown size={15} />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-bold text-stone-800 outline-none dark:bg-stone-900 dark:border-white/10 dark:text-white"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Product Listing */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[2rem] bg-stone-200 dark:bg-stone-800" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-stone-300 bg-white p-12 text-center dark:bg-stone-900 dark:border-white/10">
              <p className="text-xl font-bold text-stone-800 dark:text-white">No products found matching your filter</p>
              <p className="mt-2 text-sm text-stone-500">Try adjusting your price range or clearing category filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-5 rounded-2xl bg-[#075F46] px-6 py-3 font-bold text-white hover:bg-[#064D3A]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white font-bold text-stone-700 disabled:opacity-40 dark:bg-stone-800 dark:border-white/10 dark:text-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition ${
                            currentPage === pageNum
                              ? 'bg-[#075F46] text-white shadow-md'
                              : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:bg-stone-800 dark:border-white/10 dark:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="px-1 text-stone-400">...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white font-bold text-stone-700 disabled:opacity-40 dark:bg-stone-800 dark:border-white/10 dark:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
