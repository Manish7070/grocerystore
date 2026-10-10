import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Sparkles, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWatchlist } from '../context/WatchlistContext';
import QuantityModal from '../components/QuantityModal';
import ProductArtwork from '../components/ProductArtwork';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [quantityOpen, setQuantityOpen] = useState(false);

  useEffect(() => {
    productsAPI.getById(id)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Load reviews
    api.get(`/reviews/${id}`)
      .then((res) => setReviews(res.data || []))
      .catch(() => {});
  }, [id]);

  const checkPincode = (e) => {
    e.preventDefault();
    if (/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setPinStatus({
        valid: true,
        message: `Express Delivery Available to PIN ${pincode.trim()} (in 30–45 mins)`,
      });
    } else {
      setPinStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
        title: 'Customer Feedback',
      });
      setReviews([res.data, ...reviews]);
      setReviewComment('');
      showToast('Thank you! Review posted successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Sign in to post a review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
        <p className="mt-4 font-bold text-stone-600">Loading produce details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-stone-400 mb-3" />
        <h2 className="text-2xl font-black text-stone-900">Product Not Found</h2>
        <p className="mt-1 text-sm text-stone-500">The product you are looking for may have been archived or moved.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-2xl bg-[#075F46] px-6 py-3 font-bold text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  const saved = isInWatchlist(product._id);
  const discountPercent = product.discount || 0;
  const originalPrice = discountPercent > 0 ? Math.round(product.price * (1 + discountPercent / 100)) : product.price;

  const handleAddToCart = (quantity) => {
    addItem(product, quantity);
    setQuantityOpen(false);
    showToast(`${quantity} x ${product.name} added to cart`);
  };

  const handleWatchlist = () => {
    toggleWatchlist(product);
    showToast(saved ? `${product.name} removed from watchlist` : `${product.name} added to watchlist`, saved ? 'info' : 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-emerald-700">Shop</Link>
        <ChevronRight size={12} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-emerald-700">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="truncate text-stone-900 font-bold dark:text-stone-100">{product.name}</span>
      </nav>

      <div className="grid gap-10 rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 md:grid-cols-2 lg:p-10">
        {/* Left Column: Image Artwork */}
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#eef6e8] shadow-inner dark:bg-stone-900">
            <ProductArtwork product={product} className="h-96 w-full object-cover sm:h-[480px]" showLabel />
            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3.5 py-1 text-xs font-black text-white shadow-lg">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleWatchlist}
              className={`absolute right-4 top-4 rounded-full p-3 shadow-md backdrop-blur transition hover:scale-105 ${
                saved ? 'bg-red-50 text-red-600' : 'bg-white/90 text-stone-700'
              }`}
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Farm Provenance Card */}
          <div className="mt-6 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles size={13} />
              Farm-to-Fork Direct Provenance
            </span>
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs font-medium text-stone-700 dark:text-stone-300">
              <div>
                <span className="text-stone-400 block text-[10px] font-bold">SOURCE ORIGIN</span>
                <span className="font-bold text-stone-900 dark:text-white">{product.farmSource || 'Nashik Valley Farms'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold">FRESHNESS INDEX</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{product.freshnessScore || 98}% Grade A+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Purchasing */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-black text-amber-700">
                <Star size={14} fill="currentColor" />
                {product.rating || 4.8} ({reviews.length + 18} reviews)
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-400">
              Brand: {product.brand || 'TaazaDaily Harvest'} · Pack: {product.unit || '1 pack'}
            </p>

            {/* Pricing Section */}
            <div className="my-5 flex items-baseline gap-3">
              <span className="text-4xl font-black text-emerald-800 dark:text-emerald-400">
                ₹{product.price}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-base font-semibold text-stone-400 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-700">
                    You Save ₹{originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300">
              {product.description || 'Farm-fresh, crisp grocery essential handpicked daily for authentic taste and nutrition.'}
            </p>

            {/* PIN Code Serviceability Checker */}
            <div className="my-6 rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5 mb-2">
                <MapPin size={14} className="text-emerald-700" />
                Delivery Availability
              </span>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-48 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold outline-none dark:bg-stone-800 dark:border-white/10 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#075F46] px-4 py-2 text-xs font-bold text-white hover:bg-[#064D3A]"
                >
                  Check PIN
                </button>
              </form>
              {pinStatus && (
                <p className={`mt-2 text-xs font-bold ${pinStatus.valid ? 'text-emerald-700' : 'text-red-600'}`}>
                  {pinStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="border-t border-stone-100 pt-6 dark:border-white/5">
            <div className="flex gap-3">
              <button
                onClick={() => setQuantityOpen(true)}
                disabled={(product.stock ?? 1) <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#075F46] py-4 text-base font-black text-white shadow-lg transition hover:bg-[#064D3A] active:scale-[0.99] disabled:opacity-40"
              >
                <ShoppingCart size={20} />
                {(product.stock ?? 1) > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Nutrition, Storage, Reviews */}
      <div className="mt-12 rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-10">
        <div className="flex border-b border-stone-200 dark:border-white/10 gap-6 text-sm font-bold">
          {['description', 'storage', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition ${
                activeTab === tab
                  ? 'border-b-2 border-emerald-700 text-emerald-800 font-black dark:text-emerald-300'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose text-sm text-stone-600 dark:text-stone-300 max-w-none">
              <p>{product.description || 'Sourced directly from verified growers, sorted and quality checked before dispatch.'}</p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Country of Origin</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200 mt-1">{product.origin || 'India'}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Quality Grade</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200 mt-1">Grade A+ Certified</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Packaging</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200 mt-1">Eco-friendly Sealed</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Stock Status</span>
                  <p className="font-bold text-emerald-700 mt-1">Available in Hub</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="text-sm text-stone-600 dark:text-stone-300 space-y-3">
              <p><strong>Storage Instructions: </strong>{product.storageInstructions || 'Store in a cool, ventilated container away from sunlight.'}</p>
              <p><strong>Expected Shelf Life: </strong>{product.shelfLife || '3-7 days from the delivery date'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handlePostReview} className="rounded-2xl bg-stone-50 p-5 dark:bg-stone-900">
                <h3 className="font-black text-stone-900 dark:text-white text-sm mb-3">Add Verified Review</h3>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-sm ${reviewRating >= star ? 'text-amber-500' : 'text-stone-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with freshness, packing and taste..."
                  className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs outline-none dark:bg-stone-800 dark:border-white/10 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={submittingReview || !reviewComment.trim()}
                  className="mt-3 rounded-xl bg-[#075F46] px-5 py-2 text-xs font-black text-white hover:bg-[#064D3A] disabled:opacity-40"
                >
                  Submit Review
                </button>
              </form>

              {/* Existing Reviews */}
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-500">Be the first to review this produce!</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="rounded-2xl border border-stone-100 p-4 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">{rev.userName}</span>
                        <span className="text-xs text-amber-600 font-bold">★ {rev.rating}/5</span>
                      </div>
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <QuantityModal product={product} open={quantityOpen} onClose={() => setQuantityOpen(false)} onConfirm={handleAddToCart} />
    </div>
  );
};

export default ProductDetail;
