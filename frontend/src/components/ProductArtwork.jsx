import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import categorySprite from '../assets/grocery-category-sprite.jpg';
import { getProductArtwork } from '../utils/productArtwork';

const categoryPositions = {
  Rice: [0, 0],
  Pulses: [1, 0],
  Vegetables: [2, 0],
  Fruits: [3, 0],
  Dairy: [0, 1],
  Bakery: [1, 1],
  Oils: [2, 1],
  Spices: [3, 1],
  Breakfast: [0, 2],
  'Dry Fruits': [1, 2],
  Snacks: [2, 2],
  Beverages: [3, 2],
  'Frozen Foods': [0, 3],
  'Personal Care': [1, 3],
  Household: [2, 3],
  'Pet Care': [3, 3],
};

const isRenderableImage = (value) => (
  typeof value === 'string'
  && value.length > 0
  && !value.startsWith('greenbasket-art://')
);

const ProductArtwork = ({ product = {}, className = '', showLabel = false }) => {
  const imageSource = isRenderableImage(product.image) ? product.image : '';
  const [imageAvailable, setImageAvailable] = useState(Boolean(imageSource));
  const spritePosition = categoryPositions[product.category];
  const artwork = getProductArtwork(product);
  const label = `${product.name || product.category || 'Grocery'} ${imageAvailable ? 'product image' : 'illustrative image'}`;

  useEffect(() => {
    setImageAvailable(Boolean(imageSource));
  }, [imageSource]);

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative isolate flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-100 dark:from-stone-800 dark:via-emerald-950 dark:to-stone-900 ${className}`}
    >
      {artwork ? (
        <svg aria-hidden="true" focusable="false"
          viewBox={`${artwork.column} ${artwork.row} 1 1`} preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full overflow-hidden transition-transform duration-700 group-hover:scale-105">
          <image href={artwork.src} width="4" height="4" />
        </svg>
      ) : spritePosition ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${categorySprite})`,
            backgroundSize: '400% 400%',
            backgroundPosition: `${spritePosition[0] * (100 / 3)}% ${spritePosition[1] * (100 / 3)}%`,
          }}
        />
      ) : (
        <span className="relative flex aspect-square h-[46%] items-center justify-center rounded-[30%] bg-white/80 text-emerald-700 shadow-xl ring-1 ring-white/80 backdrop-blur dark:bg-stone-900/70">
          <Package className="h-[55%] w-[55%]" strokeWidth={1.65} />
        </span>
      )}

      {imageAvailable && (
        <img
          src={imageSource}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageAvailable(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/10 via-transparent to-white/5" />
      {showLabel && (
        <span className="absolute bottom-3 left-3 right-3 truncate rounded-full bg-white/90 px-3 py-1 text-center text-xs font-black text-stone-700 shadow-sm backdrop-blur dark:bg-stone-950/80 dark:text-stone-200">
          {product.category || 'Grocery'}
        </span>
      )}
    </div>
  );
};

export default ProductArtwork;
