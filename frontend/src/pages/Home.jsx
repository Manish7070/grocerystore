import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChefHat,
  Clock,
  ShieldCheck,
  Heart,
  Truck,
  Award,
  Leaf,
  CheckCircle2,
  Star,
  BookOpen,
  TrendingDown,
  Lock,
  RotateCcw,
  Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HyperlocalConnect from '../components/HyperlocalConnect';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// Curated Category Tiles with High-Definition Live Imagery
const curatedCategories = [
  {
    name: 'Farm Vegetables',
    slug: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tagline: 'Harvested daily from partner farms',
    count: '15 Varieties',
  },
  {
    name: 'Artisan Bakery',
    slug: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    tagline: 'Naturally fermented sourdough & rolls',
    count: '15 Varieties',
  },
  {
    name: 'Dairy & Essentials',
    slug: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    tagline: 'Fresh whole milk, cultured ghee & butter',
    count: '15 Varieties',
  },
  {
    name: 'Heirloom Grains & Rice',
    slug: 'Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    tagline: 'Aged basmati & stoneground grains',
    count: '15 Varieties',
  },
  {
    name: 'Cold-Pressed Oils & Spices',
    slug: 'Oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    tagline: 'Virgin extractions & whole aromatics',
    count: '15 Varieties',
  },
  {
    name: 'Orchard Fresh Fruits',
    slug: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    tagline: 'Peak-harvest orchard selection',
    count: '15 Varieties',
  },
];

