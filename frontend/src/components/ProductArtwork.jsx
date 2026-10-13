import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { getProductLiveImage, categoryLiveImages } from '../utils/remoteProductImages';

const ProductArtwork = ({ product = {}, className = '', showLabel = false }) => {
  const liveImageUrl = getProductLiveImage(product);
  const categoryFallback = categoryLiveImages[product.category] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80';
  const [imgSrc, setImgSrc] = useState(liveImageUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextUrl = getProductLiveImage(product);
    setImgSrc(nextUrl);
    setTriedFallback(false);
    setHasError(false);
  }, [product?._id, product?.id, product?.name, product?.image]);

  const handleImageError = () => {
    if (!triedFallback && imgSrc !== categoryFallback) {
      setTriedFallback(true);
      setImgSrc(categoryFallback);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      role="img"
      aria-label={`${product.name || product.category || 'Grocery'} product image`}
      className={`relative isolate flex items-center justify-center overflow-hidden bg-[#F3EFE6] dark:bg-[#1A2623] ${className}`}
    >
      {!hasError ? (
        <img
          src={imgSrc}
          alt={product.name || 'Grocery product'}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 p-4 text-[#8C827A] dark:text-[#A7B3AF]">
          <Package className="h-8 w-8 text-[#17745A] dark:text-[#10B981]" strokeWidth={1.5} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">{product.category || 'Grocery'}</span>
        </div>
      )}

      {/* Subtle overlay gradient */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40" />

      {showLabel && (
        <span className="absolute bottom-2.5 left-2.5 right-2.5 truncate rounded-lg border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#162723]/95 px-2.5 py-1 text-center font-serif text-[11px] font-semibold text-[#192D2A] dark:text-white shadow-sm backdrop-blur">
          {product.category || 'Provisions'}
        </span>
      )}
    </div>
  );
};

export default ProductArtwork;
