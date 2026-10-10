import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Sparkles, MapPin, ChevronRight, ShieldCheck, Truck, Award, CheckCircle2 } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWatchlist } from '../context/WatchlistContext';
import ProductArtwork from '../components/ProductArtwork';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

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

    // Load verified reviews
    api.get(`/reviews/${id}`)
      .then((res) => setReviews(res.data || []))
      .catch(() => {});
  }, [id]);

  const checkPincode = (e) => {
    e.preventDefault();
    if (/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setPinStatus({
        valid: true,
        message: `Direct Cold-Chain Delivery Active for PIN ${pincode.trim()} (Next 2-hour window)`,
      });
    } else {
      setPinStatus({
        valid: false,
        message: 'Please enter a valid 6-digit postal PIN code',
      });
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Added ${quantity} x ${product.name} to basket`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    api.post(`/reviews/${id}`, { rating: reviewRating, comment: reviewComment.trim() })
      .then((res) => {
        showToast('Review submitted successfully', 'success');
        setReviews((prev) => [res.data, ...prev]);
        setReviewComment('');
        setSubmittingReview(false);
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to submit review', 'error');
        setSubmittingReview(false);
      });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 animate-pulse">
          <div className="aspect-square rounded-2xl bg-sandstone/30" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-sandstone/30" />
            <div className="h-4 w-1/3 rounded bg-sandstone/30" />
            <div className="h-24 w-full rounded bg-sandstone/30" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="font-serif text-2xl text-espresso dark:text-ivory">Product not found</p>
        <Link to="/shop" className="mt-4 inline-block text-xs font-bold text-terracotta underline">
          Return to All Aisles
        </Link>
      </div>
    );
  }

  const saved = isInWatchlist(product._id);
  const mrp = product.mrp || (product.discount > 0 ? Math.round(product.price * (1 + product.discount / 100)) : 0);
  const savings = mrp > product.price ? mrp - product.price : 0;

  return (
    <div className="min-h-screen bg-porcelain px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-warmStone dark:text-ivory/60" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-espresso dark:hover:text-ivory">Home</Link>
          <ChevronRight size={13} />
          <Link to="/shop" className="hover:text-espresso dark:hover:text-ivory">Catalog</Link>
          <ChevronRight size={13} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-espresso dark:hover:text-ivory">
            {product.category}
          </Link>
          <ChevronRight size={13} />
          <span className="text-espresso font-semibold truncate dark:text-ivory">{product.name}</span>
        </nav>

        {/* Top Product Hero Split */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Product Photography Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-sandstone bg-ivory shadow-card dark:bg-[#1D151A] dark:border-white/10">
              <ProductArtwork product={product} className="h-full w-full object-cover" />
              {product.isOrganic && (
                <span className="absolute left-4 top-4 rounded-md border border-sandstone bg-ivory px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-terracotta shadow-subtle dark:bg-[#251D21] dark:border-white/10 dark:text-apricot">
                  Certified Organic
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Purchase Panel */}
          <div className="flex flex-col">
            <div className="border-b border-sandstone pb-6 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta dark:text-apricot">
                {product.category} • {product.brand || 'GroceryStore Provenance'}
              </span>
              <h1 className="mt-2 font-serif text-3xl font-normal text-espresso sm:text-4xl dark:text-ivory">
                {product.name}
              </h1>
              <p className="mt-1 text-xs text-warmStone dark:text-ivory/60">
                Unit Pack: {product.unit || 'Standard size'}
              </p>

              {/* Price & Savings */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-espresso dark:text-ivory">
                  ₹{product.price}
                </span>
                {mrp > product.price && (
                  <span className="text-sm text-warmStone line-through dark:text-ivory/50">
                    ₹{mrp}
                  </span>
                )}
                {savings > 0 && (
                  <span className="rounded-md bg-terracotta/10 px-2.5 py-1 text-xs font-bold text-terracotta dark:bg-apricot/20 dark:text-apricot">
                    Save ₹{savings} ({product.discount}% Off)
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Action Controls */}
            <div className="py-6 space-y-4 border-b border-sandstone dark:border-white/10">
              <div className="flex items-center gap-4">
                <label htmlFor="pdetail-qty" className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">
                  Quantity
                </label>
                <div className="flex items-center rounded-xl border border-sandstone bg-ivory dark:bg-[#251D21] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-xs font-bold hover:bg-sandstone/30 transition text-espresso dark:text-ivory"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span id="pdetail-qty" className="px-3 text-xs font-bold text-espresso dark:text-ivory">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-1.5 text-xs font-bold hover:bg-sandstone/30 transition text-espresso dark:text-ivory"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition shadow-subtle"
                >
                  <ShoppingCart size={15} />
                  Add to Basket
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center rounded-xl border border-espresso bg-espresso px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#3E3632] transition dark:border-ivory dark:bg-ivory dark:text-espresso"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => toggleWatchlist(product)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border border-sandstone bg-ivory transition ${
                    saved ? 'text-errorRed' : 'text-warmStone hover:text-errorRed'
                  } dark:bg-[#251D21] dark:border-white/10`}
                  aria-label="Save to kitchen wishlist"
                >
                  <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Postal PIN Code Serviceability Check */}
            <div className="pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-espresso mb-2 dark:text-ivory">
                Check Delivery Serviceability
              </p>
              <form onSubmit={checkPincode} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="min-w-0 flex-1 rounded-xl border border-sandstone bg-ivory px-3.5 py-2 text-xs text-espresso outline-none focus:border-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-sandstone bg-porcelain px-4 py-2 text-xs font-bold text-espresso hover:bg-sandstone/20 transition dark:bg-[#1D151A] dark:border-white/10 dark:text-ivory"
                >
                  Check
                </button>
              </form>
              {pinStatus && (
                <p className={`mt-2 text-xs font-semibold ${pinStatus.valid ? 'text-successGreen dark:text-sage' : 'text-errorRed'}`}>
                  {pinStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16 border-t border-sandstone pt-10 dark:border-white/10">
          <div className="flex border-b border-sandstone dark:border-white/10">
            {['overview', 'provenance', 'storage', 'reviews'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === tab
                    ? 'border-terracotta text-terracotta font-extrabold dark:border-apricot dark:text-apricot'
                    : 'border-transparent text-warmStone hover:text-espresso dark:text-ivory/60'
                }`}
              >
                {tab === 'overview' && 'Overview & Description'}
                {tab === 'provenance' && 'Farm Provenance'}
                {tab === 'storage' && 'Storage & Shelf Life'}
                {tab === 'reviews' && `Verified Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="max-w-2xl space-y-4">
                <p className="text-xs leading-relaxed text-warmStone dark:text-ivory/80">
                  {product.description || 'Carefully graded and inspected at central distribution to guarantee peak freshness and nutrition.'}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sandstone dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warmStone">Category</span>
                    <p className="text-xs font-semibold text-espresso dark:text-ivory">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warmStone">Dispatched From</span>
                    <p className="text-xs font-semibold text-espresso dark:text-ivory">Central Cold-Chain Hub</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'provenance' && (
              <div className="max-w-2xl space-y-3">
                <h4 className="font-serif text-base font-semibold text-espresso dark:text-ivory">
                  Grower Origin Information
                </h4>
                <p className="text-xs text-warmStone dark:text-ivory/80">
                  {product.farmSource || 'Sourced directly from verified organic partner growers in Maharashtra and Himachal.'}
                </p>
                <div className="rounded-xl border border-sandstone bg-ivory p-4 dark:bg-[#1D151A] dark:border-white/10">
                  <p className="text-xs font-bold text-espresso dark:text-ivory">Harvest Date</p>
                  <p className="text-xs text-warmStone mt-0.5 dark:text-ivory/70">{product.harvestDate || 'Harvested within 24 hours of intake'}</p>
                  <p className="text-xs font-bold text-espresso mt-3 dark:text-ivory">Freshness Index</p>
                  <p className="text-xs text-successGreen font-bold mt-0.5">{product.freshnessScore || 98}% Grade A+ Inspected</p>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="max-w-2xl space-y-3">
                <h4 className="font-serif text-base font-semibold text-espresso dark:text-ivory">
                  Recommended Storage Instructions
                </h4>
                <p className="text-xs text-warmStone leading-relaxed dark:text-ivory/80">
                  {product.storageInstructions || 'Store in a cool, dry pantry away from direct sunlight. Refrigerate leafy greens immediately upon doorstep handover.'}
                </p>
                <p className="text-xs text-warmStone mt-2 dark:text-ivory/80">
                  Estimated Shelf Life: <strong className="text-espresso dark:text-ivory">{product.shelfLife || '3–7 days from delivery'}</strong>
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-6">
                {/* Submit Review Form */}
                <form onSubmit={handleSubmitReview} className="rounded-xl border border-sandstone bg-ivory p-5 dark:bg-[#1D151A] dark:border-white/10">
                  <h4 className="font-serif text-sm font-semibold text-espresso dark:text-ivory mb-3">
                    Write a Verified Review
                  </h4>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-warmStone">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-harvestAmber hover:scale-110 transition"
                      >
                        <Star size={16} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your culinary notes on freshness and flavor..."
                    className="w-full rounded-lg border border-sandstone bg-porcelain p-2.5 text-xs text-espresso outline-none focus:border-terracotta dark:bg-[#251D21] dark:border-white/10 dark:text-ivory"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-3 rounded-lg bg-terracotta px-4 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-[#9C432A] transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-warmStone">No reviews posted yet. Be the first to share your notes!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="rounded-xl border border-sandstone bg-ivory p-4 dark:bg-[#1D151A] dark:border-white/10">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-espresso dark:text-ivory">{rev.userName || 'Verified Customer'}</span>
                          <div className="flex text-harvestAmber">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-warmStone leading-relaxed dark:text-ivory/80">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
