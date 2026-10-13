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
  Sprout,
  X,
  Languages,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageCaptureInput from '../components/ImageCaptureInput';

const FarmerPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [produceList, setProduceList] = useState([]);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  const [newCrop, setNewCrop] = useState({
    name: '',
    category: 'Vegetables',
    kisanPrice: '',
    stock: 50,
    unit: '1 kg',
    image: '',
    description: '',
  });

  const loadFarmerData = async () => {
    setLoading(true);
    try {
      const [produceRes, ordersRes] = await Promise.all([
        partnerAPI.getFarmerProduce(),
        partnerAPI.getFarmerOrders(),
      ]);
      setProduceList(produceRes.data.produce || []);
      setStats(produceRes.data.stats || null);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error('Failed to load farmer portal data:', err);
      showToast('Failed to load farmer portal data', 'error');
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
      showToast(
        isHindi
          ? 'फसल सफलतापूर्वक सबमिट हो गई! एडमिन सत्यापन के बाद लाइव होगी।'
          : 'Crop harvest submitted successfully! Super admin will verify and publish.'
      );
      setShowAddForm(false);
      setNewCrop({
        name: '',
        category: 'Vegetables',
        kisanPrice: '',
        stock: 50,
        unit: '1 kg',
        image: '',
        description: '',
      });
      loadFarmerData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting harvest listing', 'error');
    }
  };

  const quickCrops = [
    { name: 'Fresh Potatoes (आलू)', category: 'Vegetables', price: 20 },
    { name: 'Red Onions (प्याज)', category: 'Vegetables', price: 28 },
    { name: 'Roma Tomatoes (टमाटर)', category: 'Vegetables', price: 22 },
    { name: 'Farm Carrots (गाजर)', category: 'Vegetables', price: 25 },
    { name: 'Fresh Cauliflower (फूलगोभी)', category: 'Vegetables', price: 30 },
    { name: 'Shimla Apples (सेब)', category: 'Fruits', price: 75 },
    { name: 'Robusta Bananas (केला)', category: 'Fruits', price: 35 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] text-[#192D2A] dark:text-[#F8FAFC] pb-24 transition-colors">
      {/* Editorial Header */}
      <section className="border-b border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Sprout size={14} />
                <span>{isHindi ? 'किसान उत्पाद विनिमय' : 'Farmer Produce Exchange'}</span>
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setIsHindi((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#162723] text-[#17745A] dark:text-[#10B981] hover:bg-[#F1E8D8]/50 transition"
              >
                <Languages size={13} />
                <span>{isHindi ? 'English Mode' : 'हिंदी मोड'}</span>
              </button>
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {stats?.farmName || `${user?.name || 'Local'}'s Organic Orchard`}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1">
              {isHindi
                ? `स्थान: ${stats?.village || 'स्थानीय पंचायत वार्ड'} • प्रत्यक्ष फार्म-टू-कंज्यूमर इंजन`
                : `Location: ${stats?.village || 'Local Panchayat Ward'} • Direct Farm-to-Consumer Engine`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
            >
              <PlusCircle size={16} />
              <span>{isHindi ? '+ नई फसल जोड़ें' : '+ Add Fresh Harvest'}</span>
            </button>
            <button
              onClick={loadFarmerData}
              className="p-2.5 bg-white dark:bg-[#162723] border border-[#DDD5C8] dark:border-[#2A443E] rounded-xl hover:bg-[#F1E8D8]/50 transition shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Fair Price Guarantee Card */}
        <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5 shadow-xs">
          <ShieldCheck size={22} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 dark:text-emerald-200">
            <p className="font-bold text-sm">
              {isHindi
                ? 'किसान सुरक्षित खरीद मूल्य नीति (Kisan Dual-Price Protection Guarantee)'
                : 'Farmer Dual-Price Protection Guarantee (Zero Middleman Margin)'}
            </p>
            <p className="mt-1 text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
              {isHindi
                ? 'यहाँ आपकी फसल का जो भाव (Kisan Asking Rate) दर्ज होगा, आपको बिक्री पर वही पूरा भुगतान मिलेगा। एडमिन द्वारा ग्राहक के लिए तय किया गया अंतिम रिटेल मार्जिन पूरी तरह सुरक्षित रहता है।'
                : 'You are guaranteed 100% of your registered Asking Rate upon consumer sale. Retail margins and transport logistics are managed transparently without broker intervention.'}
            </p>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'कुल पंजीकृत फसलें' : 'Total Crop Listings'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8FAFC]">{stats?.totalListings || 0}</p>
          </div>

          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'लाइव बिक रही हैं' : 'Approved & Live'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#17745A] dark:text-[#10B981]">{stats?.approvedListings || 0}</p>
          </div>

          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'जांच प्रक्रिया में' : 'Awaiting Admin Review'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-amber-600">{stats?.pendingListings || 0}</p>
          </div>

          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'उपलब्ध ताज़ा स्टॉक' : 'Harvest Stock (Kg)'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8FAFC]">{stats?.totalStockUnits || 0}</p>
          </div>
        </div>

        {/* Produce Directory */}
        <div className="bg-white dark:bg-[#13221E] rounded-3xl border border-[#DDD5C8] dark:border-[#223832] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'मेरी ताज़ा फसलें' : 'Harvest Produce Catalog'}
              </h2>
              <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-0.5">
                {isHindi
                  ? 'आपके द्वारा सबमिट की गई फसल, आपका तय किया हुआ भाव और लाइव अप्रूवल स्थिति।'
                  : 'Track your submitted produce batches, asking farmgate rates, and real-time approval status.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-[#17745A] dark:text-[#10B981] hover:underline"
            >
              + {isHindi ? 'नई फसल दर्ज करें' : 'Register New Crop'}
            </button>
          </div>

          {produceList.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#A7B3AF]">
              <Wheat size={40} className="mx-auto mb-3 text-[#DDD5C8] dark:text-[#2A443E]" />
              <p className="font-bold text-sm">No crops registered yet.</p>
              <p className="mt-1">Click "+ Add Fresh Harvest" above to register your first orchard produce batch!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produceList.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-[#DDD5C8] dark:border-[#223832] bg-[#FDFBF7] dark:bg-[#162723] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#DDD5C8] dark:border-[#2A443E] bg-white shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-serif font-bold text-sm text-[#192D2A] dark:text-[#F8FAFC]">{p.name}</p>
                          <span className="text-[11px] text-[#625F59] dark:text-[#A7B3AF]">{p.category} &bull; {p.unit}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.approvalStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {p.approvalStatus === 'approved' ? 'Live' : 'Review'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#DDD5C8]/60 dark:border-[#223832] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#625F59] dark:text-[#A7B3AF] block text-[10px] uppercase font-bold">Your Farm Payout</span>
                        <span className="font-serif font-bold text-base text-[#17745A] dark:text-[#10B981]">₹{p.kisanBasePrice || p.price}</span>
                        <span className="text-[11px] text-[#625F59] dark:text-[#A7B3AF]"> / {p.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#625F59] dark:text-[#A7B3AF] block text-[10px] uppercase font-bold">Stock Available</span>
                        <span className="font-bold text-xs text-[#192D2A] dark:text-[#F8FAFC]">{p.stock} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Harvest Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
              <h3 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'ताज़ा फसल दर्ज करें' : 'Register Fresh Harvest Crop'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-lg text-[#625F59] hover:bg-black/5 dark:text-[#A7B3AF]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Roma Tomatoes"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Quick Select Buttons */}
              <div>
                <span className="text-[11px] font-semibold text-[#625F59] dark:text-[#A7B3AF] block mb-1.5">
                  Quick Select Common Harvests:
                </span>
                <div className="flex flex-wrap gap-1">
                  {quickCrops.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        setNewCrop({
                          ...newCrop,
                          name: c.name,
                          category: c.category,
                          kisanPrice: c.price,
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded-lg border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#162723] hover:border-[#17745A] text-[#192D2A] dark:text-[#F8FAFC]"
                    >
                      {c.name.split(' ')[0]} (₹{c.price})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Your Payout Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newCrop.kisanPrice}
                    onChange={(e) => setNewCrop({ ...newCrop, kisanPrice: e.target.value })}
                    className="input-field font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Available Qty (Stock)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newCrop.stock}
                    onChange={(e) => setNewCrop({ ...newCrop, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Integrated Image & Camera Capture */}
              <ImageCaptureInput
                value={newCrop.image}
                onChange={(img) => setNewCrop({ ...newCrop, image: img })}
                label="Harvest Photo (Mobile Camera or Gallery)"
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD5C8]/60 dark:border-[#223832]">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Submit Harvest
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
