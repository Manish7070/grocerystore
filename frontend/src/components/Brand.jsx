import { Link } from 'react-router-dom';

export const BrandLogoIcon = ({ className = 'h-10 w-10' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tdLeafGrad" x1="6" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#48bb78" />
        <stop offset="50%" stopColor="#2f855a" />
        <stop offset="100%" stopColor="#1c4532" />
      </linearGradient>
      <linearGradient id="tdSunAccent" x1="26" y1="6" x2="42" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f6ad55" />
        <stop offset="100%" stopColor="#dd6b20" />
      </linearGradient>
    </defs>
    {/* Background soft pill */}
    <rect width="48" height="48" rx="14" fill="#075F46" />
    {/* Stylized Modern Grocery Basket Base */}
    <path
      d="M12 21H36L33.5 35.5C33.2 37.5 31.5 39 29.5 39H18.5C16.5 39 14.8 37.5 14.5 35.5L12 21Z"
      fill="white"
      fillOpacity="0.16"
      stroke="#E2E8F0"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Basket Weave lines */}
    <path d="M19 25V35M29 25V35M14 28H34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
    {/* Dynamic Organic Sprout Leaf emerging from the basket */}
    <path
      d="M24 10C16 12 14 20 23 27C31 20 30 11 24 10Z"
      fill="url(#tdLeafGrad)"
      stroke="#68D391"
      strokeWidth="1.5"
    />
    {/* Leaf central vein */}
    <path d="M23.5 25C22.5 20 23.5 15 24 11" stroke="#C6F6D5" strokeWidth="1.5" strokeLinecap="round" />
    {/* Sun-kissed golden harvest droplet */}
    <circle cx="34" cy="13" r="3.5" fill="url(#tdSunAccent)" />
    <path d="M34 10.5V11.5M36.5 13H35.5M34 15.5V14.5M31.5 13H32.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

const Brand = ({ compact = false, inverted = false, onClick, className = '' }) => (
  <Link
    to="/"
    onClick={onClick}
    className={`inline-flex shrink-0 items-center gap-2.5 transition-transform hover:scale-[1.02] ${className}`}
    aria-label="TaazaDaily - Smart Farm-to-Fork Grocery Home"
  >
    <span className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-emerald-900/10`}>
      <BrandLogoIcon className="h-full w-full" />
    </span>
    <span className="leading-none">
      <span className={`block font-black tracking-[-0.04em] ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} ${inverted ? 'text-white' : 'text-[#075F46] dark:text-emerald-100'}`}>
        Taaza<span className="text-[#38a169]">Daily</span>
      </span>
      <span className={`mt-1 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] ${inverted ? 'text-emerald-100/80' : 'text-stone-500 dark:text-stone-400'}`}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Smart Farm-to-Fork
      </span>
    </span>
  </Link>
);

export default Brand;
