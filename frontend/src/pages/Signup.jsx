import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Brand } from '../components/Brand';
import { ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const requestedPath = location.state?.from;
  const returnTo = typeof requestedPath === 'string' && requestedPath.startsWith('/') && !requestedPath.startsWith('//') && !requestedPath.includes('\\') ? requestedPath : '/';
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.signup(formData);
      login(res.data);
      showToast('Welcome to GroceryStore! Your account has been created.');
      navigate(returnTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E5] flex flex-col lg:flex-row dark:bg-[#121817]">
      {/* Editorial Visual Column (Left on Desktop) */}
      <div className="lg:w-1/2 relative bg-[#192D2A] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background Atmosphere Image */}
        <img
          src="https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=1600&q=80"
          alt="GroceryStore Artisan Bakery and Produce"
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#192D2A] via-[#192D2A]/85 to-[#192D2A]/60" />

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <Brand variant="stacked" inverted={true} className="items-start" />
          </Link>
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-[#D9A441] tracking-wider uppercase font-semibold">
            <span>Client Registry</span>
            <span>•</span>
            <span>New Patron Registration</span>
          </div>
        </div>

        <div className="relative z-10 my-10 max-w-md">
          <p className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-4">
            &ldquo;Join our culinary table. Discover everyday essentials elevated.&rdquo;
          </p>
          <p className="text-[#E7E2D9] text-sm leading-relaxed">
            Create an account to save household restocking lists, access exclusive pre-harvest releases, and enjoy complimentary cold-chain dispatch on qualifying orders.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <Sparkles size={16} />
                <span className="text-xs font-semibold text-white">Welcome Benefit</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">₹50 off first order</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <HeartHandshake size={16} />
                <span className="text-xs font-semibold text-white">Direct Source</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">Fair farm margins</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold text-white">Secure Vault</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">Encrypted records</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#E7E2D9]/70 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} GroceryStore Ltd.</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </div>

      {/* Interactive Form Column (Right on Desktop) */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E9DDCA] shadow-sm p-8 sm:p-10 dark:bg-[#1A2322] dark:border-white/10">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C66B42]">New Patron</span>
            <h1 className="font-serif text-3xl text-[#242321] font-semibold mt-1 mb-2 dark:text-white">Create Account</h1>
            <p className="text-[#55524E] text-sm dark:text-[#E7E2D9]/80">
              Register with GroceryStore for personalized pantry orders and live dispatch tracking.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl mb-6 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider mb-2 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Eleanor Vance"
                className="w-full px-4 py-3 bg-[#F6F0E5]/60 border border-[#E9DDCA] rounded-xl text-[#242321] text-sm focus:outline-none focus:ring-2 focus:ring-[#C66B42]/30 focus:border-[#C66B42] transition-colors dark:bg-white/5 dark:border-white/15 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider mb-2 dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-[#F6F0E5]/60 border border-[#E9DDCA] rounded-xl text-[#242321] text-sm focus:outline-none focus:ring-2 focus:ring-[#C66B42]/30 focus:border-[#C66B42] transition-colors dark:bg-white/5 dark:border-white/15 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider mb-2 dark:text-white">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#F6F0E5]/60 border border-[#E9DDCA] rounded-xl text-[#242321] text-sm focus:outline-none focus:ring-2 focus:ring-[#C66B42]/30 focus:border-[#C66B42] transition-colors dark:bg-white/5 dark:border-white/15 dark:text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C66B42] text-white py-3.5 px-6 rounded-xl hover:bg-[#B9583D] font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E9DDCA] text-center dark:border-white/10">
            <p className="text-xs text-[#55524E] dark:text-[#E7E2D9]/80">
              Already have an account?{' '}
              <Link
                to="/signin"
                state={{ from: returnTo }}
                className="font-bold text-[#C66B42] hover:underline ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