// Curated Recipe Kits Preview
const recipeKitsPreview = [
  {
    title: 'Desi Palak Paneer Kit',
    prepTime: '25 mins',
    servings: '3–4',
    price: 200,
    tag: 'Farm-Fresh Classic',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    desc: 'Tender baby spinach, fresh artisanal paneer, cold-pressed ghee, garlic bulbs & whole aromatic spices.',
  },
  {
    title: 'Royal Dum Biryani Essentials',
    prepTime: '40 mins',
    servings: '4–5',
    price: 890,
    tag: 'Heritage Kitchen',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    desc: 'Aged long-grain basmati rice, pure cow ghee, red onions, ginger root, and royal whole spices.',
  },
  {
    title: 'Morning Energy & Smoothie Kit',
    prepTime: '5 mins',
    servings: '2',
    price: 170,
    tag: 'Quick Breakfast',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    desc: 'Fresh Cavendish bananas, chilled whole milk, and rich probiotic Greek yogurt.',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  useEffect(() => {
    let active = true;
    setLoading(true);
    productsAPI
      .getAll()
      .then((res) => {
        if (!active) return;
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Filter curated products for "This Week's Market Edit" (12 items)
  const filteredEditProducts = products
    .filter((p) => {
      if (activeCategoryFilter === 'All') {
        // Feature delicious food, fresh produce, dairy, bakery & farm crops on home edit
        return !['Pet Care', 'Household', 'Personal Care'].includes(p.category);
      }
      return p.category === activeCategoryFilter;
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#192D2A] dark:bg-[#0B1714] dark:text-[#F3F0E6] transition-colors duration-300">
      {/* =========================================================================
          SECTION 01 — CINEMATIC EDITORIAL HERO (Deep Forest Canvas #0B1714)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#192D2A] text-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24 dark:bg-[#0B1714] border-b border-transparent dark:border-[#30483C]/60">
        {/* Subtle curated glow behind food photography */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#17745A]/20 dark:bg-[#55D6A0]/10 opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-[#D9A441]/15 dark:bg-[#E6BC70]/10 opacity-50 blur-3xl" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            {/* Left Narrative */}
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white dark:text-[#F3F0E6] leading-[1.12]">
                Good food.<br />
                <span className="italic font-normal text-[#D9A441] dark:text-[#E6BC70]">Beautifully</span> everyday.
              </h1>

              <p className="mt-6 text-base sm:text-lg font-normal leading-relaxed text-[#F4EFE6] dark:text-[#B6C7BD] max-w-xl">
                Carefully selected farm produce, pantry essentials, and artisanal ingredients — delivered directly to your doorstep with uncompromising cold-chain freshness.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/shop"
                  className="btn-motion inline-flex items-center justify-center gap-2 rounded-xl bg-[#17745A] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#135E49] hover:-translate-y-0.5 active:scale-[0.98] dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E] dark:hover:shadow-[0_8px_25px_rgba(85,214,160,0.35)]"
                >
                  <span>Explore The Market</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/bundles"
                  className="btn-motion inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 active:scale-[0.98] backdrop-blur-sm dark:border-[#30483C] dark:bg-transparent dark:text-[#F3F0E6] dark:hover:bg-[#172C24] dark:hover:border-[#55D6A0]/50"
                >
                  Shop Recipe Kits
                </Link>
              </div>

              {/* Editorial Trust Accents */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 dark:border-[#30483C] pt-8">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-white dark:text-[#F3F0E6]">40+</p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#E7E2D9]/85 dark:text-[#B6C7BD]">Partner Orchards</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D9A441] dark:text-[#E6BC70]">Zero</p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#E7E2D9]/85 dark:text-[#B6C7BD]">Synthetic Preservatives</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-white dark:text-[#F3F0E6]">2 Hr</p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#E7E2D9]/85 dark:text-[#B6C7BD]">Direct Cold-Chain</p>
                </div>
              </div>
            </div>

            {/* Right Fresh Produce Photography */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 dark:border-[#30483C] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=85"
                  alt="Vibrant sunlit organic produce, farm vegetables and artisanal bread"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#192D2A]/70 dark:from-[#0B1714]/80 via-transparent to-transparent" />
              </div>

              {/* Floating Provenance Badge */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/25 bg-[#192D2A]/95 dark:bg-[#172C24]/95 dark:border-[#30483C] p-4 shadow-xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17745A]/30 dark:bg-[#55D6A0]/20 text-[#D9A441] dark:text-[#55D6A0]">
                    <Leaf size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white dark:text-[#F3F0E6]">Daily Harvest Intake</p>
                    <p className="text-[11px] text-[#E7E2D9]/80 dark:text-[#B6C7BD]">Evaluated at sunrise &bull; Grade A+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — THREE CORE HIGHLIGHTS (Surface 3: Market Surface #172C24)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 bg-[#F7F4EE] px-4 py-14 sm:px-6 lg:py-18 dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* 01 Source */}
            <div className="group relative rounded-3xl border border-[#DDD5C8] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#17745A] dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F] dark:hover:border-[#55D6A0]/60 overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 dark:bg-[#55D6A0]/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17745A]/10 text-[#17745A] dark:bg-[#20392F] dark:text-[#55D6A0] mb-6 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Leaf size={26} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0] group-hover:underline">
                01 &bull; Verified Source
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#192D2A] mt-2 mb-3 dark:text-[#F3F0E6]">
                Carefully Selected
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#625F59] dark:text-[#B6C7BD]">
                Every batch of produce is evaluated at sunrise. We partner directly with verified independent farmers and artisan millers, cutting out multi-tier wholesale depots.
              </p>
            </div>

            {/* 02 Delivery */}
            <div className="group relative rounded-3xl border border-[#DDD5C8] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#17745A] dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F] dark:hover:border-[#55D6A0]/60 overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 dark:bg-[#55D6A0]/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17745A]/10 text-[#17745A] dark:bg-[#20392F] dark:text-[#55D6A0] mb-6 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <ShieldCheck size={26} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0] group-hover:underline">
                02 &bull; Cold-Chain Care
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#192D2A] mt-2 mb-3 dark:text-[#F3F0E6]">
                Delivered with Care
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#625F59] dark:text-[#B6C7BD]">
                Packed in breathable, temperature-sealed crates. Handed over with a unique 4-digit security PIN for verified doorstep assurance.
              </p>
            </div>

            {/* 03 Value */}
            <div className="group relative rounded-3xl border border-[#DDD5C8] bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#17745A] dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F] dark:hover:border-[#55D6A0]/60 overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 dark:bg-[#55D6A0]/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17745A]/10 text-[#17745A] dark:bg-[#20392F] dark:text-[#55D6A0] mb-6 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingDown size={26} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0] group-hover:underline">
                03 &bull; Honest Economics
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#192D2A] mt-2 mb-3 dark:text-[#F3F0E6]">
                Everyday Value
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#625F59] dark:text-[#B6C7BD]">
                Fair farmgate pricing paired with our zero-waste radar. Rescued near-expiry produce receives smart discounts, making mindful cooking accessible and sustainable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HYPERLOCAL CONNECT — 300M - 500M EXPRESS HELPER DELIVERY
          ========================================================================= */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HyperlocalConnect />
      </section>

      {/* =========================================================================
          SECTION 03 — CURATED MARKET CATEGORIES (Deep Forest #0B1714 Canvas)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-12 sm:px-6 lg:py-16 bg-[#FDFBF7] dark:bg-[#0B1714] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0]">The Aisles</p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#192D2A] dark:text-[#F3F0E6]">
                Curated Market Departments
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17745A] hover:underline dark:text-[#55D6A0]"
            >
              Browse All Aisles →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {curatedCategories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1 dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F] dark:hover:border-[#55D6A0]/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sandstone/20">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#192D2A]/80 dark:from-[#0B1714]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 rounded-md bg-white/90 dark:bg-[#20392F]/90 dark:border dark:border-[#30483C] backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                    {cat.count}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-[#192D2A] transition-colors group-hover:text-[#17745A] dark:text-[#F3F0E6] dark:group-hover:text-[#55D6A0]">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#55524E] leading-relaxed dark:text-[#B6C7BD]">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — THIS WEEK'S MARKET EDIT (Forest Section #10221B)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-12 sm:px-6 lg:py-16 bg-[#F7F4EE] dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0]">The Edit</p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#192D2A] dark:text-[#F3F0E6]">
                This Week's Market Provisions
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Pulses', 'Rice', 'Bakery', 'Snacks'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeCategoryFilter === cat
                      ? 'bg-[#17745A] text-white shadow-sm dark:bg-[#55D6A0] dark:text-[#0B1714] dark:font-bold'
                      : 'border border-[#DDD5C8] bg-white text-[#55524E] hover:border-[#17745A] dark:bg-[#172C24] dark:text-[#B6C7BD] dark:border-[#30483C] dark:hover:border-[#55D6A0]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white border border-[#DDD5C8] animate-pulse dark:bg-[#172C24] dark:border-[#30483C]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredEditProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="btn-motion inline-flex items-center gap-2 rounded-xl bg-[#192D2A] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#253D39] dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E] dark:hover:shadow-[0_4px_20px_rgba(85,214,160,0.3)]"
            >
              <span>Explore Complete Fresh Catalog</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — SOURCING STORY (Deep Forest #0B1714)
          ========================================================================= */}
      <section id="story" className="relative overflow-hidden border-b border-[#DDD5C8]/80 dark:border-[#30483C] bg-[#0E1A17] dark:bg-[#0B1714] text-white px-4 py-16 sm:px-6 lg:py-20 shadow-inner">
        {/* Background Image Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt="Farm landscape background"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1714]/95 via-[#0B1714]/90 to-[#0B1714]/95" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 dark:border-[#30483C] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer harvesting fresh organic produce"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="space-y-5">
              <span className="inline-block rounded-md bg-emerald-700/80 border border-emerald-500/40 dark:bg-[#172C24] dark:border-[#30483C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 dark:text-[#55D6A0] shadow-sm">
                Our Sourcing Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white dark:text-[#F3F0E6]">
                The everyday shop,<br />thoughtfully done.
              </h2>
              <p className="text-sm sm:text-base font-normal leading-relaxed text-[#F4EFE6] dark:text-[#B6C7BD]">
                Most modern groceries travel through multiple holding warehouses, enduring gas-ripening and weeks of chemical preservation before reaching your shelf.
              </p>
              <p className="text-sm sm:text-base font-normal leading-relaxed text-[#F4EFE6] dark:text-[#B6C7BD]">
                TaazaDaily was built on a different covenant: we work directly with independent orchards in Himachal, organic vegetable growers in Pune and Nashik, and traditional cold-press millers. When produce is ordered, it is dispatched from fresh daily intakes, not stale freezer stacks.
              </p>

              {/* High-visibility statistics cards */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/20 dark:border-[#30483C] bg-white/10 dark:bg-[#172C24]/80 p-4 backdrop-blur-sm">
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D9A441] dark:text-[#E6BC70]">100%</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-white dark:text-[#F3F0E6]">Traceable Provenance</p>
                  <p className="text-[11px] text-[#E7E2D9]/75 dark:text-[#B6C7BD] mt-0.5">Direct farmer relationships</p>
                </div>
                <div className="rounded-xl border border-white/20 dark:border-[#30483C] bg-white/10 dark:bg-[#172C24]/80 p-4 backdrop-blur-sm">
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D9A441] dark:text-[#E6BC70]">Zero</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-white dark:text-[#F3F0E6]">Synthetic Preservatives</p>
                  <p className="text-[11px] text-[#E7E2D9]/75 dark:text-[#B6C7BD] mt-0.5">No artificial ripening gases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — 1-CLICK RECIPE COOK KITS PREVIEW (Forest Section #10221B)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-12 sm:px-6 lg:py-16 bg-[#FDFBF7] dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0]">Culinary Studio</p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#192D2A] dark:text-[#F3F0E6]">
                1-Click Recipe Cook Kits
              </h2>
            </div>
            <Link
              to="/bundles"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17745A] hover:underline dark:text-[#55D6A0]"
            >
              Explore All Recipe Kits →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recipeKitsPreview.map((kit) => (
              <div
                key={kit.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white shadow-sm transition-all duration-300 hover:shadow-card hover:-translate-y-1 dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sandstone/20">
                  <img
                    src={kit.image}
                    alt={kit.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-md bg-white/95 dark:bg-[#172C24]/90 dark:border dark:border-[#30483C] backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-[#192D2A] dark:text-[#F3F0E6] flex items-center gap-1 shadow-sm">
                      <Clock size={12} className="text-[#17745A] dark:text-[#55D6A0]" />
                      {kit.prepTime}
                    </span>
                    <span className="rounded-md bg-white/95 dark:bg-[#172C24]/90 dark:border dark:border-[#30483C] backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-[#192D2A] dark:text-[#F3F0E6] shadow-sm">
                      {kit.servings}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#17745A] dark:text-[#55D6A0]">
                    {kit.tag}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[#192D2A] mt-1 dark:text-[#F3F0E6]">
                    {kit.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#55524E] leading-relaxed dark:text-[#B6C7BD]">
                    {kit.desc}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#DDD5C8]/60 dark:border-[#30483C]">
                    <span className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                      ₹{kit.price}
                    </span>
                    <Link
                      to="/bundles"
                      className="btn-motion rounded-xl bg-[#192D2A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#253D39] transition dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E]"
                    >
                      View Recipe Kit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — SMART SAVINGS & FRESHNESS RADAR (Deep Forest #0B1714)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-12 sm:px-6 lg:py-16 bg-[#F7F4EE] dark:bg-[#0B1714] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#DDD5C8] bg-white p-6 sm:p-10 shadow-sm dark:bg-[#172C24] dark:border-[#30483C]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-block rounded-md bg-emerald-100 dark:bg-[#20392F] dark:border dark:border-[#30483C] px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-[#55D6A0] mb-2">
                  Zero Food Waste Mission
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#192D2A] dark:text-[#F3F0E6]">
                  Less Waste. More Everyday Value.
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#55524E] max-w-xl dark:text-[#B6C7BD]">
                  Instead of letting fresh produce spoil in warehouses, our automated Freshness Radar marks down near-expiry batches by 15%–40%. You save money, and nutritious food is rescued from going to waste.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to="/smart-savings"
                    className="btn-motion inline-flex items-center gap-2 rounded-xl bg-[#17745A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#135E49] transition shadow-sm dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E]"
                  >
                    <span>Explore Smart Savings</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Visual Value Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#DDD5C8] bg-[#FDFBF7] p-5 text-center dark:bg-[#20392F] dark:border-[#30483C]">
                  <p className="font-serif text-3xl font-bold text-[#17745A] dark:text-[#E6BC70]">15–40%</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[#192D2A] dark:text-[#F3F0E6]">Smart Markdowns</p>
                  <p className="mt-1 text-[11px] text-[#55524E] dark:text-[#B6C7BD]">Automated FEFO discounts</p>
                </div>
                <div className="rounded-2xl border border-[#DDD5C8] bg-[#FDFBF7] p-5 text-center dark:bg-[#20392F] dark:border-[#30483C]">
                  <p className="font-serif text-3xl font-bold text-[#17745A] dark:text-[#E6BC70]">100%</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[#192D2A] dark:text-[#F3F0E6]">Safe & Inspected</p>
                  <p className="mt-1 text-[11px] text-[#55524E] dark:text-[#B6C7BD]">Strict quality-checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — DELIVERY BENEFITS & TRUST (Forest Section #10221B)
          ========================================================================= */}
      <section className="border-b border-[#DDD5C8]/80 bg-[#FAF7F2] dark:bg-[#10221B] dark:border-[#30483C] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-[#20392F] dark:text-[#55D6A0] mb-4 shadow-xs">
                <Truck size={22} />
              </span>
              <h4 className="text-base font-bold text-[#192D2A] dark:text-[#F3F0E6]">Controlled Dispatch</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-[#666056] dark:text-[#B6C7BD] leading-relaxed">
                Delivered within 2 hours or in your chosen delivery slot.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-[#20392F] dark:text-[#E6BC70] mb-4 shadow-xs">
                <Lock size={22} />
              </span>
              <h4 className="text-base font-bold text-[#192D2A] dark:text-[#F3F0E6]">Doorstep Security PIN</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-[#666056] dark:text-[#B6C7BD] leading-relaxed">
                Every delivery requires a 4-digit customer handover OTP.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-[#20392F] dark:text-[#55D6A0] mb-4 shadow-xs">
                <RotateCcw size={22} />
              </span>
              <h4 className="text-base font-bold text-[#192D2A] dark:text-[#F3F0E6]">Quality Guarantee</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-[#666056] dark:text-[#B6C7BD] leading-relaxed">
                Instant refund or replacement if produce is imperfect.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-[#20392F] dark:text-[#55D6A0] mb-4 shadow-xs">
                <Package size={22} />
              </span>
              <h4 className="text-base font-bold text-[#192D2A] dark:text-[#F3F0E6]">Zero Plastic Liners</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-[#666056] dark:text-[#B6C7BD] leading-relaxed">
                Packed in breathable, biodegradable compostable paper.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
