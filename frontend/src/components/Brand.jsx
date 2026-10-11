import { Link } from 'react-router-dom';

/**
 * Clean, typography-based GroceryStore wordmark.
 * Eliminates the GS monogram and decorative symbol shortcuts in favor of
 * an elegant, high-contrast, editorial serif brandmark suitable for
 * light, dark, and mobile navigation.
 */
export const Brand = ({
  compact = false,
  inverted = false,
  stacked = false,
  onClick,
  className = '',
}) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label="GroceryStore — Fine Provisions & Fresh Market"
    >
      <div className={`flex flex-col ${stacked ? 'items-center text-center' : 'items-start text-left'}`}>
        <span
          className={`font-serif tracking-tight font-semibold leading-none ${
            compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[26px]'
          } ${inverted ? 'text-[#F8F3EA]' : 'text-[#192D2A] dark:text-[#F8F3EA]'}`}
        >
          Grocery<span className="font-serif italic font-normal text-[#17745A] dark:text-[#10B981]">Store</span>
        </span>
        <span
          className={`mt-1 block font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase ${
            inverted ? 'text-[#E7E2D9]/75' : 'text-[#625F59] dark:text-[#E7E2D9]/70'
          }`}
        >
          Fine Provisions & Fresh Market
        </span>
      </div>
    </Link>
  );
};

export default Brand;
