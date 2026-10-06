import { ArrowRight, BadgePercent, Clock, PackageCheck, ShieldCheck, ShoppingBasket, Truck } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductArtwork from './ProductArtwork';

const categoryCards = [
  {
    name: 'Fruits',
    title: 'Fresh Fruits',
    accent: 'text-orange-700',
  },
  {
    name: 'Vegetables',
    title: 'Fresh Vegetables',
    accent: 'text-emerald-700',
  },
  {
    name: 'Dairy',
    title: 'Dairy Essentials',
    accent: 'text-sky-700',
  },
  {
    name: 'Beverages',
    title: 'Cold Beverages',
    accent: 'text-cyan-700',
  },
  {
    name: 'Snacks',
    title: 'Healthy Snacks',
    accent: 'text-amber-700',
  },
  {
    name: 'Rice',
    title: 'Rice & Grains',
    accent: 'text-stone-700',
  },
];

const promises = [
  { icon: Truck, title: 'Quick delivery', text: 'Fresh slots daily' },
  { icon: PackageCheck, title: 'Quality packed', text: 'Checked produce' },
  { icon: BadgePercent, title: 'Daily savings', text: 'Smart basket deals' },
  { icon: ShieldCheck, title: 'Flexible payment', text: 'COD or Razorpay' },
];

const shoppingSteps = [
  { icon: ShoppingBasket, number: '01', title: 'Fill your basket', text: 'Search or browse 16 everyday categories.' },
  { icon: Clock, number: '02', title: 'Choose your slot', text: 'Use your saved delivery preference at checkout.' },
  { icon: Truck, number: '03', title: 'Receive it fresh', text: 'Track every order from placed to delivered.' },
];

const miniBanners = [
  {
    title: 'Organic produce',
    text: 'Fresh greens, seasonal fruits, and crisp vegetables.',
    category: 'Vegetables',
  },
  {
    title: 'Breakfast essentials',
    text: 'Milk, bread, cereal, dry fruits, and pantry picks.',
    category: 'Breakfast',
  },
];

const SectionRow = ({ title, subtitle, products }) => {
  if (!products.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Featured</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm font-semibold text-stone-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

const HomeSections = ({ products, onCategorySelect }) => {
  const offers = products.filter((product) => product.discount >= 10).slice(0, 4);

  return (
    <>
      <section className="mb-12 grid gap-4 md:grid-cols-4">
        {promises.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 rounded-[1.5rem] border border-emerald-900/10 bg-white/90 p-4 shadow-[0_14px_40px_rgba(38,58,34,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(38,58,34,0.1)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Icon size={22} />
            </span>
            <div>
              <p className="font-black text-stone-950">{title}</p>
              <p className="text-sm font-semibold text-stone-500">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-12 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 px-5 py-8 text-white shadow-2xl shadow-emerald-950/15 sm:px-8">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Simple by design</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">From shelf to doorstep in three steps</h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-6 text-stone-300">Less tapping, clearer choices, and a checkout that works with Cash on Delivery too.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {shoppingSteps.map(({ icon: Icon, number, title, text }) => (
            <div key={number} className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-stone-950"><Icon size={21} /></span>
                <span className="text-sm font-black tracking-[0.2em] text-white/30">{number}</span>
              </div>
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-stone-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 grid gap-5 lg:grid-cols-2">
        {miniBanners.map((banner) => (
          <button
            key={banner.title}
            type="button"
            onClick={() => onCategorySelect(banner.category)}
            className="group relative min-h-72 overflow-hidden rounded-[2rem] text-left shadow-2xl shadow-emerald-950/10"
          >
            <ProductArtwork product={{ name: banner.title, category: banner.category }} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/10" />
            <div className="relative flex h-full min-h-72 flex-col justify-end p-6 sm:p-8">
              <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                <ShoppingBasket size={16} />
                Fresh offer
              </p>
              <h3 className="max-w-sm text-3xl font-black text-white">{banner.title}</h3>
              <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-stone-100">{banner.text}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-emerald-800 transition group-hover:-translate-y-1">
                Shop collection
                <ArrowRight size={17} />
              </span>
            </div>
          </button>
        ))}
      </section>

      <section className="mb-12 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-800 text-white shadow-2xl shadow-emerald-950/10">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-black text-emerald-100"><Clock size={16} /> Curated weekly basket</p>
            <h2 className="text-3xl font-black tracking-tight">Build your grocery list in minutes</h2>
            <p className="mt-2 max-w-2xl font-medium leading-7 text-emerald-50">Shop staples, produce, dairy, breakfast, snacks, and drinks in one balanced storefront.</p>
          </div>
          <button type="button" onClick={() => onCategorySelect('Rice')} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-black text-emerald-800 transition hover:-translate-y-1 hover:bg-emerald-50">
            Shop staples
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="mb-16 rounded-[2.5rem] bg-[#fbfdf9] px-4 py-12 shadow-[0_18px_55px_rgba(20,92,53,0.06)] sm:px-8 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-500"></p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-wide text-stone-900 sm:text-4xl">Shop by Category</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-orange-300" />
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-6 text-stone-500">
            Choose from fresh everyday essentials, thoughtfully arranged with room to breathe.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {categoryCards.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => onCategorySelect(category.name)}
              className="group text-center outline-none"
            >
              <span className="mx-auto block aspect-square w-full max-w-40 overflow-hidden rounded-sm bg-stone-100 shadow-[0_12px_35px_rgba(38,58,34,0.08)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_18px_45px_rgba(38,58,34,0.14)]">
                <ProductArtwork
                  product={{ name: category.title, category: category.name }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </span>
              <span className={`mt-4 block text-sm font-bold ${category.accent}`}>{category.title}</span>
              <span className="mt-2 inline-flex items-center justify-center gap-1 text-xs font-bold text-stone-500 transition group-hover:text-emerald-700">
                Explore
                <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <SectionRow title="Top deals today" subtitle="Discounted grocery essentials for your basket." products={offers} />
    </>
  );
};

export default HomeSections;
