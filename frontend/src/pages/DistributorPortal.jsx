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
  Languages,
  X,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageCaptureInput from '../components/ImageCaptureInput';

const DistributorPortal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

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
      showToast('Failed to load distribution hub data', 'error');
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
      showToast(
        isHindi
          ? 'शाखा प्रोडक्ट सबमिट हो गया! एडमिन सत्यापन के बाद लाइव होगा।'
          : 'Distribution inventory submitted! Super admin will review and publish live.'
      );
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
      showToast(err.response?.data?.message || 'Error submitting branch product', 'error');
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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] text-[#192D2A] dark:text-[#F8FAFC] pb-24 transition-colors">
      {/* Editorial Header */}
      <section className="border-b border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                <Building2 size={14} />
                <span>{isHindi ? 'क्षेत्रीय वितरण हब' : 'Regional Distribution Hub'}</span>
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
              {stats?.branchName || `${user?.name || 'Regional'} Logistics Hub`}
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1">
              {isHindi
                ? `जिला हब: ${stats?.villageOrArea || 'केंद्रीय लॉजिस्टिक्स केंद्र'} • प्रबंधित इनवेंटरी एवं आपूर्ति श्रृंखला`
                : `District Hub: ${stats?.villageOrArea || 'Central Logistics Center'} • Managed Inventory & Cold-Chain Supply`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
            >
              <PackagePlus size={16} />
              <span>{isHindi ? '+ नया प्रोडक्ट जोड़ें' : '+ Add Branch Product'}</span>
            </button>
            <button
              onClick={loadDistributorData}
              className="p-2.5 bg-white dark:bg-[#162723] border border-[#DDD5C8] dark:border-[#2A443E] rounded-xl hover:bg-[#F1E8D8]/50 transition shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Verification Policy Alert */}
        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3.5 shadow-xs">
          <ShieldCheck size={22} className="text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 dark:text-blue-200">
            <p className="font-bold text-sm">
              {isHindi
                ? 'सुपर एडमिन सत्यापन नीति (Mandatory Admin Approval Workflow)'
                : 'Mandatory Administrator Verification Protocol'}
            </p>
            <p className="mt-1 text-blue-800/90 dark:text-blue-300/80 leading-relaxed">
              {isHindi
                ? 'डिस्ट्रीब्यूटर द्वारा जोड़े गए किसी भी नए प्रोडक्ट को सुपर एडमिन द्वारा अप्रूव किए जाने के बाद ही ग्राहक स्टोर पर लाइव दिखाया जाता है।'
                : 'All incoming stock submitted by regional distributors is reviewed by the Super Administrator before appearing on the customer storefront to ensure cold-chain quality.'}
            </p>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'कुल इनवेंटरी आइटम्स' : 'Branch Catalog Items'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#192D2A] dark:text-[#F8FAFC]">{stats?.totalItems || 0}</p>
          </div>

          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'लाइव बिक रहे प्रोडक्ट्स' : 'Approved & Live'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-[#17745A] dark:text-[#10B981]">{stats?.approvedItems || 0}</p>
          </div>

          <div className="bg-white dark:bg-[#13221E] p-5 rounded-3xl border border-[#DDD5C8] dark:border-[#223832] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
              {isHindi ? 'जांच प्रक्रिया में' : 'Awaiting Admin Approval'}
            </p>
            <p className="font-serif text-3xl font-bold mt-1 text-amber-600">{stats?.pendingItems || 0}</p>
          </div>
        </div>

        {/* Inventory Directory */}
        <div className="bg-white dark:bg-[#13221E] rounded-3xl border border-[#DDD5C8] dark:border-[#223832] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'शाखा इनवेंटरी सूची' : 'Branch Stock Directory'}
              </h2>
              <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-0.5">
                {isHindi
                  ? 'आपके द्वारा सबमिट किए गए प्रोडक्ट्स और उनके अप्रूवल की स्थिति।'
                  : 'Manage submitted products, wholesale costs, and live catalog publication status.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#17745A] dark:text-[#10B981] hover:underline"
            >
              + {isHindi ? 'नया प्रोडक्ट जोड़ें' : 'Add Stock Item'}
            </button>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#A7B3AF]">
              <Boxes size={40} className="mx-auto mb-3 text-[#DDD5C8] dark:text-[#2A443E]" />
              <p className="font-bold text-sm">No products listed by this branch yet.</p>
              <p className="mt-1">Click "+ Add Branch Product" above to submit stock for Super Admin review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DDD5C8] dark:border-[#223832] text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#A7B3AF]">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Base Cost (₹)</th>
                    <th className="pb-3">MRP (₹)</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD5C8]/50 dark:divide-[#223832]">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-[#FDFBF7] dark:hover:bg-[#162723] transition">
                      <td className="py-3.5 font-bold flex items-center gap-2.5">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-[#DDD5C8] dark:border-[#2A443E] shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-[#192D2A] dark:text-[#F8FAFC]">{p.name}</span>
                          <p className="text-[10px] text-[#625F59] dark:text-[#A7B3AF] font-normal">{p.unit}</p>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#625F59] dark:text-[#A7B3AF]">{p.category}</td>
                      <td className="py-3.5 font-bold text-sm text-[#17745A] dark:text-[#10B981]">₹{p.price}</td>
                      <td className="py-3.5 text-[#625F59] dark:text-[#A7B3AF]">₹{p.mrp}</td>
                      <td className="py-3.5 font-semibold text-[#192D2A] dark:text-[#F8FAFC]">{p.stock}</td>
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
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
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

      {/* Add Product Modal with Camera Capture */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8]/70 dark:border-[#223832]">
              <h3 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                {isHindi ? 'शाखा में प्रोडक्ट जोड़ें' : 'Add Branch Catalog Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#625F59] hover:bg-black/5 dark:text-[#A7B3AF]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Premium Basmati Rice"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Staples">Staples</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="e.g. 1 kg / 500g"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="120"
                    className="input-field font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    placeholder="150"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="100"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Integrated Image & Camera Capture */}
              <ImageCaptureInput
                value={newProduct.image}
                onChange={(img) => setNewProduct({ ...newProduct, image: img })}
                label="Product Image (Camera / File)"
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD5C8]/60 dark:border-[#223832]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Submit for Approval
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
