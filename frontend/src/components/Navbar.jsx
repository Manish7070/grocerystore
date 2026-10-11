import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
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

const popularSearches = [
  'Organic Red Onions',
  'Cavendish Bananas',
  'Fresh Roma Tomatoes',
  'Alphonso Mango',
  'Whole Wheat Sourdough',
  'Clarified Butter (Ghee)',
  'Fresh Baby Spinach',
  'Premium Basmati Rice',
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const profileRef = useRef(null);
  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  const { cart, total, removeItem } = useCart();
  const { watchlist } = useWatchlist();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    showToast('Signed out of GroceryStore');
    navigate('/');
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
    setSearchFocused(false);
  };

  const submitSearch = (queryText) => {
    const query = (queryText || navSearch).trim();
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
    closeMenus();
  };

  // NavLink styling with exact route matching logic
  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact
      ? location.pathname === path && !location.search
      : location.pathname === path;

    return `relative px-3.5 py-2 text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
      isActive
        ? 'text-[#C66B42] font-bold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-[#C66B42] after:rounded-full dark:text-[#D9A441] dark:after:bg-[#D9A441]'
        : 'text-[#192D2A] hover:text-[#C66B42] dark:text-[#F8F3EA]/85 dark:hover:text-[#F8F3EA]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 dark:bg-[#121E1C]/95 border-b border-[#DDD5C8]/80 dark:border-white/10 shadow-[0_2px_12px_rgba(25,45,42,0.04)] backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
          
          {/* LEFT: Clean Typography Brand Wordmark */}
          <div className="flex shrink-0 items-center">
            <Brand onClick={closeMenus} />
          </div>

          {/* CENTER: Main Navigation Links with accurate active indicators */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3" aria-label="Main navigation">
            <Link to="/" onClick={closeMenus} className={getNavLinkClass('/', true)}>
              Home
            </Link>
            <Link to="/shop" onClick={closeMenus} className={getNavLinkClass('/shop', true)}>
              Shop Catalog
            </Link>
            <Link to="/fresh-market" onClick={closeMenus} className={getNavLinkClass('/fresh-market')}>
              Fresh Market
            </Link>
            <Link to="/bundles" onClick={closeMenus} className={getNavLinkClass('/bundles')}>
              Recipe Kits
            </Link>
            <Link to="/smart-savings" onClick={closeMenus} className={getNavLinkClass('/smart-savings')}>
              Smart Savings
            </Link>
          </nav>

          {/* RIGHT: Search, Wishlist, Cart (Icon only, no price), Profile, Theme, Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-44 lg:w-56 xl:w-64 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch();
                }}
                className={`flex items-center gap-2 rounded-xl border bg-white dark:bg-[#1A2624] px-3 py-2 transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#C66B42] ring-2 ring-[#C66B42]/20 w-64 lg:w-72 dark:border-[#D9A441]'
                    : 'border-[#DDD5C8] hover:border-[#C66B42]/60 dark:border-white/10'
                }`}
              >
                <Search size={15} className="text-[#625F59] shrink-0 dark:text-[#F8F3EA]/50" />
                <input
                  type="text"
                  value={navSearch}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search groceries..."
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#192D2A] outline-none placeholder:text-[#625F59]/80 dark:text-[#F8F3EA]"
                />
                {navSearch && (
                  <button
                    type="button"
                    onClick={() => setNavSearch('')}
                    className="rounded-full p-0.5 text-[#625F59] hover:text-[#192D2A] dark:text-[#F8F3EA]/60"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Quick Search Dropdown */}
              {searchFocused && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white p-4 shadow-xl z-50 dark:bg-[#192624] dark:border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#625F59] mb-2 dark:text-[#F8F3EA]/60">
                    Curated Market Aisles
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {popularSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setNavSearch(item);
                          submitSearch(item);
                        }}
                        className="rounded-lg border border-[#DDD5C8] bg-[#F1E8D8]/50 px-2.5 py-1 text-[11px] font-medium text-[#192D2A] transition hover:border-[#C66B42] hover:bg-[#C66B42] hover:text-white dark:bg-[#121E1C] dark:text-[#F8F3EA] dark:border-white/10"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#DDD5C8] pt-2.5 flex items-center justify-between text-[11px] text-[#625F59] dark:border-white/10 dark:text-[#F8F3EA]/60">
                    <span>Press <kbd className="font-mono bg-[#F1E8D8] px-1 py-0.5 rounded text-[10px] text-[#192D2A] dark:bg-[#121E1C] dark:text-[#F8F3EA]">Enter</kbd> to search</span>
                    <Link to="/shop" onClick={closeMenus} className="font-bold text-[#C66B42] hover:underline dark:text-[#D9A441]">
                      All Aisles &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] transition hover:border-[#C66B42] hover:text-[#C66B42] dark:border-white/10 dark:bg-[#1A2624] dark:text-[#F8F3EA]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/watchlist"
              onClick={closeMenus}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] transition hover:border-[#C66B42] hover:text-[#C66B42] dark:border-white/10 dark:bg-[#1A2624] dark:text-[#F8F3EA]"
              aria-label="Wishlist"
            >
              <Heart size={16} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C66B42] px-1 text-[10px] font-bold text-white">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button — Clean Icon + Item-Count Badge (NO PRICE DISPLAY IN HEADER) */}
            <div ref={cartRef} className="relative">
              <button
                type="button"
                onClick={() => setCartOpen((prev) => !prev)}
                className="relative flex h-10 w-10 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-xl border border-[#192D2A] bg-[#192D2A] text-white transition hover:bg-[#253D39] active:scale-95 shadow-sm dark:bg-[#C66B42] dark:border-[#C66B42] dark:hover:bg-[#B05932]"
                aria-label={`Shopping basket with ${totalItems} items`}
              >
                <ShoppingCart size={17} />
                {totalItems > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C66B42] dark:bg-white text-white dark:text-[#192D2A] px-1.5 text-[11px] font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Drawer Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white shadow-2xl z-50 dark:bg-[#192624] dark:border-white/10">
                  <div className="flex items-center justify-between border-b border-[#DDD5C8] bg-[#F1E8D8]/50 px-4 py-3 dark:bg-[#121E1C] dark:border-white/10">
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#192D2A] dark:text-[#F8F3EA]">Your Market Basket</p>
                      <p className="text-[11px] font-medium text-[#625F59] dark:text-[#F8F3EA]/60">{totalItems} item{totalItems === 1 ? '' : 's'} crated</p>
                    </div>
                    <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-1 text-[#625F59] hover:text-[#192D2A] dark:text-[#F8F3EA]/60">
                      <X size={15} />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <ShoppingBag size={34} className="mx-auto mb-2 text-[#DDD5C8]" />
                        <p className="font-serif text-sm font-medium text-[#192D2A] dark:text-[#F8F3EA]">Your basket is waiting</p>
                        <p className="text-xs text-[#625F59] mt-1 dark:text-[#F8F3EA]/60">Discover fresh produce and culinary recipe kits.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 rounded-xl border border-[#DDD5C8]/60 bg-[#F1E8D8]/30 p-2.5 dark:bg-[#121E1C]/60 dark:border-white/5">
                          <ProductArtwork product={item} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-[#192D2A] dark:text-[#F8F3EA]">{item.name}</p>
                            <p className="text-[11px] font-medium text-[#625F59] dark:text-[#F8F3EA]/60">Qty {item.quantity} &bull; ₹{item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            className="rounded-lg p-1 text-[#625F59] hover:text-red-600 transition"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-[#DDD5C8] p-4 bg-[#F1E8D8]/30 dark:bg-[#121E1C] dark:border-white/10 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-sm font-bold text-[#192D2A] dark:text-[#F8F3EA]">Subtotal</span>
                        <span className="font-serif text-lg font-bold text-[#C66B42] dark:text-[#D9A441]">₹{total.toFixed(0)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={() => setCartOpen(false)}
                          className="flex items-center justify-center rounded-xl border border-[#DDD5C8] bg-white py-2 text-xs font-bold text-[#192D2A] hover:bg-[#F1E8D8] transition dark:bg-[#192624] dark:text-[#F8F3EA] dark:border-white/10"
                        >
                          View Basket
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={() => setCartOpen(false)}
                          className="flex items-center justify-center rounded-xl bg-[#192D2A] py-2 text-xs font-bold text-white hover:bg-[#253D39] transition dark:bg-[#C66B42]"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div ref={profileRef} className="relative">
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD5C8] bg-white px-2.5 sm:px-3 text-xs font-bold text-[#192D2A] hover:border-[#C66B42] transition dark:bg-[#1A2624] dark:border-white/10 dark:text-[#F8F3EA]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#192D2A] text-[10px] font-bold text-white dark:bg-[#C66B42]">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="hidden sm:inline font-sans">{user.name?.split(' ')[0]}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white p-2 shadow-xl z-50 dark:bg-[#192624] dark:border-white/10">
                      <div className="border-b border-[#DDD5C8]/60 p-2.5 dark:border-white/10">
                        <p className="text-xs font-bold text-[#192D2A] dark:text-[#F8F3EA]">{user.name}</p>
                        <p className="truncate text-[11px] text-[#625F59] dark:text-[#F8F3EA]/60">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8F3EA] dark:hover:bg-white/5"
                        >
                          <LayoutDashboard size={14} className="text-[#C66B42]" />
                          <span>Customer Dashboard</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8F3EA] dark:hover:bg-white/5"
                        >
                          <Package size={14} className="text-[#C66B42]" />
                          <span>Orders & Invoices</span>
                        </Link>
                        <Link
                          to="/track"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8F3EA] dark:hover:bg-white/5"
                        >
                          <Truck size={14} className="text-[#C66B42]" />
                          <span>Live Delivery Tracking</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8F3EA] dark:hover:bg-white/5"
                        >
                          <Settings size={14} className="text-[#C66B42]" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-[#DDD5C8]/60 pt-1 dark:border-white/10">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/signin"
                    onClick={closeMenus}
                    className="flex h-10 items-center justify-center rounded-xl bg-[#192D2A] px-3.5 sm:px-4 text-xs font-bold text-white hover:bg-[#253D39] transition shadow-sm dark:bg-[#C66B42] dark:hover:bg-[#B05932]"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] lg:hidden dark:bg-[#1A2624] dark:border-white/10 dark:text-[#F8F3EA]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-[#DDD5C8] bg-[#FDFBF7] px-4 py-6 shadow-xl lg:hidden dark:bg-[#121E1C] dark:border-white/10">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            <Link to="/" onClick={closeMenus} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F8F3EA] dark:hover:bg-white/5">
              Home
            </Link>
            <Link to="/shop" onClick={closeMenus} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F8F3EA] dark:hover:bg-white/5">
              Shop Catalog
            </Link>
            <Link to="/fresh-market" onClick={closeMenus} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F8F3EA] dark:hover:bg-white/5">
              Fresh Market
            </Link>
            <Link to="/bundles" onClick={closeMenus} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F8F3EA] dark:hover:bg-white/5">
              Recipe Kits
            </Link>
            <Link to="/smart-savings" onClick={closeMenus} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F8F3EA] dark:hover:bg-white/5">
              Smart Savings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
