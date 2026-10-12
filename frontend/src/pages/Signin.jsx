import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Brand } from '../components/Brand';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await authAPI.signin(formData);
      login(res.data);
      showToast(`Welcome back to GroceryStore, ${res.data.name || ''}!`);

      if (res.data.role === 'kisan') {
        navigate('/partner/farmer', { replace: true });
      } else if (res.data.role === 'shopkeeper') {
        navigate('/partner/shop', { replace: true });
      } else if (res.data.role === 'distributor') {
        navigate('/partner/distributor', { replace: true });
      } else if (res.data.role === 'helper') {
        navigate('/partner/helper', { replace: true });
      } else if (res.data.role === 'admin' || res.data.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F1215] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#DDD5C8] bg-white shadow-xl dark:bg-[#181B20] dark:border-white/10 grid lg:grid-cols-2">
        {/* Left Side: Rich Artisanal Food Photography */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#122421] p-10 text-white">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
              alt="Fresh harvest provisions"
              className="h-full w-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1614] via-[#0F231F]/80 to-[#0A1614]/60" />
          </div>

          <div className="relative z-10">
            <Brand inverted stacked={false} />
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur border border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              Direct-from-farm daily harvest
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <blockquote className="font-serif text-2xl font-light italic leading-snug text-white/95">
              &ldquo;Good food, thoughtfully harvested and delivered with cold-chain care for your family's table.&rdquo;
            </blockquote>
            <div className="flex items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/80">
              <div>
                <p className="font-serif text-lg font-bold text-white">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">Verified Origin</p>
              </div>
              <div className="h-7 w-px bg-white/20" />
              <div>
                <p className="font-serif text-lg font-bold text-white">Sunrise</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">Daily Picking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Food Banner */}
          <div className="relative mb-6 -mx-6 -mt-6 h-36 overflow-hidden lg:hidden">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh harvest produce"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#181B20] via-black/40 to-transparent" />
            <div className="absolute bottom-3 left-6">
              <Brand compact />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#192D2A] dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#625F59] dark:text-gray-400">
              Sign in to manage your grocery basket, pantry reorders, and deliveries.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] mb-1.5 dark:text-white">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#DDD5C8] bg-[#FDFBF7] py-2.5 pl-10 pr-3 text-sm text-[#192D2A] outline-none placeholder:text-[#625F59]/60 focus:border-[#17745A] focus:ring-1 focus:ring-[#17745A] dark:bg-[#12141A] dark:border-white/10 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] mb-1.5 dark:text-white">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#625F59] dark:text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#DDD5C8] bg-[#FDFBF7] py-2.5 pl-10 pr-10 text-sm text-[#192D2A] outline-none placeholder:text-[#625F59]/60 focus:border-[#17745A] focus:ring-1 focus:ring-[#17745A] dark:bg-[#12141A] dark:border-white/10 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#625F59] hover:text-[#192D2A] dark:text-gray-400 dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17745A] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#135E49] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#55524E] dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-[#17745A] hover:underline dark:text-[#10B981]">
              Create an account
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-semibold text-[#625F59] hover:text-[#192D2A] dark:text-gray-400 dark:hover:text-white">
              &larr; Return to Market Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
