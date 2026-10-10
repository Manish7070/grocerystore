import { Link } from 'react-router-dom';

/**
 * Concept A: Architectural Heritage Monogram
 * Chiseled serif junctions, interlocking vertical geometry,
 * inspired by classical luxury engraving and architectural cartouches.
 */
export const GSMonogramConceptA = ({ className = 'h-10 w-10', color = '#27221F', accent = '#B65337' }) => (
  <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Subtle architectural border */}
    <rect x="2" y="2" width="50" height="50" rx="10" stroke={color} strokeWidth="1.2" strokeOpacity="0.25" />
    <rect x="4.5" y="4.5" width="45" height="45" rx="8" stroke={color} strokeWidth="0.6" strokeOpacity="0.12" />
    {/* Architectural letter 'G' */}
    <path
      d="M37 18C34.2 13.6 29.8 11.5 24.5 11.5C15.8 11.5 9.5 17.8 9.5 26.5C9.5 35.2 15.8 41.5 24.5 41.5C32.2 41.5 37.5 36.8 38.5 29.5H25.5V25H42C42.4 26.8 42.6 28.5 42.6 30C42.6 39 35 45.5 24.5 45.5C13.5 45.5 5.5 37 5.5 26.5C5.5 16 13.5 7.5 24.5 7.5C31.2 7.5 37 10.4 40.5 15.5L37 18Z"
      fill={color}
    />
    {/* Chiseled letter 'S' interwoven through the 'G' spine */}
    <path
      d="M36 21C36 17.5 32.8 15 28 15C23 15 19.5 17.5 19.5 21C19.5 25.5 27 26.5 32.5 28C37.8 29.5 41 33 41 37.5C41 43.5 35.5 46.5 28.5 46.5C22.2 46.5 17 43.2 14.5 38.5L18.8 35.5C20.8 39 24.5 41.8 28.5 41.8C33 41.8 36.2 39.8 36.2 36.8C36.2 33 30 31.8 24.5 30.2C19.8 28.8 15.5 25.5 15.5 20.8C15.5 14.8 21 10.8 28 10.8C33.8 10.8 38.5 13.5 40.8 18L36 21Z"
      fill={accent}
    />
  </svg>
);

/**
 * Concept B: Sculpted Contemporary Monogram
 * Clean calligraphic continuous-stroke integration where G and S
 * form a unified luxury seal.
 */
export const GSMonogramConceptB = ({ className = 'h-10 w-10', color = '#27221F', accent = '#B65337' }) => (
  <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <circle cx="27" cy="27" r="24" stroke={color} strokeWidth="1.2" strokeOpacity="0.2" />
    <path
      d="M27 9C17 9 9 17 9 27C9 37 17 45 27 45C34.5 45 40.5 40.5 43 34H27V28H46C46.5 30 46.8 32 46.8 34C46.8 44 38 49 27 49C14.8 49 5 39.2 5 27C5 14.8 14.8 5 27 5C35 5 41.8 9.2 45.2 15.5L40.2 18.5C37.8 12.8 32.8 9 27 9Z"
      fill={color}
    />
    <path
      d="M33 19C33 16 30 14 26 14C21.5 14 18 16.5 18 20C18 24 24 25.5 29 27C35 28.8 39 32 39 37C39 43 33.5 46 26.5 46C20 46 15 42.5 12.8 37.5L17.5 34.5C19 38 22.5 40.8 26.5 40.8C30.5 40.8 33.5 38.8 33.5 35.8C33.5 32 27.5 30.8 22.5 29C17.5 27.2 13.5 24 13.5 19.5C13.5 14 19 10 26 10C31.8 10 36.2 13 38.5 17.5L33 19Z"
      fill={accent}
    />
  </svg>
);

/**
 * Concept C: Modern Artisan Monogram
 * Handcrafted diamond emblem with engraved finials and sharp terminals.
 */
export const GSMonogramConceptC = ({ className = 'h-10 w-10', color = '#27221F', accent = '#B58B4C' }) => (
  <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M27 3L51 27L27 51L3 27L27 3Z" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
    <path d="M27 7L47 27L27 47L7 27L27 7Z" stroke={accent} strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
    <path
      d="M35 18C32.5 14 28.5 12 24 12C16 12 10.5 17.5 10.5 25.5C10.5 33.5 16 39 24 39C30.5 39 35 35 36.2 29H25V25H40C40.2 26.5 40.5 28 40.5 29.5C40.5 36.5 34 43 24 43C13.5 43 6.5 35 6.5 25.5C6.5 16 13.5 8 24 8C30 8 35.5 10.5 38.8 15L35 18Z"
      fill={color}
    />
    <path
      d="M33 21C33 18 30 16 26.5 16C22.5 16 19.5 18 19.5 21C19.5 24.8 25.5 25.8 30 27C34.5 28.2 37.5 31 37.5 35C37.5 40 33 43 27 43C21.5 43 17 40 15 36L18.5 33C20 36 23 38.5 27 38.5C30.5 38.5 33 37 33 34.5C33 31.5 27.5 30.5 23 29C18.5 27.5 15.5 24.8 15.5 21C15.5 16 20.2 12.5 26.5 12.5C31.5 12.5 35.2 15 37.2 19L33 21Z"
      fill={accent}
    />
  </svg>
);

