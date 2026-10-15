import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, CheckCircle2, Truck, AlertCircle, KeyRound, MapPin, Calendar, Star, Scale, ThumbsUp } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const steps = [
  { key: 'placed', title: 'Order Registered', desc: 'Received & routed to local micro-fulfillment centre' },
  { key: 'confirmed', title: 'Stock Allocated & Verified', desc: 'Batches selected strictly via FEFO freshness rules' },
  { key: 'packed', title: 'Quality Sealed', desc: 'Inspected, insulated & crate-sealed for cold chain' },
  { key: 'out_for_delivery', title: 'Out with Courier', desc: 'Dispatched with verified fleet partner' },
  { key: 'delivered', title: 'Doorstep Handover Complete', desc: 'Verified delivery via security PIN' },
];

const OrderTracking = () => {
  const { orderNumber: urlOrderNumber } = useParams();
  const [query, setQuery] = useState(urlOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(urlOrderNumber));
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Post-delivery feedback state
  const [freshnessRating, setFreshnessRating] = useState(5);
  const [weightAccurate, setWeightAccurate] = useState(true);
  const [deliveryBehaviorRating, setDeliveryBehaviorRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const fetchTracking = (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    ordersAPI.trackOrder(num.trim())
      .then((res) => {
        setOrder(res.data);
        if (res.data.feedback?.submittedAt) {
          setFeedbackSuccess(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Order reference not found. Please double-check your order ID.');
        setOrder(null);
        setLoading(false);
      });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!order?._id) return;
    setSubmittingFeedback(true);
    try {
      await ordersAPI.submitFeedback(order._id, {
        freshnessRating,
        weightAccurate,
        deliveryBehaviorRating,
        comments: feedbackComments,
      });
      showToast('Aapka feedback safalta-poorvak darj ho gaya!');
      setFeedbackSuccess(true);
      fetchTracking(order.orderNumber);
    } catch (err) {
      showToast('Feedback submit karne me error aaya', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  useEffect(() => {
    if (urlOrderNumber) {
      fetchTracking(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-apricot/30 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta uppercase tracking-wider mb-4">
            <Truck size={14} />
            <span>Cold-Chain Transit Timeline</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-espresso font-semibold tracking-tight">
            Track Your Order
          </h1>
          <p className="mt-3 text-warmStone text-xs sm:text-base font-sans leading-relaxed">
            Follow your harvest basket from temperature-controlled packing to doorstep arrival.
          </p>

          <form onSubmit={handleSearch} className="mt-6 sm:mt-8 flex items-center max-w-md mx-auto bg-porcelain border border-sandstone rounded-xl p-1.5 shadow-sm focus-within:border-terracotta transition-colors">
            <Search size={18} className="ml-2.5 sm:ml-3 text-warmStone shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. GS-2026-928173"
              className="min-w-0 flex-1 bg-transparent px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-espresso placeholder:normal-case placeholder:tracking-normal placeholder:text-warmStone/70 outline-none"
            />
            <button
              type="submit"
              className="bg-terracotta text-ivory px-3.5 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-terracotta/90 transition-colors shrink-0"
            >
              Locate
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading && (
          <div className="bg-ivory rounded-2xl border border-sandstone p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-terracotta border-t-transparent" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-warmStone">Retrieving Dispatch Telemetry...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-900 mb-6">
            <AlertCircle size={18} className="shrink-0 text-red-700" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Primary Order Details & Doorstep PIN */}
            <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sandstone pb-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Order Identifier</span>
                  <p className="font-serif text-2xl sm:text-3xl text-espresso font-semibold mt-0.5">{order.orderNumber}</p>
                  <p className="text-xs text-warmStone mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Secure Handover OTP */}
                {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && order.deliveryOtp && (
                  <div className="bg-porcelain border border-terracotta/30 rounded-xl p-4 text-center sm:text-right">
                    <div className="flex items-center justify-center sm:justify-end gap-1.5 text-terracotta text-xs font-semibold uppercase tracking-wider mb-1">
                      <KeyRound size={14} />
                      <span>Delivery Security PIN</span>
                    </div>
                    <p className="font-mono text-3xl font-bold tracking-widest text-espresso">{order.deliveryOtp}</p>
                    <p className="text-[11px] text-warmStone mt-1">Share with courier at delivery</p>
                  </div>
                )}
              </div>

              {/* Progress Stepper Timeline */}
              <div className="mt-8">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-warmStone mb-6">
                  Fulfillment Status
                </h2>
                <div className="relative space-y-6 pl-7 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-sandstone">
                  {steps.map((step) => {
                    const state = getStepStatus(step.key, order.deliveryStatus);
                    const isDone = state === 'completed';
                    const isCurr = state === 'current';

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <span
                          className={`absolute -left-7 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                            isDone
                              ? 'border-terracotta bg-terracotta text-ivory'
                              : isCurr
                              ? 'border-terracotta bg-ivory text-terracotta ring-4 ring-terracotta/10'
                              : 'border-sandstone bg-ivory text-warmStone/50'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                        </span>
                        <div>
                          <p className={`font-serif ${isCurr ? 'text-lg text-terracotta font-semibold' : isDone ? 'text-sm text-espresso font-semibold' : 'text-sm text-warmStone'}`}>
                            {step.title}
                            {isCurr && (
                              <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider rounded bg-apricot/40 text-terracotta">
                                Current Status
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-warmStone mt-0.5 font-sans leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit Parameters */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-sandstone pt-6">
                <div className="p-4 rounded-xl bg-porcelain border border-sandstone/60">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warmStone mb-1">
                    <Calendar size={13} className="text-terracotta" />
                    <span>Scheduled Delivery Window</span>
                  </div>
                  <p className="text-xs font-medium text-espresso mt-1">{order.deliverySlot}</p>
                </div>
                <div className="p-4 rounded-xl bg-porcelain border border-sandstone/60">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warmStone mb-1">
                    <MapPin size={13} className="text-terracotta" />
                    <span>Destination Address</span>
                  </div>
                  <p className="text-xs font-medium text-espresso mt-1">
                    {order.deliveryAddress?.name}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city} &ndash; {order.deliveryAddress?.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Manifest Items Breakdown */}
            <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-espresso font-semibold">Crated Goods ({order.items?.length || 0})</h3>
                <span className="text-xs text-warmStone">Verified batch allocation</span>
              </div>
              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-porcelain border border-sandstone/60">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-espresso truncate">{item.name}</p>
                      <p className="text-[11px] text-warmStone">Qty: {item.quantity} &bull; {item.unit || 'Standard Pack'}</p>
                    </div>
                    <span className="font-medium text-xs text-espresso ml-4">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-sandstone flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-warmStone">Total Remittance</span>
                <span className="font-serif text-2xl text-espresso font-semibold">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Post-Delivery Quality, Freshness & Weight Feedback */}
            {order.deliveryStatus === 'delivered' && (
              <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 rounded-xl bg-forest/10 text-forest">
                    <Scale size={20} />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-espresso font-semibold">
                      Post-Delivery Quality & Weight Assurance
                    </h3>
                    <p className="text-xs text-warmStone">
                      ताज़ा फल-सब्जी की क्वालिटी और सही तोल (Weight) की पुष्टि करें। आपकी रेटिंग सीधे पार्टनर की विश्वसनीयता तय करती है।
                    </p>
                  </div>
                </div>

                {feedbackSuccess || order.feedback?.submittedAt ? (
                  <div className="mt-4 p-4 rounded-xl bg-forest/10 border border-forest/20 text-forest text-xs font-medium flex items-center gap-3">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <div>
                      <p className="font-bold">धन्यवाद! आपकी डिलीवरी रेटिंग व वज़न रिपोर्ट दर्ज हो चुकी है।</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Freshness: {order.feedback?.freshnessRating || freshnessRating}★ &bull; Weight: {order.feedback?.weightAccurate ?? weightAccurate ? 'Sahi Tha (Accurate)' : 'Kam Nikla (Short Weight)'} &bull; Helper: {order.feedback?.deliveryBehaviorRating || deliveryBehaviorRating}★
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-5 border-t border-sandstone pt-5">
                    {/* 1. Freshness Rating */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">
                        1. Produce Freshness & Quality (सब्जी / फल की ताजगी)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFreshnessRating(star)}
                            className="p-1 text-2xl transition hover:scale-110 focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={
                                star <= freshnessRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-sandstone'
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-warmStone ml-2">
                          {freshnessRating === 5 ? 'A-One Fresh' : freshnessRating >= 4 ? 'Good Quality' : freshnessRating >= 3 ? 'Average' : 'Poor Quality'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Weight Accuracy */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">
                        2. Weight Accuracy (क्या वज़न पूरा और सही था?)
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => setWeightAccurate(true)}
                          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                            weightAccurate
                              ? 'border-forest bg-forest/10 text-forest shadow-sm'
                              : 'border-sandstone bg-porcelain text-warmStone hover:bg-ivory'
                          }`}
                        >
                          <CheckCircle2 size={15} />
                          <span>हाँ, पूरा और सही था</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeightAccurate(false)}
                          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                            !weightAccurate
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                              : 'border-sandstone bg-porcelain text-warmStone hover:bg-ivory'
                          }`}
                        >
                          <AlertCircle size={15} />
                          <span>नहीं, वज़न कम था (Short)</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Delivery Helper Behavior */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">
                        3. Delivery Helper Speed & Behavior (लड़के का व्यवहार)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setDeliveryBehaviorRating(star)}
                            className="p-1 text-2xl transition hover:scale-110 focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={
                                star <= deliveryBehaviorRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-sandstone'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Comments */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1">
                        Any Remarks or Suggestions (कोई शिकायत या सुझाव)
                      </label>
                      <input
                        type="text"
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        placeholder="e.g. Aloo fresh the, helper samay par aaya"
                        className="w-full rounded-xl border border-sandstone bg-porcelain px-3 py-2 text-xs text-espresso outline-none focus:border-terracotta"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-6 py-2.5 bg-forest hover:bg-forest/90 text-ivory text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm disabled:opacity-50"
                    >
                      {submittingFeedback ? 'Submitting Feedback...' : 'Submit Delivery Feedback'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
