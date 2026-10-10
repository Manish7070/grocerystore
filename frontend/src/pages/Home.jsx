import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChefHat, Clock, ShieldCheck, Heart, Truck, Award, Leaf, CheckCircle2, Star, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// Curated Category Tiles with High-Definition Live Imagery
const curatedCategories = [
  {
    name: 'Farm Produce',
    slug: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tagline: 'Harvested daily at peak ripeness',
    count: '32 Items',
    featured: true,
  },
  {
    name: 'Bakery & Grains',
    slug: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    tagline: 'Naturally fermented sourdough',
    count: '18 Items',
  },
  {
    name: 'Dairy & Breakfast',
    slug: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    tagline: 'A2 Desi milk & cultured ghee',
    count: '24 Items',
  },
  {
    name: 'Pantry Essentials',
    slug: 'Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    tagline: 'Aged basmati & stoneground atta',
    count: '42 Items',
  },
  {
    name: 'Cold Pressed Oils & Spices',
    slug: 'Oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    tagline: 'Single-estate virgin extraction',
    count: '28 Items',
  },
  {
    name: 'Orchard Fruits',
    slug: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    tagline: 'Himachal & Kashmir seasonal harvest',
    count: '26 Items',
  },
];

// Occasions for "Shop by Occasion"
const occasions = [
  {
    title: 'The Morning Table',
    desc: 'Cultured milk, stoneground muesli, organic berries, and raw forest honey.',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Weeknight Cooking',
    desc: 'Crisp green beans, tender paneer, aromatic whole spices, and aged grains.',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Artisan Pantry Restock',
    desc: 'Cold-pressed virgin oils, stone-milled flours, and unpolished heirloom lentils.',
    category: 'Rice',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Tea & Hearth Rituals',
    desc: 'Single-origin Assam leaves, green cardamom pods, and roasted dry fruits.',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
];

// Featured Recipe Kits preview
const recipeKitsPreview = [
  {
    title: 'Authentic Palak Paneer Basket',
    prepTime: '25 mins',
    servings: '3–4',
    price: 195,
    tag: 'Classic North Indian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    desc: 'Tender baby spinach, fresh artisanal paneer, desi ghee, garlic bulbs & whole garam masala.',
  },
  {
    title: 'Royal Fragrant Dum Biryani Kit',
    prepTime: '45 mins',
    servings: '4–5',
    price: 345,
    tag: 'Heritage Festive',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    desc: 'Aged long-grain Dehradun Basmati, whole spices, pure ghee, fried brown onions & fresh mint.',
  },
  {
    title: 'Morning Vitality Green Smoothie',
    prepTime: '10 mins',
    servings: '2',
    price: 165,
    tag: 'Energizing Blend',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80',
    desc: 'Organic bananas, tender baby spinach, chia seeds, cold-pressed almond milk & raw honey.',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

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

  // Filter curated products for "This Week's Market Edit" (6–8 items)
  const filteredEditProducts = products.filter((p) => {
    if (activeCategoryFilter === 'All') return true;
    return p.category === activeCategoryFilter;
  }).slice(0, 8);

  return (
    <div className="min-h-screen bg-porcelain text-espresso">
      {/* =========================================================================
          SECTION 02 — SIGNATURE EDITORIAL HERO: "Good food. Beautifully everyday."
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-sandstone px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left 45%: Editorial Typography & Narrative */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sandstone bg-ivory px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta shadow-subtle dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                <Sparkles size={13} />
                The Grocery Edit • Autumn Harvest
              </div>

              <h1 className="font-serif text-4xl font-normal tracking-tight text-espresso sm:text-6xl sm:leading-[1.1] lg:text-[68px] dark:text-ivory">
                Good food.<br />
                <span className="italic font-normal text-terracotta dark:text-apricot">Beautifully</span> everyday.
              </h1>

              <p className="mt-6 text-base font-normal leading-relaxed text-warmStone sm:text-lg max-w-lg dark:text-ivory/70">
                Carefully selected farm produce, pantry essentials, and everyday discoveries — delivered directly to your kitchen with uncompromising care.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory shadow-subtle transition-all duration-200 hover:bg-[#9C432A] hover:shadow-card active:scale-[0.99]"
                >
                  Explore The Market
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/bundles"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sandstone bg-ivory px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-espresso transition-all duration-200 hover:bg-sandstone/30 active:scale-[0.99] dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
                >
                  Shop Recipe Kits
                </Link>
              </div>

              {/* Editorial Trust Accents */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-sandstone pt-8 dark:border-white/10">
                <div>
                  <p className="font-serif text-2xl font-semibold text-espresso dark:text-ivory">40+</p>
                  <p className="mt-1 text-[11px] font-semibold text-warmStone dark:text-ivory/60">Partner Orchards</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-espresso dark:text-ivory">0%</p>
                  <p className="mt-1 text-[11px] font-semibold text-warmStone dark:text-ivory/60">Cold-Storage Artificials</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-espresso dark:text-ivory">2 Hr</p>
                  <p className="mt-1 text-[11px] font-semibold text-warmStone dark:text-ivory/60">Sealed Doorstep Slots</p>
                </div>
              </div>
            </div>

            {/* Right 55%: Curated Editorial Food Still Life */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-sandstone shadow-card dark:border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
                  alt="Curated fresh organic produce, sourdough bread, and virgin olive oil on rustic board"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
              </div>

              {/* Tactile Floating Provenance Badge */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-sandstone bg-ivory/95 p-4 shadow-floating backdrop-blur-md sm:block dark:bg-[#1D151A]/95 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta dark:bg-apricot/20 dark:text-apricot">
                    <Leaf size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-espresso dark:text-ivory">Daily Harvest Intake</p>
                    <p className="text-[11px] font-medium text-warmStone dark:text-ivory/60">Nashik Valley & Pune Mandis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 (cont.) — A BETTER WAY TO SHOP (3 Core Principles)
          ========================================================================= */}
      <section className="border-b border-sandstone bg-ivory px-4 py-12 sm:px-6 dark:bg-[#1D151A] dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3 md:divide-x md:divide-sandstone dark:md:divide-white/10">
            <div className="space-y-2 md:pr-8">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">01 • Source</span>
              <h3 className="font-serif text-lg font-semibold text-espresso dark:text-ivory">Carefully Selected</h3>
              <p className="text-xs leading-relaxed text-warmStone dark:text-ivory/70">
                Every batch of produce is evaluated at sunrise. We partner directly with verified independent farmers and artisan millers, cutting out multi-tier wholesale depots.
              </p>
            </div>
            <div className="space-y-2 md:px-8">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">02 • Delivery</span>
              <h3 className="font-serif text-lg font-semibold text-espresso dark:text-ivory">Delivered with Care</h3>
              <p className="text-xs leading-relaxed text-warmStone dark:text-ivory/70">
                Packed in breathable, temperature-sealed crates to safeguard fragile berries and fresh greens. Handed over with a unique 4-digit security PIN for verified doorstep assurance.
              </p>
            </div>
            <div className="space-y-2 md:pl-8">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">03 • Value</span>
              <h3 className="font-serif text-lg font-semibold text-espresso dark:text-ivory">Everyday Value</h3>
              <p className="text-xs leading-relaxed text-warmStone dark:text-ivory/70">
                Fair farmgate pricing paired with our zero-waste radar. Rescued near-expiry produce receives smart discounts, making mindful cooking accessible and sustainable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — CURATED MARKET CATEGORIES (Varied Editorial Tiles)
          ========================================================================= */}
      <section className="border-b border-sandstone px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">The Aisles</p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                Curated Market Departments
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta hover:underline dark:text-apricot"
            >
              Browse All 16 Categories →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {curatedCategories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-sandstone p-6 shadow-subtle transition-all duration-500 hover:border-terracotta/50 hover:shadow-card dark:border-white/10"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/30 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-apricot">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-ivory mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-ivory/80 mt-1 font-sans">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — THIS WEEK'S MARKET EDIT (Curated Selection from Live DB)
          ========================================================================= */}
      <section id="shop" className="border-b border-sandstone bg-ivory px-4 py-16 sm:px-6 lg:py-20 dark:bg-[#1D151A] dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">This Week's Edit</p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                Curated Farm Picks & Provisions
              </h2>
              <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">
                Carefully inspected batches arriving directly from Mandi auctions and organic farms this morning.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Rice'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCategoryFilter === cat
                      ? 'bg-terracotta text-ivory shadow-subtle'
                      : 'border border-sandstone bg-porcelain text-warmStone hover:border-espresso hover:text-espresso dark:bg-[#251D21] dark:border-white/10 dark:text-ivory/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-sandstone/30" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEditProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Direct CTA to full shop catalog */}
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-espresso bg-espresso px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory transition hover:bg-[#3E3632] dark:border-ivory dark:bg-ivory dark:text-espresso"
            >
              View Complete 240+ Item Catalog
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — SIGNATURE BRAND STORY: "The Everyday Shop, Thoughtfully Done."
          ========================================================================= */}
      <section id="story" className="border-b border-sandstone px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-sandstone shadow-card dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                alt="Early morning agricultural harvest in valley orchard"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Our Sourcing Manifesto</span>
              <h2 className="font-serif text-3xl font-normal leading-tight text-espresso sm:text-5xl dark:text-ivory">
                The everyday shop,<br />thoughtfully done.
              </h2>
              <p className="text-sm font-normal leading-relaxed text-warmStone dark:text-ivory/80">
                Most modern groceries travel through multiple holding warehouses, enduring gas-ripening and weeks of chemical preservation before reaching your shelf.
              </p>
              <p className="text-sm font-normal leading-relaxed text-warmStone dark:text-ivory/80">
                GroceryStore was built on a different covenant: we work with independent orchards in Himachal, organic vegetable growers in Pune and Nashik, and traditional cold-press millers. When produce is ordered, it is dispatched from fresh daily intakes, not stale freezer stacks.
              </p>
              <div className="pt-2 flex items-center gap-6">
                <div>
                  <p className="font-serif text-xl font-bold text-terracotta dark:text-apricot">100%</p>
                  <p className="text-[11px] font-semibold text-warmStone dark:text-ivory/60">Traceable Provenance</p>
                </div>
                <div className="h-8 w-[1px] bg-sandstone dark:bg-white/10" />
                <div>
                  <p className="font-serif text-xl font-bold text-terracotta dark:text-apricot">Zero</p>
                  <p className="text-[11px] font-semibold text-warmStone dark:text-ivory/60">Synthetic Preservatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — SEASONAL HARVEST CAMPAIGN
          ========================================================================= */}
      <section className="border-b border-sandstone bg-[#35272F] text-ivory px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-ivory/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-apricot">
                Autumn Harvest Release
              </span>
              <h2 className="font-serif text-3xl font-normal leading-tight sm:text-5xl">
                From the season.<br />For your table.
              </h2>
              <p className="text-sm font-normal leading-relaxed text-ivory/80 max-w-xl">
                Crisp Royal Gala apples from Kinnaur, sweet winter carrots, and aromatic cold-pressed mustard oil. Handpicked at peak sugar balance and dispatched within 24 hours of harvest.
              </p>
              <div className="pt-4">
                <Link
                  to="/shop?category=Fruits"
                  className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition"
                >
                  Shop Seasonal Arrivals
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ivory/15 shadow-floating">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
                alt="Autumn citrus and seasonal harvest"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — SHOP BY OCCASION
          ========================================================================= */}
      <section className="border-b border-sandstone px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Curated Moments</p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
              Shop by Kitchen Occasion
            </h2>
            <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">
              Thoughtfully curated ingredient baskets tailored to your daily cooking rituals.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((occ) => (
              <Link
                key={occ.title}
                to={`/shop?category=${encodeURIComponent(occ.category)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-sandstone bg-ivory shadow-subtle transition-all duration-300 hover:border-terracotta/40 hover:shadow-card dark:bg-[#1D151A] dark:border-white/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sandstone/30">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory">
                    {occ.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-warmStone leading-relaxed dark:text-ivory/70">
                    {occ.desc}
                  </p>
                  <span className="mt-auto pt-4 text-[11px] font-bold text-terracotta group-hover:underline dark:text-apricot">
                    Shop Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — RECIPE TO BASKET (Signature Cook Kits)
          ========================================================================= */}
      <section className="border-b border-sandstone bg-ivory px-4 py-16 sm:px-6 lg:py-20 dark:bg-[#1D151A] dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Culinary Discovery</p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                Tonight's Dinner, Already Thought Through.
              </h2>
              <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">
                Choose a recipe. We bundle all proportional farm ingredients together for 1-click addition.
              </p>
            </div>
            <Link
              to="/bundles"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta hover:underline dark:text-apricot"
            >
              Explore All Cook Kits →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recipeKitsPreview.map((kit) => (
              <div
                key={kit.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-sandstone bg-porcelain shadow-subtle transition-all duration-300 hover:border-terracotta/40 hover:shadow-card dark:bg-[#251D21] dark:border-white/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sandstone/30">
                  <img
                    src={kit.image}
                    alt={kit.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-ivory/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-espresso dark:bg-[#1D151A] dark:text-ivory">
                    {kit.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-warmStone dark:text-ivory/60 mb-2">
                    <span className="flex items-center gap-1"><Clock size={12} /> {kit.prepTime}</span>
                    <span>•</span>
                    <span>Serves {kit.servings}</span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory">
                    {kit.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-warmStone leading-relaxed line-clamp-2 dark:text-ivory/70">
                    {kit.desc}
                  </p>
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-sandstone/60 dark:border-white/10">
                    <span className="font-serif text-lg font-bold text-espresso dark:text-ivory">
                      ₹{kit.price}
                    </span>
                    <Link
                      to="/bundles"
                      className="rounded-lg bg-terracotta px-4 py-2 text-xs font-bold text-ivory hover:bg-[#9C432A] transition"
                    >
                      Shop This Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — FRESHNESS & RESPONSIBLE SHOPPING (Waste Radar & Savings)
          ========================================================================= */}
      <section className="border-b border-sandstone px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-sandstone bg-ivory p-8 sm:p-12 shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Responsible Sourcing</span>
                <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                  Less Waste. More Everyday Value.
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-warmStone max-w-xl dark:text-ivory/70">
                  Every grocery store deals with near-expiry stock. Instead of quietly dumping nutritious food, our intelligent Freshness Radar applies transparent 15% to 40% automated markdowns on eligible safe batches. You save more, and less food goes to landfill.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Link
                    to="/waste-center"
                    className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition"
                  >
                    Explore Smart Savings
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-sandstone bg-porcelain p-4 text-center dark:bg-[#251D21] dark:border-white/10">
                  <p className="font-serif text-2xl font-bold text-terracotta dark:text-apricot">15–40%</p>
                  <p className="mt-1 text-[11px] font-medium text-warmStone dark:text-ivory/60">Genuine Markdowns</p>
                </div>
                <div className="rounded-xl border border-sandstone bg-porcelain p-4 text-center dark:bg-[#251D21] dark:border-white/10">
                  <p className="font-serif text-2xl font-bold text-terracotta dark:text-apricot">100%</p>
                  <p className="mt-1 text-[11px] font-medium text-warmStone dark:text-ivory/60">Safe & Legally Saleable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — CUSTOMER CONFIDENCE & CARE
          ========================================================================= */}
      <section className="border-b border-sandstone bg-ivory px-4 py-16 sm:px-6 dark:bg-[#1D151A] dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-porcelain border border-sandstone text-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                <Truck size={18} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-espresso dark:text-ivory">Controlled Dispatch</h4>
                <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">Delivered within 2 hours or in your chosen morning slot.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-porcelain border border-sandstone text-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-espresso dark:text-ivory">Doorstep Security PIN</h4>
                <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">Every delivery requires a 4-digit customer handover OTP.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-porcelain border border-sandstone text-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                <Award size={18} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-espresso dark:text-ivory">Quality Guarantee</h4>
                <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">No-questions-asked instant refund if produce is imperfect.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-porcelain border border-sandstone text-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                <Leaf size={18} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-espresso dark:text-ivory">Zero Plastic Liners</h4>
                <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">Packed in biodegradable compostable paper & jute crates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11 — THE GROCERY JOURNAL (Editorial Articles)
          ========================================================================= */}
      <section className="border-b border-sandstone px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta dark:text-apricot">Kitchen Journal</p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                Notes on Food & Hearth
              </h2>
            </div>
            <span className="text-xs text-warmStone dark:text-ivory/60">Weekly culinary dispatches</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="group flex flex-col overflow-hidden rounded-2xl border border-sandstone bg-ivory shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <div className="aspect-[16/10] overflow-hidden bg-sandstone/30">
                <img
                  src="https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80"
                  alt="Organized pantry jar collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta dark:text-apricot">Pantry Guide</span>
                <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory mt-1">
                  How to Build a Better Weekly Grocery List
                </h3>
                <p className="mt-1.5 text-xs text-warmStone leading-relaxed dark:text-ivory/70">
                  Structuring your weekly provisions around 5 core staples to minimize mid-week frantic runs and food waste.
                </p>
              </div>
            </article>

            <article className="group flex flex-col overflow-hidden rounded-2xl border border-sandstone bg-ivory shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <div className="aspect-[16/10] overflow-hidden bg-sandstone/30">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh leafy greens and herbs"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta dark:text-apricot">Harvest Care</span>
                <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory mt-1">
                  Simple Ways to Keep Leafy Greens Fresh
                </h3>
                <p className="mt-1.5 text-xs text-warmStone leading-relaxed dark:text-ivory/70">
                  Why cold water shock baths and breathable cotton towels double the crispness of tender coriander and baby spinach.
                </p>
              </div>
            </article>

            <article className="group flex flex-col overflow-hidden rounded-2xl border border-sandstone bg-ivory shadow-subtle dark:bg-[#1D151A] dark:border-white/10">
              <div className="aspect-[16/10] overflow-hidden bg-sandstone/30">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                  alt="Freshly baked artisan sourdough loaf"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta dark:text-apricot">Baking Craft</span>
                <h3 className="font-serif text-base font-semibold text-espresso dark:text-ivory mt-1">
                  Five Easy Meals for Busy Evenings
                </h3>
                <p className="mt-1.5 text-xs text-warmStone leading-relaxed dark:text-ivory/70">
                  Quick 20-minute skillet preparations using fresh paneer, crisp broccoli, and pantry dry spices.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — CLOSING BRAND STATEMENT
          ========================================================================= */}
      <section className="px-4 py-20 sm:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-3xl font-normal text-espresso sm:text-5xl dark:text-ivory">
            Good food belongs in every home.
          </p>
          <p className="mt-4 text-xs font-normal leading-relaxed text-warmStone max-w-md mx-auto dark:text-ivory/70">
            Thoughtfully sourced from certified grower partners, carefully packed, and delivered on time.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory shadow-subtle hover:bg-[#9C432A] transition"
            >
              Start Your Grocery Shop
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
