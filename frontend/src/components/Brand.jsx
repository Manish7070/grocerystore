import { Link } from 'react-router-dom';

/**
 * MASTER CUSTOM GS MONOGRAM — EMBOSSED BLACKLETTER & WHEAT CRAFTSMANSHIP
 * Direct vector translation of the requested artisan emblem:
 * - Chiseled Gothic / Blackletter 'G' with beveled spurs & faceted serifs
 * - Interlocking tall Gothic 'S' weaving through G's center
 * - Handcrafted wheat / barley ear stalk emerging through the central negative space
 * - Botanical flourish at the base
 * - Scalable from 28px navbar to 120px+ hero
 */
export const GSMonogram = ({
  className = 'h-10 w-10',
  variant = 'default',
  colorOverride = null,
}) => {
  // Theme palette mapping
  let mainColor = '#192D2A';   // Forest ink
  let accentColor = '#C66B42'; // Burnt copper
  let grainColor = '#D9A441';  // Golden ochre

  if (variant === 'inverted' || variant === 'white') {
    mainColor = '#F8F3EA';
    accentColor = '#D9A441';
    grainColor = '#D9A441';
  } else if (variant === 'copper') {
    mainColor = '#C66B42';
    accentColor = '#192D2A';
    grainColor = '#D9A441';
  }

  if (colorOverride) {
    mainColor = colorOverride;
    accentColor = colorOverride;
    grainColor = colorOverride;
  }

  return (
    <svg
      viewBox="0 0 100 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GroceryStore Handcrafted GS Monogram"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. CHISELED BLACKLETTER / GOTHIC 'G'
          Features faceted spurs, diagonal cut bevels, and Roman base
      ───────────────────────────────────────────────────────────── */}
      {/* Upper serif flag of G */}
      <path
        d="M26 18L32 10L36 12L31 20H46L49 14L53 16L48 24C48 24 43 27 38 27C30 27 25 32 25 41C25 50 30 55 38 55C44 55 49 51 51 45H39V37H59V46C59 58 49 65 37 65C21 65 13 54 13 40C13 26 21 16 35 16C40 16 45 18 48 20L44 24C41 22 38 21 35 21C27 21 21 27 21 39C21 51 27 58 37 58C44 58 50 54 52 47H45V43H53V47C53 52 48 59 38 59C28 59 22 51 22 40C22 29 27 22 35 22C38 22 42 24 44 26L41 29L37 26C34 26 31 28 30 30L26 18Z"
        fill={mainColor}
      />
      {/* Main body of G with chiseled spurs and faceted bevel cuts */}
      <path
        d="M36 15C44 15 50 19 53 24L48 28C46 24 41 21 36 21C26 21 19 28 19 40C19 52 26 59 36 59C44 59 49 54 51 46H39V38H58V45C58 58 48 66 36 66C20 66 11 54 11 40C11 25 20 15 36 15Z"
        fill={mainColor}
      />
      {/* Left chiseled mid-spur of G */}
      <path
        d="M11 39L5 37L7 32L13 34L11 39Z"
        fill={mainColor}
      />
      <path
        d="M13 34L5 37L11 42L15 38L13 34Z"
        fill={accentColor}
        opacity="0.85"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. INTERTWINED TALL BLACKLETTER 'S'
          Features arching top terminal, central spine weaving through G,
          and sweeping bottom loop
      ───────────────────────────────────────────────────────────── */}
      {/* Upper arch and flag of S */}
      <path
        d="M50 12L56 5L61 8L57 16C62 17 68 20 71 24C75 29 76 35 73 40C70 45 64 47 57 49C48 52 43 54 43 60C43 65 47 69 55 69C62 69 68 65 71 59L76 62C72 70 64 75 54 75C42 75 35 69 35 59C35 51 41 46 50 43C59 40 65 38 65 32C65 27 61 23 54 23C48 23 43 26 39 30L34 26C39 20 46 16 55 16L50 12Z"
        fill={accentColor}
      />
      {/* Shaded faceted depth line for S spine */}
      <path
        d="M53 19C61 19 68 23 68 31C68 37 62 40 54 43C45 46 39 49 39 58C39 65 45 71 54 71C60 71 66 67 69 62L66 60C63 64 59 66 54 66C48 66 44 62 44 57C44 51 49 48 57 45C65 42 72 38 72 31C72 24 65 19 55 19H53Z"
        fill={mainColor}
      />
      {/* S bottom decorative terminal flourish */}
      <path
        d="M71 59L77 55L78 61L72 63L71 59Z"
        fill={accentColor}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. CENTRAL WHEAT / BARLEY EAR STALK (The Agricultural Soul)
          Grows right through the center intersection of G and S
      ───────────────────────────────────────────────────────────── */}
      {/* Central stem */}
      <path
        d="M48 24C47.5 32 46.5 42 46 54C45.5 62 44 70 42 76"
        stroke={grainColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Grain husks (alternating right and left along the stem) */}
      <path
        d="M47 26C45 22 47 18 48 16C49 18 51 22 49 26C48 27 47.5 27 47 26Z"
        fill={grainColor}
      />
      <path
        d="M44 31C41 29 42 25 43 23C45 25 46 29 45 32C44.5 32 44.2 31.5 44 31Z"
        fill={grainColor}
      />
      <path
        d="M50 32C53 30 54 26 54 24C52 26 50 30 49 33L50 32Z"
        fill={grainColor}
      />
      <path
        d="M43 38C40 36 40 32 42 30C43 32 45 36 44 39L43 38Z"
        fill={grainColor}
      />
      <path
        d="M49 39C52 37 53 33 53 31C51 33 49 37 48 40L49 39Z"
        fill={grainColor}
      />
      <path
        d="M42 45C39 43 39 39 41 37C42 39 44 43 43 46L42 45Z"
        fill={grainColor}
      />
      <path
        d="M48 46C51 44 52 40 52 38C50 40 48 44 47 47L48 46Z"
        fill={grainColor}
      />

      {/* ─────────────────────────────────────────────────────────────
          4. BOTANICAL ROOT / BASE FLOURISH
          Rooted at the base of the emblem, matching the reference photo
      ───────────────────────────────────────────────────────────── */}
      <path
        d="M46 76C44 79 40 82 36 84L37 81C40 80 43 78 45 75L46 76Z"
        fill={grainColor}
      />
      <path
        d="M46 76C48 79 52 82 56 84L55 81C52 80 49 78 47 75L46 76Z"
        fill={grainColor}
      />
      <path
        d="M46 76V86H45V76H46Z"
        fill={grainColor}
      />
    </svg>
  );
};