/**
 * MASTER PRODUCTION GS MONOGRAM
 * Selected Concept: Architectural Heritage.
 * Precision sculpted vector paths, balanced negative space,
 * legible at 24px–120px+, monochrome or dual-tone luxury palette.
 */
export const GSMonogram = ({ className = 'h-9 w-9', variant = 'default' }) => {
  // Variant palettes
  let frameColor = '#E6DED3';
  let letterGColor = '#27221F';
  let letterSColor = '#B65337';
  let bgColor = '#FFFCF7';

  if (variant === 'inverted') {
    frameColor = 'rgba(247, 244, 238, 0.25)';
    letterGColor = '#F7F4EE';
    letterSColor = '#D4A373';
    bgColor = '#35272F';
  } else if (variant === 'black') {
    frameColor = '#27221F';
    letterGColor = '#27221F';
    letterSColor = '#27221F';
    bgColor = 'transparent';
  } else if (variant === 'white') {
    frameColor = '#FFFFFF';
    letterGColor = '#FFFFFF';
    letterSColor = '#FFFFFF';
    bgColor = 'transparent';
  }

  return (
    <svg
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Precision Chamfered Frame */}
      <rect x="1.5" y="1.5" width="51" height="51" rx="11" fill={bgColor} stroke={frameColor} strokeWidth="1.2" />
      <rect x="4" y="4" width="46" height="46" rx="8.5" fill="none" stroke={frameColor} strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Architectural Letter 'G' with classical serif spur */}
      <path
        d="M37 17.5C34.2 13.2 29.8 11.2 24.5 11.2C15.8 11.2 9.5 17.5 9.5 26.5C9.5 35.5 15.8 41.8 24.5 41.8C32.2 41.8 37.5 37 38.5 29.8H25.5V25.2H42C42.4 27 42.6 28.6 42.6 30.2C42.6 39.2 35 45.8 24.5 45.8C13.5 45.8 5.5 37.2 5.5 26.5C5.5 15.8 13.5 7.2 24.5 7.2C31.2 7.2 37 10.2 40.5 15.2L37 17.5Z"
        fill={letterGColor}
      />

      {/* Sculpted Letter 'S' weaving through G's center */}
      <path
        d="M36 20.8C36 17.2 32.8 14.8 28 14.8C23 14.8 19.5 17.2 19.5 20.8C19.5 25.2 27 26.2 32.5 27.8C37.8 29.2 41 32.8 41 37.2C41 43.2 35.5 46.2 28.5 46.2C22.2 46.2 17 43 14.5 38.2L18.8 35.2C20.8 38.8 24.5 41.5 28.5 41.5C33 41.5 36.2 39.5 36.2 36.5C36.2 32.8 30 31.5 24.5 29.8C19.8 28.5 15.5 25.2 15.5 20.5C15.5 14.5 21 10.5 28 10.5C33.8 10.5 38.5 13.2 40.8 17.8L36 20.8Z"
        fill={letterSColor}
      />
    </svg>
  );
};

export const BrandLogoIcon = GSMonogram;

/**
 * Production Brand Lockup for GroceryStore
 */
export const Brand = ({
  compact = false,
  inverted = false,
  stacked = false,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const chosenVariant = inverted ? 'inverted' : variant;

  if (stacked) {
    return (
      <Link
        to="/"
        onClick={onClick}
        className={`group flex flex-col items-center text-center transition-opacity hover:opacity-95 ${className}`}
        aria-label="GroceryStore — Contemporary Premium Grocery"
      >
        <span className="h-14 w-14 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <GSMonogram className="h-full w-full drop-shadow-subtle" variant={chosenVariant} />
        </span>
        <span className={`block font-serif text-2xl tracking-[-0.02em] font-semibold ${inverted ? 'text-ivory' : 'text-espresso dark:text-ivory'}`}>
          Grocery<span className={inverted ? 'text-apricot' : 'text-terracotta'}>Store</span>
        </span>
        <span className={`mt-0.5 block font-sans text-[10px] font-bold uppercase tracking-[0.24em] ${inverted ? 'text-ivory/60' : 'text-warmStone dark:text-ivory/50'}`}>
          Fine Provisions & Market
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
      aria-label="GroceryStore — Contemporary Premium Grocery"
    >
      <span className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        <GSMonogram className="h-full w-full drop-shadow-subtle" variant={chosenVariant} />
      </span>
      <span className="leading-tight">
        <span className={`block font-serif tracking-[-0.03em] font-semibold ${compact ? 'text-xl' : 'text-2xl sm:text-[25px]'} ${inverted ? 'text-ivory' : 'text-espresso dark:text-ivory'}`}>
          Grocery<span className={inverted ? 'text-apricot' : 'text-terracotta'}>Store</span>
        </span>
        <span className={`block font-sans text-[9px] font-extrabold uppercase tracking-[0.24em] ${inverted ? 'text-ivory/60' : 'text-warmStone dark:text-ivory/50'}`}>
          Fine Provisions & Fresh Market
        </span>
      </span>
    </Link>
  );
};

export default Brand;
