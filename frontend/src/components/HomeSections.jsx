import { ArrowRight, BadgePercent, Clock, ShieldCheck, ShoppingBasket, Truck, Sparkles, ChefHat, Leaf, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductArtwork from './ProductArtwork';

const categoryCards = [
  { name: 'Fruits', title: 'Fresh Fruits', accent: 'text-orange-700' },
  { name: 'Vegetables', title: 'Fresh Vegetables', accent: 'text-emerald-700' },
  { name: 'Dairy', title: 'Dairy Essentials', accent: 'text-sky-700' },
  { name: 'Beverages', title: 'Cold Beverages', accent: 'text-cyan-700' },
  { name: 'Snacks', title: 'Healthy Snacks', accent: 'text-amber-700' },
  { name: 'Rice', title: 'Rice & Grains', accent: 'text-stone-700' },
];

const promises = [
  { icon: Truck, title: 'Express Delivery', text: '30-45 min doorstep slots' },
  { icon: Leaf, title: 'Farm Harvested', text: 'Daily checked produce' },
  { icon: BadgePercent, title: 'Zero Food Waste', text: 'Smart expiry markdowns' },
  { icon: ShieldCheck, title: 'Verified Payment', text: 'COD or Razorpay' },
];

const shoppingSteps = [
  { icon: ShoppingBasket, number: '01', title: 'Fill your basket', text: 'Browse 240+ certified organic produce & pantry staples.' },
  { icon: Clock, number: '02', title: 'Select slot & OTP', text: 'Choose express 30–45 min delivery or scheduled morning slots.' },
  { icon: Truck, number: '03', title: 'Doorstep handover', text: 'Verify your 4-digit security OTP with our delivery partner.' },
];

const HomeSections = ({ products = [], onCategorySelect }) => {
  const navigate = useNavigate();
  const offers = products.filter((p) => p.discount >= 10).slice(0, 4);

  return (
    <>
      {/* 4 Pillars Trust Strip */}
      <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 rounded-[1.75rem] border border-emerald-900/10 bg-white p-5 shadow-[0_12px_35px_rgba(38,58,34,0.05)] transition hover:-translate-y-1 hover:shadow-md dark:bg-[#14231a] dark:border-white/10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Icon size={22} />
            </span>
            <div>
              <p className="font-black text-stone-900 dark:text-white text-base">{title}</p>
              <p className="text-xs font-semibold text-stone-500">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Differentiator Highlight Banner: Freshness & Waste Reduction */}
      <section className="mb-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#192D2A] via-[#243B37] to-[#192D2A] p-8 text-white shadow-xl lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black tracking-wider uppercase text-[#D9A441] backdrop-blur">
              <Sparkles size={14} />
              What Makes Us Truly Different?
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Freshness Radar & Zero-Waste Guarantee
            </h2>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#E7E2D9]">
              Normal supermarkets discard expiring food. At TaazaDaily, our intelligent batch management system tracks harvest expiry dates and offers automatic smart markdown discounts—saving you money while reducing food waste to zero.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/waste-center"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-emerald-900 shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Inspect Freshness Radar
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/bundles"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                <ChefHat size={17} />
                Explore 1-Click Recipe Kits
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <HeartHandshake className="text-emerald-300" size={20} />
              Direct Farm Transparency
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-emerald-100">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 font-black">✓</span>
                <span>Harvested within 24 hours from partner orchards in Nashik & Himachal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 font-black">✓</span>
                <span>Zero chemical ripening — natural cold-chain preservation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 font-black">✓</span>
                <span>Real doorstep security OTP verification with delivery executive.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3 Step Shopping Journey */}
      <section className="mb-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#192D2A] px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D9A441]">Effortless Commerce</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">From harvest soil to your kitchen in 3 steps</h2>
          </div>
          <p className="max-w-md text-xs font-medium leading-relaxed text-[#E7E2D9]">
            Fewer taps, transparent Indian Rupee pricing, and a checkout that works with Cash on Delivery or Razorpay.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {shoppingSteps.map(({ icon: Icon, number, title, text }) => (
            <div key={number} className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A441] text-[#242321]">
                  <Icon size={22} />
                </span>
                <span className="text-sm font-black tracking-[0.2em] text-white/30">{number}</span>
              </div>
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#E7E2D9]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category Grid */}
      <section className="mb-16 rounded-[2.5rem] bg-white p-6 shadow-sm border border-[#E9DDCA] dark:bg-[#14231a] dark:border-white/10 sm:p-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-black uppercase tracking-[0.28em] text-[#C66B42]">Curated Aisles</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#242321] dark:text-white sm:text-4xl">
            Shop by Fresh Category
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C66B42]" />
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-stone-500">
            Carefully curated daily staples and farm picks organized for effortless discovery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categoryCards.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => {
                if (onCategorySelect) onCategorySelect(category.name);
                else navigate(`/shop?category=${encodeURIComponent(category.name)}`);
              }}
              className="group text-center outline-none p-3 rounded-2xl transition hover:bg-stone-50 dark:hover:bg-white/5"
            >
              <span className="mx-auto block aspect-square w-full max-w-36 overflow-hidden rounded-2xl bg-stone-100 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                <ProductArtwork
                  product={{ name: category.title, category: category.name }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </span>
              <span className={`mt-3 block text-sm font-black ${category.accent}`}>{category.title}</span>
              <span className="mt-1 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-stone-400 group-hover:text-[#C66B42]">
                Explore Aisle
                <ArrowRight size={11} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* First Order Offer Banner */}
      <section className="mb-14 rounded-[2.5rem] bg-[#F6F0E5] p-6 sm:p-10 border border-[#E9DDCA] dark:bg-[#1A2322] dark:border-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#C66B42]">Welcome Gift</span>
            <h2 className="mt-1 text-2xl font-black text-[#242321] tracking-tight dark:text-white sm:text-3xl">
              Get ₹50 OFF Your First Grocery Basket!
            </h2>
            <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">
              Use code <strong className="font-mono text-[#C66B42] font-black">WELCOME50</strong> during checkout on orders above ₹199.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C66B42] px-8 py-3.5 text-sm font-black text-white hover:bg-[#B9583D] transition shadow-md shrink-0"
          >
            Claim Offer & Shop Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Deals Row */}
      {offers.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500">Limited-Time Markdown</span>
              <h2 className="mt-1 text-2xl font-black text-stone-900 tracking-tight dark:text-white sm:text-3xl">
                Fresh Deals of the Day
              </h2>
            </div>
            <Link to="/shop?sort=discount" className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
              View All Deals <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default HomeSections;