export const BrandLogoIcon = GSMonogram;
export const GSMonogramConceptA = (props) => <GSMonogram {...props} variant="default" />;
export const GSMonogramConceptB = (props) => <GSMonogram {...props} variant="copper" />;
export const GSMonogramConceptC = (props) => <GSMonogram {...props} variant="inverted" />;

/**
 * MASTER BRAND LOCKUP
 * Combines the sculpted GS Wheat Monogram with the Calligraphic Script
 * "Grocery Store" wordmark and elegant swash.
 */
export const Brand = ({
  compact = false,
  inverted = false,
  stacked = false,
  onClick,
  className = '',
}) => {
  const textColor = inverted ? '#F8F3EA' : '#192D2A';
  const swashColor = inverted ? '#D9A441' : '#C66B42';

  if (stacked) {
    return (
      <Link
        to="/"
        onClick={onClick}
        className={`group flex flex-col items-center text-center transition-opacity hover:opacity-95 ${className}`}
        aria-label="GroceryStore — Premium Grocery Commerce"
      >
        <span className="h-16 w-16 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <GSMonogram
            className="h-full w-full drop-shadow-sm"
            variant={inverted ? 'inverted' : 'default'}
          />
        </span>
        <div className="flex flex-col items-center">
          <span className={`font-serif text-3xl font-normal tracking-[-0.02em] ${inverted ? 'text-surface' : 'text-forest dark:text-surface'}`}>
            Grocery<span className={inverted ? 'text-ochre' : 'text-copper'}>Store</span>
          </span>
          {/* Calligraphic swash line */}
          <svg viewBox="0 0 160 14" fill="none" className="w-32 h-3 mt-0.5 text-copper dark:text-ochre">
            <path
              d="M5 4C35 4 60 11 110 8C135 6 150 2 155 1C152 4 140 10 110 11C60 13 35 6 5 4Z"
              fill={swashColor}
            />
          </svg>
          <span className={`mt-0.5 block font-sans text-[10px] font-bold uppercase tracking-[0.24em] ${inverted ? 'text-surface/70' : 'text-mutedStone dark:text-surface/60'}`}>
            Fine Provisions & Fresh Market
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-3.5 transition-opacity hover:opacity-95 ${className}`}
      aria-label="GroceryStore — Premium Grocery Commerce"
    >
      <span className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        <GSMonogram
          className="h-full w-full drop-shadow-sm"
          variant={inverted ? 'inverted' : 'default'}
        />
      </span>
      <span className="leading-tight flex flex-col justify-center">
        <span className={`block font-serif tracking-[-0.03em] font-normal ${compact ? 'text-2xl' : 'text-2xl sm:text-[27px]'} ${inverted ? 'text-surface' : 'text-forest dark:text-surface'}`}>
          Grocery<span className={inverted ? 'text-ochre' : 'text-copper'}>Store</span>
        </span>
        {/* Calligraphic delicate swash */}
        <svg viewBox="0 0 130 10" fill="none" className="w-24 sm:w-28 h-2 -mt-0.5 text-copper dark:text-ochre">
          <path
            d="M2 3C25 3 45 8 85 6C105 5 118 2 125 1C122 3 112 7 85 8C45 9 25 4 2 3Z"
            fill={swashColor}
          />
        </svg>
        <span className={`block font-sans text-[9px] font-extrabold uppercase tracking-[0.24em] ${inverted ? 'text-surface/70' : 'text-mutedStone dark:text-surface/60'}`}>
          Fine Provisions & Market
        </span>
      </span>
    </Link>
  );
};

export default Brand;
