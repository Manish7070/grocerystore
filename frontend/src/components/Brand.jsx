import { Link } from 'react-router-dom';
import brandMark from '../assets/greenbasket-mark.png';

const Brand = ({ compact = false, inverted = false, onClick, className = '' }) => (
  <Link
    to="/"
    onClick={onClick}
    className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}
    aria-label="GreenBasket – Online Grocery Store home"
  >
    <span className={`${compact ? 'h-11 w-11' : 'h-14 w-14'} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm ring-1 ring-emerald-900/10`}>
      <img src={brandMark} alt="" className="h-full w-full object-contain" />
    </span>
    <span className="leading-none">
      <span className={`block font-black tracking-[-0.045em] ${compact ? 'text-lg' : 'text-xl'} ${inverted ? 'text-white' : 'text-emerald-950 dark:text-emerald-100'}`}>
        Green<span className="text-[#76b82a]">Basket</span>
      </span>
      <span className={`mt-1 block text-[9px] font-bold uppercase tracking-[0.13em] ${inverted ? 'text-emerald-100/75' : 'text-stone-500 dark:text-stone-400'}`}>
        Online Grocery Store
      </span>
    </span>
  </Link>
);

export default Brand;
