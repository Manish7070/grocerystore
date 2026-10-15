import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Brand } from '../components/Brand';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Store, Sprout, Truck, ShoppingCart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    businessName: '',
    villageOrArea: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        partnerProfile: {
          businessName: formData.businessName || formData.name,
          villageOrArea: formData.villageOrArea || 'Local Ward Hub',
        },
      });
      login(res.data);
      showToast(`Welcome! Account successfully registered.`);

      if (formData.role === 'kisan') navigate('/partner/farmer');
      else if (formData.role === 'shopkeeper') navigate('/partner/shop');
      else if (formData.role === 'distributor') navigate('/partner/distributor');
      else navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check your details.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    { id: 'customer', label: 'Consumer', icon: ShoppingCart },
    { id: 'kisan', label: 'Farmer / Orchard', icon: Sprout },
    { id: 'shopkeeper', label: 'Merchant / Store', icon: Store },
    { id: 'distributor', label: 'Logistics Hub', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] flex items-center justify-center p-3 sm:p-6 lg:p-10 transition-colors">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] shadow-xl grid lg:grid-cols-2">
        {/* Left Side: Clean Visible Produce Photography */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#122421] p-10 text-white min-h-[580px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
              alt="Artisanal sourdough and farm produce"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </div>

          <div className="relative z-10">
            <Brand inverted stacked={false} />
          </div>

          <div className="relative z-10">
            <p className="font-serif text-xl font-medium text-white/95 leading-relaxed drop-shadow-sm">
              Join our network of mindful eaters, artisan millers, and local farm producers.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-4 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* Mobile Food Banner */}
          <div className="relative mb-6 -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 h-32 sm:h-36 overflow-hidden lg:hidden">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
              alt="Artisan food provisions"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13221E] via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 sm:left-6">
              <Brand compact />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#192D2A] dark:text-[#F8FAFC]">
              Create an Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#625F59] dark:text-[#A7B3AF]">
              Register for fresh daily deliveries and smart pantry reorders.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                Registering As
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {accountTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.role === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: type.id })}
                      className={`py-2 px-1.5 sm:px-2 rounded-xl border text-[10px] sm:text-[11px] font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 ${
                        isSelected
                          ? 'bg-[#17745A] text-white border-[#17745A] shadow-xs dark:bg-[#10B981] dark:border-[#10B981]'
                          : 'bg-[#FDFBF7] text-[#192D2A] border-[#DDD5C8] hover:border-[#17745A] dark:bg-[#162723] dark:text-[#F8FAFC] dark:border-[#2A443E]'
                      }`}
                    >
                      <Icon size={13} className="shrink-0" />
                      <span className="truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.role !== 'customer' && (
              <div className="p-3.5 rounded-2xl bg-[#F1E8D8]/50 dark:bg-[#162723] border border-[#DDD5C8] dark:border-[#2A443E] space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    {formData.role === 'kisan' ? 'Orchard / Farm Name' : 'Establishment / Store Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder={formData.role === 'kisan' ? 'e.g. Rampur Orchard Farms' : 'e.g. Central Grocery Merchant'}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                    Local Ward / Panchayat Sector
                  </label>
                  <input
                    type="text"
                    value={formData.villageOrArea}
                    onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                    placeholder="e.g. Ward 3, Main Bazaar"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#A7B3AF]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#A7B3AF]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#A7B3AF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#625F59] hover:text-[#192D2A] dark:text-[#A7B3AF] dark:hover:text-[#F8FAFC]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-[#A7B3AF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 btn-primary flex w-full items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              {loading ? 'Registering Account...' : 'Complete Registration'}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#625F59] dark:text-[#A7B3AF]">
            Already have an account?{' '}
            <Link to="/signin" className="font-bold text-[#17745A] hover:underline dark:text-[#10B981]">
              Sign in here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-semibold text-[#625F59] hover:text-[#192D2A] dark:text-[#A7B3AF] dark:hover:text-[#F8FAFC]">
              &larr; Return to Market Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
