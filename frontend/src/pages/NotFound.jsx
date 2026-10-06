import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
    <div className="max-w-xl rounded-[2rem] border border-emerald-900/10 bg-white p-8 text-center shadow-xl sm:p-12">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-emerald-700">
        <Compass size={40} />
      </span>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-orange-500">404 · Lost aisle</p>
      <h1 className="mt-2 text-3xl font-black text-stone-950">This shelf is empty</h1>
      <p className="mt-3 font-medium leading-7 text-stone-500">The page may have moved, but fresh groceries are still waiting for you.</p>
      <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-black text-white hover:bg-emerald-800">
        <ArrowLeft size={18} /> Back to GreenBasket
      </Link>
    </div>
  </div>
);

export default NotFound;
