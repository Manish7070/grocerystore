import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Brand } from '../components/Brand';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signin = ({ adminMode = false }) => {
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
      showToast(`Welcome back, ${res.data.name || ''}!`);

      if (adminMode || res.data.role === 'admin' || res.data.isAdmin) {
        navigate('/admin', { replace: true });
      } else if (res.data.role === 'kisan') {
        navigate('/partner/farmer', { replace: true });
      } else if (res.data.role === 'shopkeeper') {
        navigate('/partner/shop', { replace: true });
      } else if (res.data.role === 'distributor') {
        navigate('/partner/distributor', { replace: true });
      } else if (res.data.role === 'helper') {
        navigate('/partner/helper', { replace: true });
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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] shadow-xl grid lg:grid-cols-2">
        {/* Left Side: Clean Visible Food Photography without clunky quote overlays */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#122421] p-10 text-white min-h-[520px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
              alt="Farm fresh produce provisions"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle soft gradient that keeps the photo clear and visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </div>

          <div className="relative z-10">
            <Brand inverted stacked={false} />
          </div>

          <div className="relative z-10">
            <p className="font-serif text-xl font-medium text-white/95 leading-relaxed drop-shadow-sm">
              Fresh produce & artisanal provisions, direct from farm gate to your table.
            </p>
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
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13221E] via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-6">
              <Brand compact />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#192D2A] dark:text-[#F8FAFC]">
                {adminMode ? 'Administrator Sign In' : 'Welcome Back'}
              </h1>
              {adminMode && (
                <ShieldCheck size={20} className="text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#625F59] dark:text-[#A7B3AF]">
              {adminMode
                ? 'Enter administrative master credentials to access the central store control hub.'
                : 'Sign in to access your order history, saved addresses, and active deliveries.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#625F59] hover:text-[#192D2A] dark:text-[#A7B3AF] dark:hover:text-[#F8FAFC]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 btn-primary flex w-full items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              {loading ? 'Authenticating...' : adminMode ? 'Sign In as Administrator' : 'Sign In'}
              <ArrowRight size={14} />
            </button>
          </form>

          {!adminMode && (
            <div className="mt-6 text-center text-xs text-[#625F59] dark:text-[#A7B3AF]">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-bold text-[#17745A] hover:underline dark:text-[#10B981]">
                Create an account
              </Link>
            </div>
          )}

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

export default Signin;
