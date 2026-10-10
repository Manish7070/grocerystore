import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  SlidersHorizontal,
  Trash2,
  User,
  Sun,
  Truck,
  X,
  MapPin,
  ChevronDown,
  Sparkles,
  ArrowRight,
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
  `relative px-3 py-1 text-xs uppercase tracking-[0.16em] font-bold transition-all duration-200 ${
    isActive
      ? 'text-terracotta font-extrabold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-terracotta dark:text-apricot dark:after:bg-apricot'
      : 'text-warmStone hover:text-espresso dark:text-ivory/70 dark:hover:text-ivory'
  }`;

const popularSearches = ['San Marzano Tomatoes', 'Himachal Royal Apples', 'A2 Desi Cultured Ghee', 'Artisan Sourdough', 'Dehradun Basmati', 'Cold Pressed Mustard Oil'];

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
    showToast('Signed out successfully', 'info');
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

  return (
    <header className="sticky top-0 z-50 border-b border-sandstone bg-porcelain/95 backdrop-blur-md transition-colors dark:bg-[#191416]/95 dark:border-white/10">
      {/* Top Heritage Utility Bar */}
      <div className="hidden border-b border-sandstone/70 px-4 py-1.5 text-[11px] font-medium text-warmStone md:block dark:border-white/5 dark:text-ivory/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-espresso font-semibold dark:text-ivory">
              <MapPin size={12} className="text-terracotta" />
              Direct From Independent Growers & Master Roasters
            </span>
            <span className="h-3 w-[1px] bg-sandstone dark:bg-white/10" />
            <span>Complimentary Temperature-Sealed Dispatch on Orders Above ₹499</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/track" className="hover:text-espresso dark:hover:text-ivory transition">Track Order</Link>
            <span className="h-3 w-[1px] bg-sandstone dark:bg-white/10" />
            <Link to="/waste-center" className="hover:text-espresso dark:hover:text-ivory transition flex items-center gap-1 text-terracotta dark:text-apricot font-semibold">
              <Sparkles size={11} /> Smart Savings (Less Waste)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Commerce Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          {/* Brand Monogram & Wordmark */}
          <Brand onClick={closeMenus} />

          {/* Center: Intelligent Product Search */}
          <div ref={searchRef} className="relative hidden max-w-md flex-1 lg:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              className={`flex items-center gap-2 rounded-xl border bg-ivory px-4 py-2 transition-all duration-200 dark:bg-[#251D21] ${
                searchFocused ? 'border-terracotta ring-1 ring-terracotta/30 dark:border-apricot' : 'border-sandstone dark:border-white/10'
              }`}
            >
              <Search size={15} className="text-warmStone shrink-0 dark:text-ivory/50" />
              <input
                type="text"
                value={navSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search farm harvest, pantry essentials, spices..."
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-espresso outline-none placeholder:text-warmStone dark:text-ivory"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => setNavSearch('')}
                  className="rounded-full p-0.5 text-warmStone hover:text-espresso dark:text-ivory/60"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Quick Search Palette */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-sandstone bg-ivory p-4 shadow-floating z-50 dark:bg-[#251D21] dark:border-white/10">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-warmStone mb-2 dark:text-ivory/50">
                  Curated Searches
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
                      className="rounded-lg border border-sandstone bg-porcelain px-3 py-1 text-xs font-medium text-espresso transition hover:border-terracotta hover:bg-terracotta hover:text-ivory dark:bg-[#1D151A] dark:text-ivory dark:border-white/10"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="border-t border-sandstone pt-2.5 flex items-center justify-between text-[11px] text-warmStone dark:border-white/10 dark:text-ivory/60">
                  <span>Press <kbd className="font-mono bg-sandstone/50 px-1 py-0.5 rounded text-[10px] text-espresso dark:bg-white/10 dark:text-ivory">Enter</kbd> to search</span>
                  <Link to="/shop" onClick={closeMenus} className="font-bold text-terracotta hover:underline dark:text-apricot">
                    Explore All Aisles →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/shop?category=Vegetables" className={navLinkClass}>Fresh Market</NavLink>
            <NavLink to="/bundles" className={navLinkClass}>Recipe Kits</NavLink>
            <NavLink to="/waste-center" className={navLinkClass}>Smart Savings</NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-sandstone bg-ivory text-espresso transition-transform hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-[#251D21] dark:text-ivory"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/watchlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-sandstone bg-ivory text-espresso transition-transform hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-[#251D21] dark:text-ivory"
              aria-label="Kitchen Wishlist"
            >
              <Heart size={16} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-ivory">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <div ref={cartRef} className="relative">
              <button
                type="button"
                onClick={() => setCartOpen((prev) => !prev)}
                className="relative flex h-10 items-center gap-2 rounded-xl border border-terracotta bg-terracotta px-3.5 text-ivory transition-transform hover:opacity-95 active:scale-95 shadow-subtle"
                aria-label={`Basket with ${totalItems} items`}
              >
                <ShoppingCart size={15} />
                <span className="text-xs font-bold font-sans">
                  ₹{total.toFixed(0)}
                </span>
                {totalItems > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ivory text-terracotta px-1 text-[10px] font-black">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Drawer Preview */}
              {cartOpen && (
                <div className="absolute right-0 mt-3 w-[min(92vw,380px)] overflow-hidden rounded-xl border border-sandstone bg-ivory shadow-floating z-50 dark:bg-[#251D21] dark:border-white/10">
                  <div className="flex items-center justify-between border-b border-sandstone bg-porcelain px-4 py-3 dark:bg-[#1D151A] dark:border-white/10">
                    <div>
                      <p className="font-serif text-sm font-semibold text-espresso dark:text-ivory">Your Grocery Basket</p>
                      <p className="text-[11px] font-medium text-warmStone dark:text-ivory/60">{totalItems} item{totalItems === 1 ? '' : 's'} selected</p>
                    </div>
                    <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-1 text-warmStone hover:text-espresso dark:text-ivory/60">
                      <X size={15} />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <ShoppingBag size={34} className="mx-auto mb-2 text-sandstone" />
                        <p className="font-serif text-sm font-medium text-espresso dark:text-ivory">Your basket is waiting</p>
                        <p className="text-xs text-warmStone mt-1 dark:text-ivory/60">Explore fresh farm harvest and recipe kits.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 rounded-lg border border-sandstone/70 bg-porcelain p-2.5 dark:bg-[#1D151A] dark:border-white/5">
                          <ProductArtwork product={item} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-espresso dark:text-ivory">{item.name}</p>
                            <p className="text-[11px] font-medium text-warmStone dark:text-ivory/60">Qty {item.quantity} · ₹{item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            className="rounded-lg p-1 text-warmStone hover:bg-errorRed/10 hover:text-errorRed transition"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-sandstone p-4 bg-ivory dark:bg-[#251D21] dark:border-white/10">
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-warmStone dark:text-ivory/60">Subtotal</span>
                        <span className="font-serif text-base font-bold text-espresso dark:text-ivory">₹{total.toFixed(0)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-lg border border-sandstone py-2 text-xs font-bold text-espresso hover:bg-sandstone/20 dark:border-white/20 dark:text-ivory"
                        >
                          View Basket
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-lg bg-terracotta py-2 text-xs font-bold text-ivory hover:bg-[#9C432A] transition"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-sandstone bg-ivory px-3 text-xs font-bold text-espresso transition hover:border-terracotta dark:border-white/10 dark:bg-[#251D21] dark:text-ivory"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-ivory text-[10px] font-serif">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </span>
                  <span className="hidden sm:inline-block max-w-[85px] truncate">{user.name || 'Account'}</span>
                  <ChevronDown size={13} className="text-warmStone" />
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="flex h-10 items-center gap-1.5 rounded-xl border border-sandstone bg-ivory px-3.5 text-xs font-bold text-espresso hover:border-terracotta hover:text-terracotta transition dark:border-white/10 dark:bg-[#251D21] dark:text-ivory"
                >
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Profile Menu */}
              {profileOpen && user && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-sandstone bg-ivory py-2 shadow-floating z-50 dark:bg-[#251D21] dark:border-white/10">
                  <div className="border-b border-sandstone px-4 py-2.5 dark:border-white/10">
                    <p className="text-xs font-bold text-espresso truncate dark:text-ivory">{user.name}</p>
                    <p className="text-[11px] text-warmStone truncate dark:text-ivory/60">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/dashboard" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-espresso hover:bg-porcelain dark:text-ivory dark:hover:bg-[#1D151A]">
                      <LayoutDashboard size={14} className="text-warmStone" /> Customer Overview
                    </Link>
                    <Link to="/orders" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-espresso hover:bg-porcelain dark:text-ivory dark:hover:bg-[#1D151A]">
                      <Package size={14} className="text-warmStone" /> Order History
                    </Link>
                    <Link to="/track" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-espresso hover:bg-porcelain dark:text-ivory dark:hover:bg-[#1D151A]">
                      <Truck size={14} className="text-warmStone" /> Track Active Order
                    </Link>
                    <Link to="/settings" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-espresso hover:bg-porcelain dark:text-ivory dark:hover:bg-[#1D151A]">
                      <Settings size={14} className="text-warmStone" /> Account Settings
                    </Link>
                  </div>
                  {(user.role === 'admin' || user.role === 'inventory_manager' || user.role === 'delivery') && (
                    <div className="border-t border-sandstone py-1 bg-porcelain/60 dark:bg-[#1D151A]/60 dark:border-white/10">
                      <p className="px-4 py-1 text-[9px] font-extrabold uppercase tracking-widest text-warmStone dark:text-ivory/50">Staff Terminals</p>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-terracotta hover:bg-porcelain dark:text-apricot">
                          <LayoutDashboard size={14} /> Store Admin Console
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'inventory_manager') && (
                        <Link to="/waste-center" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-terracotta hover:bg-porcelain dark:text-apricot">
                          <SlidersHorizontal size={14} /> Freshness Waste Radar
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'delivery') && (
                        <Link to="/delivery" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-terracotta hover:bg-porcelain dark:text-apricot">
                          <Truck size={14} /> Delivery Terminal
                        </Link>
                      )}
                    </div>
                  )}
                  <div className="border-t border-sandstone pt-1 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-errorRed hover:bg-errorRed/5"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-sandstone bg-ivory text-espresso md:hidden dark:border-white/10 dark:bg-[#251D21] dark:text-ivory"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-sandstone py-4 md:hidden dark:border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              className="flex items-center gap-2 rounded-xl border border-sandstone bg-ivory px-3 py-2 mb-4 dark:bg-[#251D21] dark:border-white/10"
            >
              <Search size={15} className="text-warmStone shrink-0" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search fresh provisions..."
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-espresso outline-none dark:text-ivory"
              />
              <button type="submit" className="rounded-lg bg-terracotta px-3 py-1 text-xs font-bold text-ivory">
                Go
              </button>
            </form>

            <div className="flex flex-col space-y-1">
              <Link to="/" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">Home</Link>
              <Link to="/shop" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">All Aisles</Link>
              <Link to="/shop?category=Vegetables" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">Farm Produce</Link>
              <Link to="/bundles" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">1-Click Recipe Kits</Link>
              <Link to="/waste-center" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">Smart Savings & Radar</Link>
              <Link to="/track" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">Track Order</Link>
              <Link to="/watchlist" onClick={closeMenus} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-espresso dark:text-ivory">Saved Items ({watchlist.length})</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
