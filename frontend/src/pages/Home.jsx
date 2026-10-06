import { useState, useEffect } from 'react';
import { ArrowRight, Search, Sparkles, Truck } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HomeSections from '../components/HomeSections';
import { productsAPI } from '../utils/api';
import brandMark from '../assets/greenbasket-mark.png';

const categoryOptions = [
  { name: 'All', slug: '' },
  { name: 'Rice', slug: 'rice' },
  { name: 'Pulses', slug: 'pulses' },
  { name: 'Vegetables', slug: 'vegetables' },
  { name: 'Fruits', slug: 'fruits' },
  { name: 'Dairy', slug: 'dairy' },
  { name: 'Bakery', slug: 'bakery' },
  { name: 'Oils', slug: 'oils' },
  { name: 'Spices', slug: 'spices' },
  { name: 'Breakfast', slug: 'breakfast' },
  { name: 'Dry Fruits', slug: 'dry-fruits' },
  { name: 'Snacks', slug: 'snacks' },
  { name: 'Beverages', slug: 'beverages' },
  { name: 'Frozen Foods', slug: 'frozen-foods' },
  { name: 'Personal Care', slug: 'personal-care' },
  { name: 'Household', slug: 'household' },
  { name: 'Pet Care', slug: 'pet-care' },
];

const getCategorySlug = (categoryName) => categoryOptions.find((category) => category.name === categoryName)?.slug;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const categorySlug = getCategorySlug(selectedCategory);
    const request = categorySlug ? productsAPI.getByCategory(categorySlug) : productsAPI.getAll();
    setLoading(true);
    setError('');
    request.then(res => {
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Unable to load products. Please check the backend server.');
      setLoading(false);
    });
  }, [selectedCategory]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    if (location.hash === '#shop' && !loading) {
      window.setTimeout(() => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [location.hash, loading]);

  useEffect(() => {
    let filtered = products;
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    setFilteredProducts(filtered);
  }, [search, products]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    window.setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const allCategoryGroups = categoryOptions
    .filter(({ name }) => name !== 'All')
    .map(({ name }) => {
      const categoryProducts = filteredProducts.filter((product) => product.category === name);

      return {
        name,
        products: categoryProducts.slice(0, 4),
        total: categoryProducts.length,
      };
    })
    .filter((group) => group.total > 0);

  return (
    <div className="px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/70 bg-[#eef6e8] shadow-2xl shadow-emerald-950/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b3520] via-[#275f2a] to-[#a5d36f]" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-0 hidden h-52 w-52 rounded-full bg-orange-300/30 blur-3xl lg:block" />
          <div className="relative grid min-h-[540px] items-center gap-10 px-5 py-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-emerald-50 backdrop-blur">
                <Sparkles size={16} />
                GreenBasket / handpicked daily
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Real freshness. Right at your door.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50 sm:text-lg">
                Handpicked produce, trusted everyday staples, and simple doorstep delivery—everything your home needs in one beautiful basket.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('Vegetables')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-black text-emerald-800 shadow-xl shadow-stone-950/20 transition hover:-translate-y-1 hover:bg-emerald-50"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('Fruits')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
                >
                  View Offers
                </button>
              </div>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-white">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-2xl font-black">16+</p>
                  <p className="text-xs font-semibold text-emerald-50">Categories</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-2xl font-black">COD</p>
                  <p className="text-xs font-semibold text-emerald-50">Easy payment</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <p className="text-2xl font-black">Fresh</p>
                  <p className="text-xs font-semibold text-emerald-50">Picked items</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/25 bg-white/20 p-4 shadow-2xl shadow-stone-950/20 backdrop-blur-md">
              <img src={brandMark} alt="GreenBasket original basket and leaf mark" className="pointer-events-none absolute -right-6 -top-28 hidden h-52 w-52 object-contain drop-shadow-2xl lg:block" />
              <div className="rounded-[1.5rem] bg-[#fbfdf9] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-stone-950">Quick grocery search</p>
                    <p className="text-xs font-semibold text-stone-500">Find fresh picks instantly</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Truck size={22} />
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 shadow-sm">
                  <Search size={20} className="shrink-0 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search apples, milk, rice..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {['Fruits', 'Vegetables', 'Dairy', 'Snacks'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className="rounded-2xl bg-stone-50 px-4 py-4 text-left text-sm font-black text-stone-800 transition hover:-translate-y-1 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id="shop" className="mb-8 scroll-mt-28 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Fresh picks</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">Shop groceries</h2>
            <p className="mt-2 text-sm font-semibold text-stone-500">{filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'} available</p>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:justify-end lg:overflow-visible">
            {categoryOptions.map(({ name }) => (
              <button
                key={name}
                onClick={() => handleCategorySelect(name)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition-all ${
                  selectedCategory === name
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/15'
                    : 'border border-emerald-900/10 bg-white text-stone-600 hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-800 hover:shadow-sm'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-[1.75rem] bg-white shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-6 py-8 text-center font-semibold text-red-800">{error}</div>
        ) : (
          <>
            {!search && selectedCategory === 'All' && <HomeSections products={products} onCategorySelect={handleCategorySelect} />}
            {selectedCategory === 'All' && !search ? (
              <div className="space-y-12">
                {allCategoryGroups.map((group) => (
                  <section key={group.name}>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-stone-950">{group.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-stone-500">
                          Showing {group.products.length} of {group.total} products
                        </p>
                      </div>
                      {group.total > 4 && (
                        <button
                          type="button"
                          onClick={() => handleCategorySelect(group.name)}
                          className="inline-flex w-fit items-center justify-center rounded-full border border-emerald-900/10 bg-white px-5 py-2.5 text-sm font-black text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
                        >
                          See more
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {group.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            {filteredProducts.length === 0 && (
              <div className="rounded-[1.75rem] border border-emerald-900/10 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-lg font-black text-stone-800">No products found</p>
                <p className="mt-2 font-medium text-stone-500">Try another search or category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
