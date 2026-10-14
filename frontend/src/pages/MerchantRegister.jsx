import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Lock, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Brand from '../components/Brand';

const MerchantRegister = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    villageOrArea: 'Ward 3 Main Bazaar (300m)',
    storeCategory: 'Kirana & Daily Essentials',
    upiId: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.businessName.trim()) {
      setError('Please enter your Shop / Business Name');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: 'shopkeeper',
        partnerProfile: {
          businessName: formData.businessName.trim(),
          villageOrArea: formData.villageOrArea.trim(),
          storeCategory: formData.storeCategory,
          upiId: formData.upiId.trim(),
          todayPriceUpdated: true,
          isVerified: true,
        },
      });

      showToast('Merchant Store registered successfully! Welcome aboard.', 'success');
      navigate('/partner/shop');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to complete merchant registration. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Brand className="mx-auto mb-3" />
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            <Store size={14} className="text-emerald-300" />
            <span>Merchant &bull; Dukandar Registration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#192D2A] dark:text-white">
            Register Your Neighborhood Shop
          </h1>
          <p className="mt-2 text-sm text-[#666056] dark:text-[#94A3B8] max-w-xl mx-auto">
            Sell directly to thousands of local customers within your 300m–500m sector. Receive orders, pack groceries, and get instant customer settlements.
          </p>
        </div>

        {/* Comparison Notice Banner */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-700 text-white shrink-0">
                <Store size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#192D2A] dark:text-white">
                  Merchant Partner (Shopkeeper / Dukandaar)
                </h3>
                <p className="text-xs text-[#524E46] dark:text-[#94A3B8] mt-0.5">
                  &bull; Manage grocery catalog &bull; Set daily rates &bull; Receive &amp; pack orders &bull; 10-15 min dispatch
                </p>
              </div>
            </div>
            <Link
              to="/logistics/register"
              className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline shrink-0"
            >
              Looking to register a Physical Store Hub / Delivery Fleet? Click Here &rarr;
            </Link>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="rounded-2xl border border-[#E2DBD0] bg-white p-6 sm:p-10 shadow-md dark:border-[#223933] dark:bg-[#142320]">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Shop / Business Name *
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Gupta Kirana & Provisions"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Store Category *
                </label>
                <select
                  name="storeCategory"
                  value={formData.storeCategory}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-4 py-2.5 text-sm font-medium text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Kirana & Daily Essentials">Kirana &amp; Daily Essentials</option>
                  <option value="Farm Fresh Vegetables & Fruits">Farm Fresh Vegetables &amp; Fruits</option>
                  <option value="Organic Staples & Cold-Press">Organic Staples &amp; Cold-Press</option>
                  <option value="Dairy, Ghee & Bakery">Dairy, Ghee &amp; Bakery</option>
                  <option value="Supermarket & General Store">Supermarket &amp; General Store</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Local Ward / Panchayat Sector *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                  <input
                    type="text"
                    name="villageOrArea"
                    required
                    value={formData.villageOrArea}
                    onChange={handleChange}
                    placeholder="e.g. Ward 3 Main Bazaar (300m)"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  UPI ID for Direct Payouts (Optional)
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. sureshgupta@okhdfcbank"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Owner Credentials Divider */}
            <div className="border-t border-[#DDD5C8]/80 dark:border-white/10 pt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4">
                Owner Credentials &amp; Login Access
              </h4>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Owner's Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Suresh Kumar Gupta"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Mobile Number (WhatsApp Enabled) *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9811122233"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. guptakiranastore@gmail.com"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-emerald-600" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={6}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Merchant Store...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Register Store on TaazaDaily</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center text-xs text-[#7A746E] dark:text-[#94A3B8]">
              Already registered as a partner?{' '}
              <Link to="/signin" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                Sign In to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegister;
