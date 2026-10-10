import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  User,
  Sun,
  Truck,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import ProductArtwork from './ProductArtwork';
import Brand from './Brand';
import { useTheme } from '../context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-all ${
    isActive
      ? 'bg-emerald-100 text-emerald-800 shadow-sm'
      : 'text-stone-600 hover:bg-white hover:text-emerald-800 hover:shadow-sm'
  }`;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const profileRef = useRef(null);
  const cartRef = useRef(null);
  const { user, logout } = useAuth();
  const { cart, total, removeItem } = useCart();
  const { watchlist } = useWatchlist();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/');
    }
    closeMenus();
  };

  const profileLinks = [
    { to: '/dashboard', label: 'Customer Overview', icon: LayoutDashboard },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/track', label: 'Track Delivery', icon: Truck },
    { to: '/watchlist', label: 'Saved Watchlist', icon: Heart },
    { to: '/admin', label: 'Store Admin Console', icon: LayoutDashboard },
    { to: '/delivery', label: 'Delivery Terminal', icon: Truck },
    { to: '/waste-center', label: 'Waste Reduction Radar', icon: SlidersHorizontal },
    { to: '/settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-900/5 bg-[#fbfdf9]/90 shadow-[0_10px_30px_rgba(20,92,53,0.06)] backdrop-blur-xl dark:bg-[#0c1712]/95 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3">
          <Brand compact onClick={closeMenus} />

          <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 max-w-md items-center gap-2 rounded-full border border-emerald-900/10 bg-white/90 px-3 py-2 shadow-sm lg:flex dark:bg-stone-900 dark:border-white/10">
            <Search size={18} className="ml-1 text-stone-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Search farm vegetables, milk, basmati..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400 dark:text-white"
            />
            <button type="submit" className="rounded-full bg-[#075F46] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#064D3A]">
              Search
            </button>
          </form>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/bundles" className={navLinkClass}>Recipe Kits</NavLink>
            <NavLink to="/waste-center" className={navLinkClass}>Waste Radar</NavLink>
            <NavLink to="/track" className={navLinkClass}>Track Order</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-2xl border border-emerald-900/10 bg-white p-3 text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-700 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}
            </button>
            <div ref={cartRef} className="relative">
              <button
                type="button"
                onClick={() => setCartOpen((open) => !open)}
                className="relative rounded-2xl border border-emerald-900/10 bg-white p-3 text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-800 hover:shadow-md"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-orange-500 px-1.5 text-center text-xs font-black text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-4 w-[min(90vw,390px)] overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-2xl shadow-stone-950/15">
                  <div className="flex items-center justify-between border-b border-stone-100 bg-emerald-50/70 px-5 py-4">
                    <div>
                      <p className="text-sm font-black text-stone-950">Shopping cart</p>
                      <p className="text-xs font-medium text-stone-500">{totalItems} item{totalItems === 1 ? '' : 's'} in your basket</p>
                    </div>
                    <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-2 text-stone-500 hover:bg-white">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-auto p-3">
                    {cart.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <ShoppingBag size={46} className="mx-auto mb-3 text-emerald-200" />
                        <p className="font-bold text-stone-800">Your basket is empty</p>
                        <p className="mt-1 text-sm text-stone-500">Fresh finds are waiting.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item._id} className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3">
                            <ProductArtwork product={item} className="h-14 w-14 shrink-0 rounded-xl" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-stone-900">{item.name}</p>
                              <p className="text-xs font-semibold text-stone-500">Qty {item.quantity} · ₹{item.price}</p>
                            </div>
                            <button type="button" onClick={() => removeItem(item._id)} className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-stone-100 p-4">
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-stone-500">Subtotal</span>
                      <span className="text-xl font-black text-stone-950">₹{total.toFixed(0)}</span>
                    </div>
                    <Link to="/cart" onClick={closeMenus} className="flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 font-black text-white transition hover:bg-emerald-800">
                      View cart
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-bold text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <User size={18} />
                  </span>
                  <span className="max-w-28 truncate">{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-4 w-64 overflow-hidden rounded-[1.75rem] border border-emerald-900/10 bg-white shadow-2xl shadow-stone-950/10">
                    <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
                      <p className="truncate text-sm font-bold text-stone-950">{user.name}</p>
                      <p className="truncate text-xs text-stone-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {profileLinks.map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} onClick={closeMenus} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800">
                          <Icon size={18} />
                          <span className="flex-1">{label}</span>
                          {label === 'Watchlist' && watchlist.length > 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">{watchlist.length}</span>}
                        </Link>
                      ))}
                      <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/signin" className="rounded-full px-4 py-2 text-sm font-bold text-stone-700 transition hover:bg-white hover:text-emerald-800">Login</Link>
                <Link to="/signup" className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-700">Sign Up</Link>
              </div>
            )}

            <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-2xl border border-emerald-900/10 bg-white p-3 text-stone-700 shadow-sm md:hidden">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-emerald-900/10 py-4 md:hidden">
            <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
              <Search size={18} className="text-stone-400" />
              <input value={navSearch} onChange={(event) => setNavSearch(event.target.value)} placeholder="Search groceries..." className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
            </form>
            <div className="space-y-1">
              <Link to="/" onClick={closeMenus} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-700 hover:bg-white">
                <Home size={18} />
                Home
              </Link>
              <Link to="/cart" onClick={closeMenus} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-700 hover:bg-white">
                <ShoppingCart size={18} />
                Cart ({totalItems})
              </Link>
              <Link to="/#shop" onClick={closeMenus} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-700 hover:bg-white">
                <SlidersHorizontal size={18} />
                Browse categories
              </Link>
              {user ? (
                <>
                  <div className="my-2 rounded-2xl bg-white px-3 py-3">
                    <p className="truncate text-sm font-bold text-stone-900">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                  {profileLinks.map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} onClick={closeMenus} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-700 hover:bg-white">
                      <Icon size={18} />
                      <span className="flex-1">{label}</span>
                      {label === 'Watchlist' && watchlist.length > 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">{watchlist.length}</span>}
                    </Link>
                  ))}
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50">
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/signin" onClick={closeMenus} className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-center text-sm font-bold text-stone-700">Login</Link>
                  <Link to="/signup" onClick={closeMenus} className="rounded-2xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
