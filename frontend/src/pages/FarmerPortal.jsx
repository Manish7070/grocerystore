import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wheat,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Phone,
  MapPin,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FarmerPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [produceList, setProduceList] = useState([]);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCrop, setNewCrop] = useState({
    name: '',
    category: 'Vegetables',
    kisanPrice: '',
    stock: 50,
    unit: '1 kg',
    description: '',
  });

  const loadFarmerData = async () => {
    setLoading(true);
    try {
      const [produceRes, ordersRes] = await Promise.all([
        partnerAPI.getFarmerProduce(),
        partnerAPI.getFarmerOrders(),
      ]);
      setProduceList(produceRes.data.produce);
      setStats(produceRes.data.stats);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load farmer portal data:', err);
      showToast('Kisan portal data load nahi ho paya', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerData();
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      await partnerAPI.addFarmerProduce(newCrop);
      showToast('Fasal safaltapoorvak submit ho gayi! Admin verify karke live karega.');
      setShowAddForm(false);
      setNewCrop({
        name: '',
        category: 'Vegetables',
        kisanPrice: '',
        stock: 50,
        unit: '1 kg',
        description: '',
      });
      loadFarmerData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Fasal submit karne me error aaya', 'error');
    }
  };

  // Common quick-fill crops for Indian farmers
  const quickCrops = [
    { name: 'Fresh Potatoes (आलू)', category: 'Vegetables', price: 20 },
    { name: 'Red Onions (लाल प्याज)', category: 'Vegetables', price: 28 },
    { name: 'Roma Tomatoes (देशी टमाटर)', category: 'Vegetables', price: 22 },
    { name: 'Farm Carrots (गाजर)', category: 'Vegetables', price: 25 },
    { name: 'Fresh Cauliflower (फूलगोभी)', category: 'Vegetables', price: 30 },
    { name: 'Shimla Apples (सेब)', category: 'Fruits', price: 75 },
    { name: 'Robusta Bananas (केला)', category: 'Fruits', price: 35 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] text-[#192D2A] dark:text-[#F8F3EA] pb-24">
      {/* Editorial Header */}
      <section className="border-b border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#121E1C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
              <Wheat size={14} />
              <span>Kisan Producer Command Hub (किसान साथी)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {stats?.farmName || `${user?.name || 'Kisan'}'s Farm`}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1 flex items-center gap-2">
              <MapPin size={13} className="text-[#C66B42]" />
              <span>Location: {stats?.village || 'Local Panchayat Ward'} &bull; Direct Farm-to-Consumer Engine</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17745A] hover:bg-[#125c47] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md"
            >
              <PlusCircle size={16} />
              <span>Add Fresh Harvest (नई फसल जोड़ें)</span>
            </button>
            <button
              onClick={loadFarmerData}
              className="p-2.5 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl hover:bg-[#F1E8D8] transition"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Pricing Privacy Guarantee Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <EyeOff size={18} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold">
              Kisan Dual-Price Protection Guarantee (सुरक्षित खरीद मूल्य नीति)
            </p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
              यहाँ आपकी फसल का जो भाव (Kisan Asking Rate) दर्ज होगा, आपको बिक्री पर वही पूरा भुगतान मिलेगा। एडमिन द्वारा ग्राहक के लिए तय किया गया अंतिम रिटेल मार्जिन पूरी तरह गोपनीय रहता है और किसी बिचौलिए की दखलंदाजी नहीं होती।
            </p>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Total Crop Listings</p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8F3EA]">{stats?.totalListings || 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">कुल पंजीकृत फसलें</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Approved & Live</p>
            <p className="font-serif text-3xl font-bold mt-1 text-emerald-600">{stats?.approvedListings || 0}</p>
            <p className="text-[10px] text-emerald-700/80 mt-0.5">स्टोर पर लाइव बिक रही हैं</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Awaiting Admin Review</p>
            <p className="font-serif text-3xl font-bold mt-1 text-amber-600">{stats?.pendingListings || 0}</p>
            <p className="text-[10px] text-amber-700/80 mt-0.5">जांच प्रक्रिया में</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Harvest Stock (Kg)</p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#C66B42]">{stats?.totalStockUnits || 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">उपलब्ध ताज़ा स्टॉक</p>
          </div>
        </div>

        {/* Crops Inventory Section */}
        <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
            <div>
              <h2 className="font-serif text-lg font-bold">Meri Fasal Catalog (मेरी ताज़ा फसलें)</h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                आपके द्वारा सबमिट की गई फसल, आपका तय किया हुआ भाव और लाइव अप्रूवल स्थिति।
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-[#17745A] hover:underline"
            >
              + नई फसल दर्ज करें
            </button>
          </div>

          {produceList.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
              <Wheat size={40} className="mx-auto mb-3 text-[#DDD5C8] dark:text-white/20" />
              <p className="font-bold text-sm">Abhi tak koi fasal register nahi hui hai.</p>
              <p className="mt-1">ऊपर दिए गए "Add Fresh Harvest" बटन पर क्लिक करके अपनी पहली ताज़ा फसल जोड़ें!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DDD5C8] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">
                    <th className="pb-3">Crop Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Your Base Rate (Kharid Mulya)</th>
                    <th className="pb-3">Stock Available</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD5C8]/50 dark:divide-white/5">
                  {produceList.map((p) => (
                    <tr key={p._id} className="hover:bg-[#F1E8D8]/30 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 font-bold text-sm">
                        {p.name}
                        <p className="text-[10px] text-[#625F59] font-normal">Registered {new Date(p.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3.5">{p.category}</td>
                      <td className="py-3.5">
                        <span className="font-bold text-sm text-[#17745A]">
                          ₹{p.kisanBasePrice}
                        </span>
                        <span className="text-[10px] text-[#625F59]"> / {p.unit}</span>
                      </td>
                      <td className="py-3.5 font-semibold">
                        {p.stock} {p.unit}
                      </td>
                      <td className="py-3.5">
                        {p.approvalStatus === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                            <CheckCircle2 size={12} />
                            <span>Approved & Live</span>
                          </span>
                        )}
                        {p.approvalStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                            <Clock size={12} />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {p.approvalStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 uppercase">
                            <XCircle size={12} />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right text-[11px] text-[#625F59] dark:text-[#E7E2D9]/70">
                        {p.approvalStatus === 'rejected' ? (
                          <span className="text-red-600 font-semibold">{p.rejectionReason || 'Quality check issue'}</span>
                        ) : p.approvalStatus === 'approved' ? (
                          <span className="text-emerald-600 font-semibold">Verified A-Grade</span>
                        ) : (
                          <span>In Queue</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Direct Local Customer Delivery Hub */}
        <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDD5C8]/60 dark:border-white/10">
            <div>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <Truck size={18} className="text-[#C66B42]" />
                <span>Nearby Customer Direct Orders (नजदीकी डिलीवरी)</span>
              </h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                अगर आपके खेत के 1–2 किमी के दायरे में ग्राहक है, तो आप खुद डिलीवर करके अतिरिक्त डिलीवरी कमाई ले सकते हैं।
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
              फिलहाल कोई नजदीकी ऑर्डर पेंडिंग नहीं है। जैसे ही आपके गांव/एरिया से ऑर्डर आएगा, यहाँ सायरन बजेगा!
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord._id} className="p-4 rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-[#F1E8D8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-sm">{ord.deliveryAddress?.name} ({ord.deliveryAddress?.phone})</p>
                    <p className="text-[#625F59]">{ord.deliveryAddress?.address}, {ord.deliveryAddress?.city}</p>
                    <p className="text-emerald-700 font-semibold mt-1">Payment: {ord.paymentMethod?.toUpperCase()} (₹{ord.totalAmount})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${ord.deliveryAddress?.phone}`}
                      className="px-3 py-1.5 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] rounded-lg font-bold flex items-center gap-1 hover:bg-[#F1E8D8]"
                    >
                      <Phone size={13} />
                      <span>Call Customer</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Crop Harvest */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#162421] p-6 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8] dark:border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <Wheat size={18} className="text-[#17745A]" />
                <span>Nayi Fasal Register Karein (नई फसल दर्ज करें)</span>
              </h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-full hover:bg-black/5">
                ✕
              </button>
            </div>

            {/* Quick Fill Buttons */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase text-[#625F59] mb-1.5">Quick Pick Crop (लोकप्रिय फसलें):</p>
              <div className="flex flex-wrap gap-1.5">
                {quickCrops.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setNewCrop({ ...newCrop, name: c.name, category: c.category, kisanPrice: c.price })}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-[#F1E8D8]/60 dark:bg-white/10 border border-[#DDD5C8] dark:border-white/10 rounded-lg hover:border-[#17745A] hover:text-[#17745A]"
                  >
                    {c.name} (₹{c.price})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Crop Name (फसल का नाम)</label>
                <input
                  type="text"
                  required
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  placeholder="e.g. Organic Farm Potatoes (आलू)"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category (श्रेणी)</label>
                  <select
                    value={newCrop.category}
                    onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  >
                    <option value="Vegetables">Vegetables (सब्जियां)</option>
                    <option value="Fruits">Fruits (फल)</option>
                    <option value="Rice">Rice & Grains (अनाज)</option>
                    <option value="Pulses">Pulses & Dals (दालें)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit (इकाई)</label>
                  <input
                    type="text"
                    value={newCrop.unit}
                    onChange={(e) => setNewCrop({ ...newCrop, unit: e.target.value })}
                    placeholder="1 kg"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                    Aapka Rate (₹ per unit) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCrop.kisanPrice}
                    onChange={(e) => setNewCrop({ ...newCrop, kisanPrice: e.target.value })}
                    placeholder="e.g. 20"
                    className="w-full rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#1A2624] px-3 py-1.5 font-bold text-sm outline-none"
                  />
                  <p className="text-[10px] text-emerald-800/80 mt-1">यह भाव किसान को पूरा मिलेगा</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F1E8D8]/50 dark:bg-white/5 border border-[#DDD5C8] dark:border-white/10">
                  <label className="block font-semibold mb-1">
                    Available Harvest Qty (उपलब्ध मात्रा)
                  </label>
                  <input
                    type="number"
                    required
                    value={newCrop.stock}
                    onChange={(e) => setNewCrop({ ...newCrop, stock: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full rounded-lg border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-3 py-1.5 font-bold text-sm outline-none"
                  />
                  <p className="text-[10px] text-[#625F59] mt-1">कुल उपलब्ध किलो</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Farm / Harvest Notes</label>
                <input
                  type="text"
                  value={newCrop.description}
                  onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                  placeholder="e.g. 100% Organic, harvested today at 5:00 AM"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#17745A] hover:bg-[#125c47] text-white font-bold uppercase tracking-wider rounded-xl transition shadow-md"
                >
                  Submit for Admin Approval & Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerPortal;
