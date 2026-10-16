import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Leaf,
  TrendingDown,
  Lock,
  RotateCcw,
  Package,
  ChevronLeft,
  ChevronRight,
  Zap,
  MapPin,
  BadgePercent,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HyperlocalConnect from '../components/HyperlocalConnect';
import { productsAPI } from '../utils/api';

/* ─── HERO SLIDES ───────────────────────────────────────────────────────── */
const heroSlides = [
  {
    id: 0,
    badge: '100% Farm to Doorstep',
    badgeEmoji: '🌿',
    headline: ["Nature's Finest,", "Your Kitchen's", 'Best Friend'],
    subtext:
      'Harvest-fresh vegetables, artisanal dairy and organic pantry staples — dispatched within 2 hours with verified cold-chain.',
    cta: { label: 'Shop Fresh Now', to: '/shop' },
    secondCta: { label: 'Recipe Kits', to: '/bundles' },
    accentDark: '#55D6A0',
    bgLight: 'linear-gradient(135deg, #0B2A1E 0%, #164A32 35%, #1C6040 60%, #0E3526 100%)',
    bgDark: 'linear-gradient(135deg, #061410 0%, #0D2A1C 35%, #122A20 60%, #071510 100%)',
    image:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1400&q=90',
    floatBadge: { icon: '🥬', label: 'Grade A+ Produce', sub: 'Evaluated Daily' },
    stats: [
      { v: '40+', l: 'Partner Farms' },
      { v: '2hr', l: 'Cold-Chain' },
      { v: '0', l: 'Preservatives' },
    ],
    orbColor1: 'rgba(23,116,90,0.35)',
    orbColor2: 'rgba(217,164,65,0.20)',
  },
  {
    id: 1,
    badge: 'Seasonal Harvest Edition',
    badgeEmoji: '🍊',
    headline: ['Orchard Ripe,', 'Delivered Before', 'Sunrise.'],
    subtext:
      'Straight from Himachal orchards and Nashik vineyards. Each fruit hand-sorted at peak ripeness — never gas-ripened.',
    cta: { label: 'Explore Fruits', to: '/shop?category=Fruits' },
    secondCta: { label: 'View All Deals', to: '/shop?sort=discount' },
    accentDark: '#E6BC70',
    bgLight: 'linear-gradient(135deg, #2A1205 0%, #4A220A 35%, #5C2E10 60%, #321608 100%)',
    bgDark: 'linear-gradient(135deg, #180A02 0%, #2A1205 35%, #321608 60%, #1A0B03 100%)',
    image:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1400&q=90',
    floatBadge: { icon: '🍑', label: 'Peak Harvest', sub: 'Nashik and Himachal' },
    stats: [
      { v: '60+', l: 'Fruit Varieties' },
      { v: '24h', l: 'Harvest to Door' },
      { v: '100%', l: 'Natural Ripening' },
    ],
    orbColor1: 'rgba(198,107,66,0.35)',
    orbColor2: 'rgba(217,164,65,0.20)',
  },
  {
    id: 2,
    badge: 'Artisan Dairy Collection',
    badgeEmoji: '🥛',
    headline: ['Pure. Cultured.', 'Crafted by', 'Expert Millers.'],
    subtext:
      'Whole milk from grass-fed cows, traditionally churned white butter, cold-pressed virgin coconut oil and heritage ghee.',
    cta: { label: 'Shop Dairy', to: '/shop?category=Dairy' },
    secondCta: { label: 'Smart Savings', to: '/smart-savings' },
    accentDark: '#5EC4E8',
    bgLight: 'linear-gradient(135deg, #051A26 0%, #0B3045 35%, #0E3D58 60%, #061C2A 100%)',
    bgDark: 'linear-gradient(135deg, #020D14 0%, #061A24 35%, #091F2E 60%, #030F1A 100%)',
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1400&q=90',
    floatBadge: { icon: '🧈', label: 'Grass-Fed Dairy', sub: 'Traditional Churning' },
    stats: [
      { v: '15+', l: 'Dairy Products' },
      { v: 'A2', l: 'Milk Grade' },
      { v: 'Zero', l: 'Additives' },
    ],
    orbColor1: 'rgba(14,107,138,0.35)',
    orbColor2: 'rgba(85,214,160,0.20)',
  },
];

