import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, User, Mail, Lock, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Building2, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Brand from '../components/Brand';

const LogisticsRegister = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    serviceType: 'Physical Walk-in Store & In-Store Helper POS Hub',
    serviceArea: 'Station Road & Main Bazaar Sector',
    fleetCount: '4',
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
      setError('Please enter your Hub / Company Name');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: 'distributor',
        partnerProfile: {
          businessName: formData.businessName.trim(),
          villageOrArea: formData.serviceArea.trim(),
          serviceType: formData.serviceType,
          serviceArea: formData.serviceArea.trim(),
          fleetCount: Number(formData.fleetCount) || 1,
          todayPriceUpdated: true,
          isVerified: true,
        },
      });

      showToast('Logistics & Store Hub registered successfully!', 'success');
      navigate('/partner/distributor');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register hub. Please check information.');
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
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck size={14} className="text-teal-300" />
            <span>Logistics &amp; Physical Store Hub Registration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#192D2A] dark:text-white">
            Register Store Hub or Transport Fleet
          </h1>
          <p className="mt-2 text-sm text-[#666056] dark:text-[#94A3B8] max-w-xl mx-auto">
            Operate physical walk-in store outlets with in-store POS helpers, dispatch 10–15 min hyperlocal deliveries, or coordinate regional mandi cold-chain logistics.
          </p>
        </div>

        {/* Comparison Notice Banner */}
        <div className="mb-8 rounded-2xl border border-teal-200 bg-teal-50/70 dark:border-teal-900/60 dark:bg-teal-950/20 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-800 text-white shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#192D2A] dark:text-white">
                  Logistics &amp; Store Hub Partner
                </h3>
                <p className="text-xs text-[#524E46] dark:text-[#94A3B8] mt-0.5">
                  &bull; Walk-in counter POS &bull; Create Store Helper IDs &bull; Manage transport &bull; Coordinate doorstep delivery
                </p>
              </div>
            </div>
            <Link
              to="/merchant/register"
              className="text-xs font-bold text-teal-800 dark:text-teal-300 hover:underline shrink-0"
            >
              Are you an individual Kirana / Merchant? Click Here &rarr;
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
            {/* Hub Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Company / Hub / Store Center Name *
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. TaazaDaily Station Road Physical Store Hub"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Service / Operating Model Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-4 py-2.5 text-sm font-medium text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                >
                  <option value="Physical Walk-in Store & In-Store Helper POS Hub">Physical Walk-in Store &amp; In-Store Helper POS Hub</option>
                  <option value="Hyperlocal 10-15 Min Doorstep Delivery Fleet">Hyperlocal 10-15 Min Doorstep Delivery Fleet</option>
                  <option value="Regional Mandi Cold-Chain Transit Hub">Regional Mandi Cold-Chain Transit Hub</option>
                  <option value="Integrated Outlet + Transport Center">Integrated Outlet + Transport Center</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  Service Area / Delivery Sector Zone *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                  <input
                    type="text"
                    name="serviceArea"
                    required
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="e.g. Station Road & Ward 3 / Main Bazaar"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                  POS Counters or Delivery Vehicles Count *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  name="fleetCount"
                  required
                  value={formData.fleetCount}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] px-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Manager Credentials Divider */}
            <div className="border-t border-[#DDD5C8]/80 dark:border-white/10 pt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-4">
                Hub Manager / Administrator Access
              </h4>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Manager's Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Verma"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9822334455"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rajesh@stationroadhub.in"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Account Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-white mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-teal-600" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={6}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-[#2A443E] bg-[#FDFBF7] dark:bg-[#182925] pl-10 pr-4 py-2.5 text-sm text-[#192D2A] dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-800 to-emerald-800 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Logistics Hub...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Register Logistics &amp; Store Hub</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center text-xs text-[#7A746E] dark:text-[#94A3B8]">
              Already registered as a partner?{' '}
              <Link to="/signin" className="font-bold text-teal-800 dark:text-teal-400 hover:underline">
                Sign In to Hub Terminal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogisticsRegister;
