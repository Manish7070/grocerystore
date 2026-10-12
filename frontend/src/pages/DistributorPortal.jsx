import { useState, useEffect } from 'react';
import {
  Building2,
  PackagePlus,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Boxes,
  Truck,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DistributorPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    mrp: '',
    stock: 100,
    unit: '1 pack',
    image: '',
    description: '',
  });

  const loadDistributorData = async () => {
    setLoading(true);
    try {
      const { data } = await partnerAPI.getDistributorInventory();
      setProducts(data.products || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error('Failed to load distributor data:', err);
      showToast('Distributor portal data load nahi ho paya', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistributorData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await partnerAPI.addDistributorProduct(newProduct);
      showToast('Branch product submit ho gaya! Admin verify karke live karega.');
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: 'Vegetables',
        price: '',
        mrp: '',
        stock: 100,
        unit: '1 pack',
        image: '',
        description: '',
      });
      loadDistributorData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Product submit karne me error aaya', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your branch inventory?`)) return;
    try {
      await partnerAPI.deleteDistributorProduct(id);
      showToast('Branch product removed successfully');
      loadDistributorData();
    } catch (err) {
      showToast('Failed to remove product', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] text-[#192D2A] dark:text-[#F8F3EA] pb-24">
      {/* Editorial Header */}
      <section className="border-b border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#121E1C] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-2">
              <Building2 size={14} />
              <span>Branch & Distributor Portal (शाखा / डिस्ट्रीब्यूटर)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {stats?.branchName || `${user?.name || 'Regional'} Branch Hub`}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1">
              District Hub: {stats?.villageOrArea || 'Central Logistics Center'} &bull; Managed Inventory & Logistics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#192D2A] dark:bg-[#C66B42] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md"
            >
              <PackagePlus size={16} />
              <span>Add Branch Product</span>
            </button>
            <button
              onClick={loadDistributorData}
              className="p-2.5 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl hover:bg-[#F1E8D8] transition"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Gatekeeping Policy Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
          <ShieldCheck size={18} className="text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200">
            <p className="font-bold">
              Mandatory Admin Approval Workflow (सुपर एडमिन सत्यापन नीति)
            </p>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-200/80 leading-relaxed">
              डिस्ट्रीब्यूटर द्वारा जोड़े गए किसी भी नए प्रोडक्ट को सुपर एडमिन द्वारा अप्रूव किए जाने के बाद ही ग्राहक स्टोर पर लाइव दिखाया जाता है। इससे क्वालिटी और सही प्राइसिंग सुनिश्चित होती है।
            </p>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Branch Catalog Items</p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8F3EA]">{stats?.totalItems || 0}</p>
            <p className="text-[10px] text-[#625F59] mt-0.5">कुल रजिस्टर्ड इनवेंटरी</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Approved & Live</p>
            <p className="font-serif text-3xl font-bold mt-1 text-emerald-600">{stats?.approvedItems || 0}</p>
            <p className="text-[10px] text-emerald-700/80 mt-0.5">लाइव बिक रहे प्रोडक्ट्स</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Awaiting Admin Approval</p>
            <p className="font-serif text-3xl font-bold mt-1 text-amber-600">{stats?.pendingItems || 0}</p>
            <p className="text-[10px] text-amber-700/80 mt-0.5">अप्रूवल प्रक्रिया में</p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
            <div>
              <h2 className="font-serif text-lg font-bold">Branch Stock Directory (शाखा इनवेंटरी)</h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                आपके द्वारा सबमिट किए गए प्रोडक्ट्स और उनके अप्रूवल की स्थिति।
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#192D2A] dark:text-[#D9A441] hover:underline"
            >
              + नया प्रोडक्ट जोड़ें
            </button>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
              <Boxes size={40} className="mx-auto mb-3 text-[#DDD5C8] dark:text-white/20" />
              <p className="font-bold text-sm">No products listed by this branch yet.</p>
              <p className="mt-1">Click "Add Branch Product" above to submit stock for Super Admin review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DDD5C8] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Base Cost (₹)</th>
                    <th className="pb-3">MRP (₹)</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD5C8]/50 dark:divide-white/5">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-[#F1E8D8]/30 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 font-bold">
                        {p.name}
                        <p className="text-[10px] text-[#625F59] font-normal">{p.unit}</p>
                      </td>
                      <td className="py-3.5">{p.category}</td>
                      <td className="py-3.5 font-bold text-sm">₹{p.price}</td>
                      <td className="py-3.5 text-[#625F59]">₹{p.mrp}</td>
                      <td className="py-3.5 font-semibold">{p.stock}</td>
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
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Branch Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#162421] p-6 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8] dark:border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <PackagePlus size={18} className="text-[#C66B42]" />
                <span>Submit Branch Inventory Product</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-black/5">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Premium Basmati Rice (5kg Bag)"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  >
                    <option value="Rice">Rice & Grains</option>
                    <option value="Pulses">Pulses & Dals</option>
                    <option value="Oils">Oils & Ghee</option>
                    <option value="Spices">Spices</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="e.g. 5 kg bag / 1 Litre"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Branch Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="350"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    placeholder="420"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="50"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#192D2A] dark:bg-[#C66B42] text-white font-bold uppercase tracking-wider rounded-xl transition shadow-md"
                >
                  Submit for Super Admin Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorPortal;
