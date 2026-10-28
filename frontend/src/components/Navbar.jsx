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
  Store,
  Sprout,
  ShieldCheck,
  X,
  LogIn,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import ProductArtwork from './ProductArtwork';
import Brand from './Brand';
import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';

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

  // NavLink styling with whitespace-nowrap and exact route matching logic
  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact
      ? location.pathname === path && !location.search
      : location.pathname === path;

    return `relative whitespace-nowrap px-2 xl:px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 text-xs 2xl:text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
      isActive
        ? 'text-[#17745A] font-bold after:absolute after:bottom-0 after:left-2 xl:after:left-2.5 2xl:after:left-3.5 after:right-2 xl:after:right-2.5 2xl:after:right-3.5 after:h-[2.5px] after:bg-[#17745A] after:rounded-full dark:text-[#55D6A0] dark:after:bg-[#55D6A0]'
        : 'text-[#192D2A] hover:text-[#17745A] dark:text-[#B6C7BD] dark:hover:text-[#F3F0E6]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 dark:bg-[#0B1714]/95 border-b border-[#DDD5C8]/80 dark:border-[#30483C] shadow-[0_2px_12px_rgba(25,45,42,0.04)] backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 xl:gap-4">
          
          {/* LEFT: Clean Typography Brand Wordmark */}
          <div className="flex shrink-0 items-center">
            <Brand onClick={closeMenus} />
          </div>

          {/* CENTER: Main Navigation Links strictly single-line */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-2 whitespace-nowrap shrink-0" aria-label="Main navigation">
            <Link to="/" onClick={closeMenus} className={getNavLinkClass('/', true)}>
              Home
            </Link>
            <Link to="/shop" onClick={closeMenus} className={getNavLinkClass('/shop', true)}>
              <span className="hidden 2xl:inline">Shop Catalog</span>
              <span className="2xl:hidden">Shop</span>
            </Link>
            <Link to="/fresh-market" onClick={closeMenus} className={getNavLinkClass('/fresh-market')}>
              <span className="hidden 2xl:inline">Fresh Market</span>
              <span className="2xl:hidden">Fresh</span>
            </Link>
            <Link to="/bundles" onClick={closeMenus} className={getNavLinkClass('/bundles')}>
              <span className="hidden 2xl:inline">Recipe Kits</span>
              <span className="2xl:hidden">Kits</span>
            </Link>
            <Link to="/smart-savings" onClick={closeMenus} className={getNavLinkClass('/smart-savings')}>
              <span className="hidden 2xl:inline">Smart Savings</span>
              <span className="2xl:hidden">Deals</span>
            </Link>
          </nav>

          {/* RIGHT: Search, Wishlist, Cart (Icon only, no price), Profile, Theme, Mobile toggle */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-2 xl:gap-2.5">
            
            {/* Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-28 lg:w-36 xl:w-44 2xl:w-60 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch();
                }}
                className={`flex items-center gap-2 rounded-xl border bg-white dark:bg-[#1A2624] px-2.5 xl:px-3 py-2 transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#C66B42] ring-2 ring-[#C66B42]/20 md:w-36 lg:w-48 xl:w-60 2xl:w-72 dark:border-[#D9A441]'
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
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                    onClick={() => setSearchFocused(false)}
                  />
                  <div className="fixed inset-x-3 top-20 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white p-4 shadow-xl dark:bg-[#192624] dark:border-white/10 animate-in fade-in zoom-in-95 duration-150">
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
                </>
              )}
            </div>

            {/* Theme Toggle (Sun/Moon) - Shown in desktop header, and in mobile drawer */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] transition hover:border-[#17745A] hover:text-[#17745A] dark:border-[#223832] dark:bg-[#13221E] dark:text-[#F8FAFC]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* In-App Activity Notification Center - Large desktop header */}
            <div className="hidden 2xl:block shrink-0">
              <NotificationCenter />
            </div>

            {/* Wishlist Link - Large desktop header */}
            <Link
              to="/watchlist"
              onClick={closeMenus}
              className="relative hidden 2xl:flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] transition hover:border-[#C66B42] hover:text-[#C66B42] dark:border-white/10 dark:bg-[#1A2624] dark:text-[#F8F3EA]"
              aria-label="Wishlist"
            >
              <Heart size={15} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-[#C66B42] px-1 text-[9px] font-bold text-white">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button — Clean Icon + Item-Count Badge */}
            <div ref={cartRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCartOpen((prev) => !prev)}
                className="relative flex h-9 w-9 sm:h-10 sm:w-10 2xl:w-auto 2xl:px-3 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#192D2A] bg-[#192D2A] text-white transition hover:bg-[#253D39] active:scale-95 shadow-sm dark:bg-[#C66B42] dark:border-[#C66B42] dark:hover:bg-[#B05932]"
                aria-label={`Shopping basket with ${totalItems} items`}
              >
                <ShoppingCart size={15} className="shrink-0" />
                {totalItems > 0 && (
                  <span className="flex h-4.5 min-w-[18px] sm:h-5 sm:min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#C66B42] dark:bg-white text-white dark:text-[#192D2A] px-1 sm:px-1.5 text-[10px] sm:text-[11px] font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Drawer Dropdown */}
              {cartOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                    onClick={() => setCartOpen(false)}
                  />
                  <div className="fixed inset-x-3 top-20 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[390px] overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white shadow-2xl dark:bg-[#192624] dark:border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-[#DDD5C8] bg-[#F1E8D8]/50 px-4 py-3 dark:bg-[#121E1C] dark:border-white/10">
                      <div>
                        <p className="font-serif text-sm font-semibold text-[#192D2A] dark:text-[#F8F3EA]">Your Market Basket</p>
                        <p className="text-[11px] font-medium text-[#625F59] dark:text-[#F8F3EA]/60">{totalItems} item{totalItems === 1 ? '' : 's'} crated</p>
                      </div>
                      <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-1 text-[#625F59] hover:text-[#192D2A] dark:text-[#F8F3EA]/60" aria-label="Close basket">
                        <X size={15} />
                      </button>
                    </div>

                    <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto p-3 space-y-2">
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
                </>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div ref={profileRef} className="relative shrink-0">
              {user ? (
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex h-9 sm:h-10 shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border border-[#DDD5C8] bg-white px-2 sm:px-2.5 2xl:px-3 text-xs font-bold text-[#192D2A] hover:border-[#C66B42] transition dark:bg-[#1A2624] dark:border-white/10 dark:text-[#F8F3EA]"
                  >
                    <span className="flex h-6 w-6 min-w-[24px] shrink-0 items-center justify-center rounded-full bg-[#192D2A] text-[10px] font-bold text-white dark:bg-[#C66B42]">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="hidden 2xl:inline font-sans">{user.name?.split(' ')[0]}</span>
                  </button>

                  {profileOpen && (
                    <>
                      {/* Backdrop for mobile */}
                      <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="fixed inset-x-3 top-20 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-60 overflow-hidden rounded-2xl border border-[#DDD5C8] bg-white p-2 shadow-xl dark:bg-[#13221E] dark:border-[#223832] animate-in fade-in zoom-in-95 duration-150">
                        <div className="border-b border-[#DDD5C8]/60 p-2.5 dark:border-[#223832]">
                          <p className="text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC]">{user.name}</p>
                          <p className="truncate text-[11px] text-[#625F59] dark:text-[#A7B3AF]">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-[#17745A] dark:text-[#10B981] hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <User size={14} />
                            <span>My Profile & Addresses</span>
                          </Link>

                          <Link
                            to="/watchlist"
                            onClick={closeMenus}
                            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition dark:text-[#F8FAFC]"
                          >
                            <span className="flex items-center gap-2">
                              <Heart size={14} className="text-[#C66B42]" />
                              <span>My Wishlist</span>
                            </span>
                            {watchlist.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C66B42]/10 text-[#C66B42] dark:bg-[#C66B42]/20 dark:text-[#E6BC70]">
                                {watchlist.length}
                              </span>
                            )}
                          </Link>

                        {(user.isAdmin || user.role === 'admin') && (
                          <Link
                            to="/admin"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <ShieldCheck size={14} />
                            <span>Administrator Control Hub</span>
                          </Link>
                        )}
                        {user.role === 'kisan' && (
                          <Link
                            to="/partner/farmer"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <Sprout size={14} />
                            <span>Farmer Produce Exchange</span>
                          </Link>
                        )}
                        {user.role === 'shopkeeper' && (
                          <Link
                            to="/partner/shop"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <Store size={14} />
                            <span>Merchant Storefront Hub</span>
                          </Link>
                        )}
                        {user.role === 'distributor' && (
                          <Link
                            to="/partner/distributor"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <Truck size={14} />
                            <span>Regional Distribution Hub</span>
                          </Link>
                        )}
                        {user.role === 'helper' && (
                          <Link
                            to="/partner/helper"
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-[#F1E8D8]/50 dark:hover:bg-white/5 transition"
                          >
                            <Truck size={14} />
                            <span>Doorstep Delivery Fleet</span>
                          </Link>
                        )}
                        <Link
                          to="/dashboard"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8FAFC] dark:hover:bg-white/5"
                        >
                          <LayoutDashboard size={14} className="text-[#17745A]" />
                          <span>Customer Dashboard</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8FAFC] dark:hover:bg-white/5"
                        >
                          <Package size={14} className="text-[#17745A]" />
                          <span>Orders & Invoices</span>
                        </Link>
                        <Link
                          to="/track"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8FAFC] dark:hover:bg-white/5"
                        >
                          <Truck size={14} className="text-[#17745A]" />
                          <span>Live Delivery Tracking</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={closeMenus}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#192D2A] hover:bg-[#F1E8D8]/50 transition dark:text-[#F8FAFC] dark:hover:bg-white/5"
                        >
                          <Settings size={14} className="text-[#17745A]" />
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
                  </>
                )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Link
                    to="/signin"
                    onClick={closeMenus}
                    className="btn-motion inline-flex h-9 sm:h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#17745A] px-2.5 sm:px-4 text-xs font-bold text-white shadow-sm hover:bg-[#135E49] active:scale-95 transition-all duration-300 dark:bg-[#55D6A0] dark:text-[#0B1714] dark:hover:bg-[#42C48E] dark:hover:shadow-[0_4px_16px_rgba(85,214,160,0.3)]"
                  >
                    <LogIn size={14} className="shrink-0" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle — 3-Line Menu Button (Prominent & Always Visible on Mobile) */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#17745A] bg-[#17745A]/10 text-[#17745A] hover:bg-[#17745A] hover:text-white transition-all duration-200 lg:hidden dark:border-[#55D6A0] dark:bg-[#55D6A0]/10 dark:text-[#55D6A0] dark:hover:bg-[#55D6A0] dark:hover:text-[#0B1714]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with Search & Rich Navigation */}
      {mobileOpen && (
        <div className="border-t border-[#DDD5C8] bg-[#FDFBF7] px-4 py-5 shadow-2xl lg:hidden dark:bg-[#10221B] dark:border-[#30483C] max-h-[85vh] overflow-y-auto">
          {/* Top User Account & Theme Toggle Bar */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-[#DDD5C8]/70 dark:border-[#30483C]">
            {user ? (
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17745A] text-white font-bold text-xs shadow-sm dark:bg-[#55D6A0] dark:text-[#0B1714]">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#192D2A] dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-[#625F59] dark:text-[#A7B3AF] truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={closeMenus}
                className="inline-flex items-center gap-2 rounded-xl bg-[#17745A] px-4 py-2 text-xs font-bold text-white shadow-sm dark:bg-[#55D6A0] dark:text-[#0B1714]"
              >
                <LogIn size={14} />
                <span>Sign In / Register</span>
              </Link>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <NotificationCenter />

              {/* Mobile In-Drawer Theme Switcher */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDD5C8] bg-white text-[#192D2A] transition hover:border-[#17745A] dark:border-[#30483C] dark:bg-[#172C24] dark:text-[#F8FAFC]"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>
          {/* Mobile Search Bar inside Drawer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-[#DDD5C8] bg-white px-3 py-2.5 dark:bg-[#172C24] dark:border-[#30483C]"
          >
            <Search size={16} className="text-[#625F59] dark:text-[#B6C7BD]" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search farm fresh produce, milk, rice..."
              className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#192D2A] outline-none placeholder:text-[#625F59]/70 dark:text-white"
            />
            {navSearch ? (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="text-[#625F59] dark:text-[#B6C7BD]"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-[#17745A] px-2.5 py-1 text-[11px] font-bold text-white dark:bg-[#55D6A0] dark:text-[#0B1714]"
              >
                Go
              </button>
            )}
          </form>

          {/* Quick Search Chips */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {popularSearches.slice(0, 5).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setNavSearch(item);
                  submitSearch(item);
                }}
                className="rounded-lg border border-[#DDD5C8]/80 bg-white/80 px-2 py-1 text-[10px] font-medium text-[#192D2A] dark:bg-[#172C24] dark:text-[#B6C7BD] dark:border-[#30483C]"
              >
                {item}
              </button>
            ))}
          </div>

          <nav className="flex flex-col gap-1 border-t border-[#DDD5C8]/70 pt-3 dark:border-[#30483C]" aria-label="Mobile navigation">
            <Link
              to="/"
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                location.pathname === '/'
                  ? 'bg-[#17745A] text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5'
              }`}
            >
              <span>Home Storefront</span>
              <span className="text-[10px] opacity-70">Main</span>
            </Link>
            <Link
              to="/shop"
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                location.pathname === '/shop'
                  ? 'bg-[#17745A] text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5'
              }`}
            >
              <span>All Provisions Catalog</span>
              <span className="text-[10px] opacity-70">Aisles</span>
            </Link>
            <Link
              to="/fresh-market"
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                location.pathname === '/fresh-market'
                  ? 'bg-[#17745A] text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5'
              }`}
            >
              <span>Fresh Market Harvest</span>
              <span className="text-[10px] text-emerald-600 dark:text-[#55D6A0] font-black">Daily</span>
            </Link>
            <Link
              to="/bundles"
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                location.pathname === '/bundles'
                  ? 'bg-[#17745A] text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5'
              }`}
            >
              <span>Recipe Kits</span>
              <span className="text-[10px] opacity-70">Cook</span>
            </Link>
            <Link
              to="/smart-savings"
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                location.pathname === '/smart-savings'
                  ? 'bg-[#17745A] text-white dark:bg-[#55D6A0] dark:text-[#0B1714]'
                  : 'text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5'
              }`}
            >
              <span>Smart Savings (Zero Waste)</span>
              <span className="text-[10px] font-black text-amber-600 dark:text-[#E6BC70]">Deals</span>
            </Link>

            {/* Account & Orders Section */}
            <div className="pt-3 mt-2 border-t border-[#DDD5C8]/70 dark:border-[#30483C] space-y-1">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#B6C7BD]">
                Kitchen &amp; Order Tools
              </p>
              <Link
                to="/watchlist"
                onClick={closeMenus}
                className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Heart size={14} className="text-[#C66B42]" />
                  <span>Saved Kitchen Essentials</span>
                </span>
                {watchlist.length > 0 && (
                  <span className="rounded-full bg-[#C66B42] px-2 py-0.5 text-[10px] font-bold text-white">
                    {watchlist.length}
                  </span>
                )}
              </Link>
              <Link
                to="/track"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5"
              >
                <Truck size={14} className="text-[#17745A] dark:text-[#55D6A0]" />
                <span>Live Delivery Tracking</span>
              </Link>
              <Link
                to="/orders"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#192D2A] hover:bg-[#F1E8D8] dark:text-[#F3F0E6] dark:hover:bg-white/5"
              >
                <Package size={14} className="text-[#17745A] dark:text-[#55D6A0]" />
                <span>Order History &amp; Invoices</span>
              </Link>
              <Link
                to="/store-pos"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-[#55D6A0] hover:bg-[#F1E8D8] dark:hover:bg-white/5"
              >
                <Store size={14} />
                <span>Store POS Walk-in Terminal</span>
              </Link>
            </div>

            {/* Merchant / Partner Quick Links */}
            <div className="pt-3 mt-2 border-t border-[#DDD5C8]/70 dark:border-[#30483C] space-y-1">
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#B6C7BD]">
                Partner Network
              </p>
              <Link
                to="/merchant/register"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-400 hover:bg-[#F1E8D8] dark:hover:bg-white/5"
              >
                <Store size={14} />
                <span>Register as Merchant (Dukandar)</span>
              </Link>
              <Link
                to="/logistics/register"
                onClick={closeMenus}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-400 hover:bg-[#F1E8D8] dark:hover:bg-white/5"
              >
                <Truck size={14} />
                <span>Register Logistics &amp; Store Hub</span>
              </Link>
            </div>

            {/* Account / Auth CTA */}
            <div className="pt-4 mt-2 border-t border-[#DDD5C8]/70 dark:border-[#30483C]">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#172C24] border border-[#DDD5C8]/60 dark:border-[#30483C]">
                    <p className="text-xs font-bold text-[#192D2A] dark:text-[#F3F0E6]">{user.name}</p>
                    <p className="text-[11px] text-[#625F59] dark:text-[#B6C7BD] truncate">{user.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#DDD5C8] bg-white py-2.5 text-xs font-bold text-[#192D2A] dark:bg-[#172C24] dark:text-white dark:border-[#30483C]"
                    >
                      <User size={13} />
                      <span>Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/signin"
                  onClick={closeMenus}
                  className="btn-primary flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider"
                >
                  <LogIn size={15} />
                  <span>Sign In or Register</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