/* ─── CATEGORIES ─────────────────────────────────────────────────────────── */
const curatedCategories = [
  { name: 'Farm Vegetables', slug: 'Vegetables', emoji: '🥦', tagline: 'Harvested daily from partner farms', count: '15+', color: '#16A34A', bg: '#DCFCE7', darkBg: '#052e16' },
  { name: 'Artisan Bakery', slug: 'Bakery', emoji: '🍞', tagline: 'Naturally fermented sourdough', count: '12+', color: '#D97706', bg: '#FEF3C7', darkBg: '#451a03' },
  { name: 'Dairy Essentials', slug: 'Dairy', emoji: '🥛', tagline: 'Fresh whole milk, ghee and butter', count: '18+', color: '#0891B2', bg: '#CFFAFE', darkBg: '#0c3040' },
  { name: 'Heirloom Grains', slug: 'Rice', emoji: '🌾', tagline: 'Aged basmati and stoneground grains', count: '10+', color: '#A16207', bg: '#FEF9C3', darkBg: '#422006' },
  { name: 'Oils and Spices', slug: 'Oils', emoji: '🧄', tagline: 'Virgin extractions and aromatics', count: '20+', color: '#DC2626', bg: '#FEE2E2', darkBg: '#3f0000' },
  { name: 'Orchard Fruits', slug: 'Fruits', emoji: '🍎', tagline: 'Peak-harvest orchard selection', count: '25+', color: '#E11D48', bg: '#FFE4E6', darkBg: '#4c0519' },
];

