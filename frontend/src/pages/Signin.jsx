import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Brand } from '../components/Brand';
import { ArrowRight, ShieldCheck, Clock, Award, Eye, EyeOff } from 'lucide-react';
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
      showToast('Welcome back to GroceryStore');
      navigate(returnTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
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
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
          alt="GroceryStore Market Atmosphere"
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
            <span>Member Access</span>
          </div>
        </div>

        <div className="relative z-10 my-10 max-w-md">
          <p className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-4">
            &ldquo;Thoughtfully curated everyday essentials, delivered with exacting care.&rdquo;
          </p>
          <p className="text-[#E7E2D9] text-sm leading-relaxed">
            Sign in to access your customized pantry reorders, active dispatch timelines, and curated seasonal releases.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold text-white">100% Quality</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">Guaranteed freshness</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <Clock size={16} />
                <span className="text-xs font-semibold text-white">Cold Chain</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">FEFO-managed transit</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                <Award size={16} />
                <span className="text-xs font-semibold text-white">Verified</span>
              </div>
              <span className="text-[11px] text-[#E7E2D9]/80">Ethical farm sourcing</span>
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
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C66B42]">Member Authentication</span>
            <h1 className="font-serif text-3xl text-[#242321] font-semibold mt-1 mb-2 dark:text-white">Welcome Back</h1>
            <p className="text-[#55524E] text-sm dark:text-[#E7E2D9]/80">
              Please enter your credentials to access your GroceryStore account.
            </p>
          </div>

          {location.state?.sessionExpired && (
            <div role="status" className="mb-6 rounded-xl bg-[#F6F0E5] border border-[#C66B42]/30 p-4 text-xs text-[#242321] leading-relaxed dark:bg-[#242321] dark:text-[#F8F3EA]">
              Your session expired. Sign in again to continue — your basket items have been safely preserved.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl mb-6 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider dark:text-white">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
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
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E9DDCA] text-center dark:border-white/10">
            <p className="text-xs text-[#55524E] dark:text-[#E7E2D9]/80">
              Don&apos;t have an account yet?{' '}
              <Link
                to="/signup"
                state={{ from: returnTo }}
                className="font-bold text-[#C66B42] hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
