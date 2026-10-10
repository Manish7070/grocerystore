import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] bg-porcelain flex items-center justify-center px-4 py-16">
    <div className="max-w-lg w-full rounded-2xl border border-sandstone bg-ivory p-8 sm:p-12 text-center shadow-[0_2px_12px_rgba(39,34,31,0.04)]">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-porcelain border border-sandstone text-terracotta">
        <Compass size={32} />
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-terracotta">404 &bull; Aisle Uncharted</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-espresso">This Shelf Is Empty</h1>
      <p className="mt-3 text-xs sm:text-sm text-warmStone leading-relaxed">
        The destination you requested may have moved or been retired, but farm-fresh essentials are waiting in the main market.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-terracotta/90 transition-colors shadow-sm"
      >
        <ArrowLeft size={16} /> Return to GroceryStore
      </Link>
    </div>
  </div>
);

export default NotFound;