/* ─── RECIPE KITS ────────────────────────────────────────────────────────── */
const recipeKitsPreview = [
  { title: 'Desi Palak Paneer Kit', prepTime: '25 mins', servings: '3-4', price: 200, tag: 'Farm-Fresh Classic', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', desc: 'Tender baby spinach, fresh artisanal paneer, cold-pressed ghee, garlic bulbs and whole aromatic spices.' },
  { title: 'Royal Dum Biryani Essentials', prepTime: '40 mins', servings: '4-5', price: 890, tag: 'Heritage Kitchen', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', desc: 'Aged long-grain basmati rice, pure cow ghee, red onions, ginger root, and royal whole spices.' },
  { title: 'Morning Energy Smoothie Kit', prepTime: '5 mins', servings: '2', price: 170, tag: 'Quick Breakfast', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', desc: 'Fresh Cavendish bananas, chilled whole milk, and rich probiotic Greek yogurt.' },
];

/* ─── TRUST PILLARS ──────────────────────────────────────────────────────── */
const trustPillars = [
  { icon: Truck, label: 'Express Delivery', sub: '30-45 min guaranteed slots', color: '#17745A', bg: 'rgba(23,116,90,0.12)' },
  { icon: Leaf, label: 'Farm Harvested', sub: 'Grade A+ daily evaluation', color: '#16A34A', bg: 'rgba(22,163,74,0.12)' },
  { icon: BadgePercent, label: 'Zero Waste Policy', sub: 'Smart expiry markdowns', color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  { icon: ShieldCheck, label: 'Verified Handover', sub: 'OTP-secured delivery PIN', color: '#0891B2', bg: 'rgba(8,145,178,0.12)' },
];

/* ─── DELIVERY BENEFITS ─────────────────────────────────────────────────── */
const deliveryBenefits = [
  { icon: Truck, label: 'Controlled Dispatch', desc: 'Within 2 hours or your chosen scheduled delivery slot.', iconBg: '#DCFCE7', iconBgDark: '#052e16', iconColor: '#16A34A', iconColorDark: '#4ade80' },
  { icon: Lock, label: 'Doorstep Security PIN', desc: 'Every delivery requires a 4-digit OTP customer handover.', iconBg: '#FEF3C7', iconBgDark: '#451a03', iconColor: '#D97706', iconColorDark: '#fbbf24' },
  { icon: RotateCcw, label: 'Quality Guarantee', desc: 'Instant refund or replacement if produce is imperfect.', iconBg: '#E0F2FE', iconBgDark: '#0c3040', iconColor: '#0891B2', iconColorDark: '#38bdf8' },
  { icon: Package, label: 'Zero Plastic Liners', desc: 'Packed in breathable, 100% biodegradable compostable paper.', iconBg: '#CCFBF1', iconBgDark: '#042f2e', iconColor: '#0D9488', iconColorDark: '#2dd4bf' },
];

/* ══════════════════════════════════════════════════════════════════════════
   HOME COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  /* Detect dark mode */
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* Products fetch */
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
    return () => { active = false; };
  }, []);

  const filteredEditProducts = products
    .filter((p) => {
      if (activeCategoryFilter === 'All') return !['Pet Care', 'Household', 'Personal Care'].includes(p.category);
      return p.category === activeCategoryFilter;
    })
    .slice(0, 12);

  /* Slide Navigation */
  const goToSlide = useCallback(
    (idx) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSlide(idx);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % heroSlides.length);
  }, [activeSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [activeSlide, goToSlide]);

  /* Auto-play */
  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 5500);
    return () => clearInterval(autoPlayRef.current);
  }, [nextSlide]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    autoPlayRef.current = setInterval(nextSlide, 5500);
  };

  const slide = heroSlides[activeSlide];
  const currentBg = isDark ? slide.bgDark : slide.bgLight;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#192D2A] dark:bg-[#0B1714] dark:text-[#F3F0E6] transition-colors duration-300 overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          HERO SLIDER
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: 'clamp(520px, 88vh, 820px)',
          background: currentBg,
          transition: 'background 0.9s cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {/* Animated ambient orbs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[120px] opacity-60 transition-all duration-1000"
          style={{ background: slide.orbColor1 }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-[100px] opacity-50 transition-all duration-1000"
          style={{ background: slide.orbColor2 }}
        />
        {/* Dot-grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Slide content */}
        <div
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center"
          style={{ minHeight: 'clamp(520px, 88vh, 820px)' }}
        >
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 py-16 lg:py-20">

            {/* LEFT — Text */}
            <div
              style={{
                animation: isTransitioning
                  ? 'none'
                  : 'heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.35s ease',
              }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md mb-6 shadow-lg">
                <span className="text-base leading-none">{slide.badgeEmoji}</span>
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-white leading-[1.1] tracking-tight">
                {slide.headline[0]}
                <br />
                <span style={{ color: slide.accentDark }}>{slide.headline[1]}</span>
                <br />
                {slide.headline[2]}
              </h1>

              {/* Subtext */}
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-white/72 max-w-lg">
                {slide.subtext}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={slide.cta.to}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98]"
                  style={{ background: slide.accentDark, color: '#0B1714' }}
                >
                  {slide.cta.label}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to={slide.secondCta.to}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {slide.secondCta.label}
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex items-center gap-8 border-t border-white/15 pt-8">
                {slide.stats.map((s) => (
                  <div key={s.l}>
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-white">{s.v}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/55">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Image */}
            <div className="relative flex items-center justify-center">
              <div
                className="relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transition: 'opacity 0.35s ease',
                  animation: isTransitioning ? 'none' : 'heroImageIn 0.85s cubic-bezier(0.22,1,0.36,1) both 0.12s',
                }}
              >
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.headline.join(' ')}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Float badge */}
              <div
                className="absolute -bottom-5 left-2 hidden sm:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-3.5 shadow-2xl"
                style={{ animation: 'floatBadge 3.2s ease-in-out infinite' }}
              >
                <span className="text-2xl">{slide.floatBadge.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white leading-none">{slide.floatBadge.label}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">{slide.floatBadge.sub}</p>
                </div>
              </div>

              {/* Live stock indicator */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 shadow-xl">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white">Live Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slider navigation */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeSlide ? '28px' : '8px',
                  height: '8px',
                  background:
                    i === activeSlide ? slide.accentDark : 'rgba(255,255,255,0.38)',
                }}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/10">
          <div
            key={activeSlide}
            className="h-full rounded-full"
            style={{
              background: slide.accentDark,
              animation: 'progressBar 5.5s linear forwards',
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRUST STRIP (Glassmorphism Floating Cards)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-5 px-4 sm:px-6 pb-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {trustPillars.map(({ icon: Icon, label, sub, color, bg }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-2xl border border-[#DDD5C8] bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#172C24]/95 dark:border-[#30483C]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: bg, color }}
                >
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#192D2A] dark:text-white leading-tight">{label}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#625F59] dark:text-[#B6C7BD] leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THREE CORE VALUE CARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DDD5C8]/80 bg-[#F7F4EE] px-4 py-16 sm:px-6 lg:py-20 dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { num: '01', tag: 'Verified Source', title: 'Carefully Selected', icon: Leaf, color: '#17745A', desc: 'Every batch evaluated at sunrise. We partner directly with 40+ verified independent farmers and artisan millers, cutting out multi-tier wholesale depots.' },
              { num: '02', tag: 'Cold-Chain Care', title: 'Delivered with Care', icon: ShieldCheck, color: '#0891B2', desc: 'Packed in breathable, temperature-sealed crates. Handed over with a unique 4-digit security PIN for verified doorstep assurance.' },
              { num: '03', tag: 'Honest Economics', title: 'Everyday Value', icon: TrendingDown, color: '#D97706', desc: 'Fair farmgate pricing paired with our zero-waste radar. Near-expiry produce gets smart discounts — making sustainable cooking truly accessible.' },
            ].map(({ num, tag, title, icon: Icon, color, desc }) => (
              <div
                key={num}
                className="group relative overflow-hidden rounded-3xl border border-[#DDD5C8] bg-white p-7 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F]"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ background: color + '25' }}
                />
                <span
                  className="absolute top-5 right-5 font-serif text-7xl font-black opacity-[0.04] dark:opacity-[0.07] select-none"
                  style={{ color }}
                >
                  {num}
                </span>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: color + '18', color }}
                >
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                  {num} · {tag}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#192D2A] mt-1.5 mb-2.5 dark:text-[#F3F0E6]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#625F59] dark:text-[#B6C7BD]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HYPERLOCAL CONNECT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HyperlocalConnect />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORY SHOWCASE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-14 sm:px-6 lg:py-20 bg-[#FDFBF7] dark:bg-[#0B1714] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#17745A] dark:text-[#55D6A0]">
                Curated Aisles
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#192D2A] dark:text-[#F3F0E6] sm:text-4xl">
                Shop Fresh Category
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-[#17745A] dark:bg-[#55D6A0]" />
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17745A] hover:underline dark:text-[#55D6A0] self-start sm:self-auto"
            >
              All Categories <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {curatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col items-center gap-3 rounded-3xl border border-[#DDD5C8] bg-white p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F] overflow-hidden"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm"
                  style={{ background: isDark ? cat.darkBg : cat.bg }}
                >
                  {cat.emoji}
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-[#192D2A] dark:text-white leading-tight">{cat.name}</p>
                  <p className="mt-0.5 text-[10px] text-[#625F59] dark:text-[#B6C7BD]">{cat.count} varieties</p>
                </div>
                {/* Highlight ring on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${cat.color}55` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THIS WEEK'S MARKET EDIT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-14 sm:px-6 lg:py-18 bg-[#F7F4EE] dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#17745A] dark:text-[#55D6A0]">
                The Edit
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                This Week's Market Provisions
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Pulses', 'Rice', 'Bakery', 'Snacks'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      activeCategoryFilter === cat
                        ? 'bg-[#17745A] text-white shadow-sm scale-105 dark:bg-[#55D6A0] dark:text-[#0B1714] dark:font-bold'
                        : 'border border-[#DDD5C8] bg-white text-[#55524E] hover:border-[#17745A] hover:text-[#17745A] dark:bg-[#172C24] dark:text-[#B6C7BD] dark:border-[#30483C] dark:hover:border-[#55D6A0]/50'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-white border border-[#DDD5C8] animate-pulse dark:bg-[#172C24] dark:border-[#30483C]"
                />
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
              className="btn-motion inline-flex items-center gap-2 rounded-2xl bg-[#192D2A] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#253D39] dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E] dark:hover:shadow-[0_4px_20px_rgba(85,214,160,0.3)]"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOURCING STORY
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="story"
        className="relative overflow-hidden border-b border-[#DDD5C8]/80 dark:border-[#30483C] bg-[#0E1A17] dark:bg-[#0B1714] text-white px-4 py-16 sm:px-6 lg:py-24"
      >
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1714]/98 via-[#0B1714]/85 to-[#0B1714]/95" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer harvesting fresh organic produce"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-black/50 backdrop-blur-md px-4 py-2.5">
                <MapPin size={14} className="text-[#55D6A0] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Nashik and Himachal Pradesh</p>
                  <p className="text-[10px] text-white/55">Our primary farm partners</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-800/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                Our Sourcing Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                The everyday shop,
                <br />
                <span className="italic text-[#55D6A0]">thoughtfully</span> done.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-white/68">
                Most modern groceries travel through multiple holding warehouses, enduring gas-ripening and weeks of chemical preservation before reaching your shelf.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-white/68">
                TaazaDaily was built differently: direct from independent orchards in Himachal, organic growers in Pune and Nashik, and traditional cold-press millers. No artificial agents. No stale freezer stacks.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4">
                {[
                  { v: '100%', l: 'Traceable Provenance', s: 'Direct farmer relationships' },
                  { v: 'Zero', l: 'Synthetic Preservatives', s: 'No artificial ripening gases' },
                ].map(({ v, l, s }) => (
                  <div
                    key={l}
                    className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm"
                  >
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D9A441]">{v}</p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-white">{l}</p>
                    <p className="text-[10px] text-white/52 mt-0.5">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          1-CLICK RECIPE KITS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-14 sm:px-6 lg:py-20 bg-[#FDFBF7] dark:bg-[#10221B] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#17745A] dark:text-[#55D6A0]">
                Culinary Studio
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                1-Click Recipe Cook Kits
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-[#17745A] dark:bg-[#55D6A0]" />
            </div>
            <Link
              to="/bundles"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17745A] hover:underline dark:text-[#55D6A0] self-start sm:self-auto"
            >
              All Recipe Kits <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recipeKitsPreview.map((kit) => (
              <div
                key={kit.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#DDD5C8] bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 dark:bg-[#172C24] dark:border-[#30483C] dark:hover:bg-[#20392F]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={kit.image}
                    alt={kit.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#192D2A] shadow-sm backdrop-blur dark:bg-[#172C24]/90 dark:text-[#F3F0E6] dark:border dark:border-[#30483C]">
                      <Clock size={11} className="text-[#17745A] dark:text-[#55D6A0]" /> {kit.prepTime}
                    </span>
                    <span className="rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#192D2A] shadow-sm backdrop-blur dark:bg-[#172C24]/90 dark:text-[#F3F0E6] dark:border dark:border-[#30483C]">
                      {kit.servings} servings
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#17745A] dark:text-[#55D6A0]">
                    {kit.tag}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#192D2A] mt-1 dark:text-[#F3F0E6]">
                    {kit.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#55524E] leading-relaxed dark:text-[#B6C7BD] flex-1">
                    {kit.desc}
                  </p>
                  <div className="mt-4 pt-4 flex items-center justify-between border-t border-[#DDD5C8]/60 dark:border-[#30483C]">
                    <span className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                      Rs.{kit.price}
                    </span>
                    <Link
                      to="/bundles"
                      className="btn-motion rounded-xl bg-[#192D2A] px-4 py-2 text-xs font-bold text-white hover:bg-[#253D39] transition dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E]"
                    >
                      View Kit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SMART SAVINGS / FRESHNESS RADAR
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DDD5C8]/80 px-4 py-14 sm:px-6 lg:py-20 bg-[#F7F4EE] dark:bg-[#0B1714] dark:border-[#30483C]">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#DDD5C8] bg-white p-8 sm:p-12 shadow-sm dark:bg-[#172C24] dark:border-[#30483C]">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-[#55D6A0]/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl dark:bg-[#E6BC70]/10" />

            <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-[#20392F] px-3 py-1 text-xs font-black text-emerald-800 dark:text-[#55D6A0]">
                  <Zap size={11} /> Zero Food Waste Mission
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
                  Less Waste. More Everyday Value.
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#55524E] max-w-xl dark:text-[#B6C7BD]">
                  Instead of letting fresh produce spoil in warehouses, our automated Freshness Radar marks down near-expiry batches by 15%-40%. You save money, and nutritious food is rescued from going to waste.
                </p>
                <Link
                  to="/smart-savings"
                  className="btn-motion mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#17745A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#135E49] transition shadow-sm dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E]"
                >
                  Explore Smart Savings <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '15-40%', l: 'Smart Markdowns', s: 'Automated FEFO discounts' },
                  { v: '100%', l: 'Safe and Inspected', s: 'Strict quality-checked' },
                  { v: 'Zero', l: 'Food Wasted', s: 'Rescue-first policy' },
                  { v: 'Daily', l: 'Batch Rotation', s: 'FIFO + FEFO hybrid' },
                ].map(({ v, l, s }) => (
                  <div
                    key={l}
                    className="rounded-2xl border border-[#DDD5C8] bg-[#FDFBF7] p-4 text-center dark:bg-[#20392F] dark:border-[#30483C]"
                  >
                    <p className="font-serif text-2xl font-bold text-[#17745A] dark:text-[#E6BC70]">{v}</p>
                    <p className="mt-0.5 text-xs font-black text-[#192D2A] dark:text-[#F3F0E6]">{l}</p>
                    <p className="mt-0.5 text-[10px] text-[#55524E] dark:text-[#B6C7BD]">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WELCOME OFFER BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-6 bg-[#FDFBF7] dark:bg-[#10221B]">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#192D2A] via-[#243B37] to-[#192D2A] p-8 sm:p-12 text-white shadow-2xl">
            <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#17745A]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-[#D9A441]/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <span className="inline-block rounded-full border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#D9A441]">
                  Welcome Gift
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Get Rs.50 OFF Your First Grocery Basket!
                </h2>
                <p className="mt-2 text-sm text-white/68">
                  Use code{' '}
                  <span className="font-mono font-black text-[#D9A441] bg-[#D9A441]/10 px-2 py-0.5 rounded-md">
                    WELCOME50
                  </span>{' '}
                  on orders above Rs.199.
                </p>
              </div>
              <Link
                to="/shop"
                className="btn-motion inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#D9A441] px-8 py-4 text-sm font-black text-[#0B1714] shadow-xl hover:bg-[#C8933A] transition shrink-0"
              >
                Claim Offer and Shop Now
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DELIVERY TRUST BENEFITS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#DDD5C8]/80 bg-[#FAF7F2] dark:bg-[#10221B] dark:border-[#30483C] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#17745A] dark:text-[#55D6A0]">
              Our Promise
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
              Why TaazaDaily?
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryBenefits.map(({ icon: Icon, label, desc, iconBg, iconBgDark, iconColor, iconColorDark }) => (
              <div
                key={label}
                className="group rounded-3xl border border-[#E2DBD0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    background: isDark ? iconBgDark : iconBg,
                    color: isDark ? iconColorDark : iconColor,
                  }}
                >
                  <Icon size={22} />
                </span>
                <h4 className="text-sm font-black text-[#192D2A] dark:text-[#F3F0E6]">{label}</h4>
                <p className="mt-1.5 text-xs sm:text-sm text-[#666056] dark:text-[#B6C7BD] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          KEYFRAME ANIMATIONS
      ═══════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroImageIn {
          from { opacity: 0; transform: scale(0.94) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Home;
