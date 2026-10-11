import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { getProductLiveImage, categoryLiveImages } from '../utils/remoteProductImages';

const ProductArtwork = ({ product = {}, className = '', showLabel = false }) => {
  const liveImageUrl = getProductLiveImage(product);
  const categoryFallback = categoryLiveImages[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80';
  const [imgSrc, setImgSrc] = useState(liveImageUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const nextUrl = getProductLiveImage(product);
    setImgSrc(nextUrl);
    setTriedFallback(false);
    setError(false);
    setLoaded(false);
  }, [product?._id, product?.id, product?.name, product?.image]);

  const handleImageError = () => {
    if (!triedFallback && imgSrc !== categoryFallback) {
      setTriedFallback(true);
      setImgSrc(categoryFallback);
    } else {
      setError(true);
    }
  };

  return (
    <div
      role="img"
      aria-label={`${product.name || product.category || 'Grocery'} product image`}
      className={`relative isolate flex items-center justify-center overflow-hidden bg-[#F7F4EE] dark:bg-[#153830] ${className}`}
    >
      {/* Subtle Warm Skeleton before image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-sandstone/30" />
      )}

      {/* Verified Live Remote Photography */}
      {!error ? (
        <img
          src={imgSrc}
          alt={product.name || 'Grocery product'}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleImageError}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <span className="relative flex aspect-square h-[45%] items-center justify-center rounded-xl bg-ivory text-warmStone shadow-subtle dark:bg-[#1D151A]">
          <Package className="h-[55%] w-[55%]" strokeWidth={1.5} />
        </span>
      )}

      {/* Gentle Bottom Vignette for depth */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/15 via-transparent to-transparent opacity-60" />

      {showLabel && (
        <span className="absolute bottom-2.5 left-2.5 right-2.5 truncate rounded-md border border-sandstone/60 bg-ivory/95 px-2.5 py-1 text-center font-serif text-[11px] font-semibold text-espresso shadow-subtle backdrop-blur dark:bg-[#1D151A]/95 dark:text-ivory">
          {product.category || 'Provisions'}
        </span>
      )}
    </div>
  );
};

export default ProductArtwork;
