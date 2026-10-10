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
  `relative px-3.5 py-2 text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
    isActive
      ? 'text-copper font-bold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-copper after:rounded-full dark:text-ochre dark:after:bg-ochre'
      : 'text-forest hover:text-copper dark:text-surface/85 dark:hover:text-surface'
  }`;

const popularSearches = [
  'Organic Red Onions',
  'Cavendish Bananas',
  'San Marzano Tomatoes',
  'Alphonso Mango',
  'Artisan Sourdough',
  'A2 Desi Cow Ghee',
  'Fresh Baby Spinach',
  'Dehradun Basmati Rice',
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [pincodeModal, setPincodeModal] = useState(false);
  const [currentPincode, setCurrentPincode] = useState('400001');
  const [tempPincode, setTempPincode] = useState('');

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

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(tempPincode.trim())) {
      setCurrentPincode(tempPincode.trim());
      setPincodeModal(false);
      showToast(`Delivery location set to PIN ${tempPincode.trim()}`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/98 border-b border-sandstoneBorder shadow-sm backdrop-blur-md transition-colors dark:bg-forest/98 dark:border-white/10">
      {/* ─────────────────────────────────────────────────────────────
          SINGLE UNIFIED MAIN NAVIGATION HEADER (No Top Utility Strip)
      ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
          
          {/* LEFT: Custom GS Monogram & GroceryStore Wordmark */}
          <div className="flex shrink-0 items-center">
            <Brand onClick={closeMenus} />
          </div>

          {/* CENTER: Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop Catalog</NavLink>
            <NavLink to="/shop?category=Vegetables" className={navLinkClass}>Fresh Market</NavLink>
            <NavLink to="/bundles" className={navLinkClass}>Recipe Kits</NavLink>
            <NavLink to="/waste-radar" className={navLinkClass}>Smart Savings</NavLink>
          </nav>

          {/* RIGHT: Search, Location Pill, Wishlist, Cart, Profile, Theme, Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Delivery PIN Pill */}
            <button
              type="button"
              onClick={() => {
                setTempPincode(currentPincode);
                setPincodeModal(true);
              }}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sandstoneBorder bg-oat/50 text-xs font-semibold text-forest hover:border-copper transition-colors dark:bg-charcoal dark:border-white/10 dark:text-surface"
              title="Click to change delivery PIN"
            >
              <MapPin size={13} className="text-copper shrink-0" />
              <span>PIN: {currentPincode}</span>
            </button>

            {/* Expandable Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-44 lg:w-56 xl:w-64 transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch();
                }}
                className={`flex items-center gap-2 rounded-xl border bg-surface px-3 py-2 transition-all duration-200 dark:bg-charcoal ${
                  searchFocused
                    ? 'border-copper ring-2 ring-copper/20 w-64 lg:w-72 dark:border-ochre'
                    : 'border-sandstoneBorder hover:border-copper/60 dark:border-white/10'
                }`}
              >
                <Search size={15} className="text-mutedStone shrink-0 dark:text-surface/50" />
                <input
                  type="text"
                  value={navSearch}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search groceries..."
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium text-forest outline-none placeholder:text-mutedStone dark:text-surface"
                />
                {navSearch && (
                  <button
                    type="button"
                    onClick={() => setNavSearch('')}
                    className="rounded-full p-0.5 text-mutedStone hover:text-forest dark:text-surface/60"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Quick Search Dropdown */}
              {searchFocused && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-sandstoneBorder bg-surface p-4 shadow-floating z-50 dark:bg-charcoal dark:border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-mutedStone mb-2 dark:text-surface/60">
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
                        className="rounded-lg border border-sandstoneBorder bg-oat/50 px-2.5 py-1 text-[11px] font-medium text-forest transition hover:border-copper hover:bg-copper hover:text-surface dark:bg-forest dark:text-surface dark:border-white/10"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-sandstoneBorder pt-2.5 flex items-center justify-between text-[11px] text-mutedStone dark:border-white/10 dark:text-surface/60">
                    <span>Press <kbd className="font-mono bg-oat px-1 py-0.5 rounded text-[10px] text-forest dark:bg-forest dark:text-surface">Enter</kbd> to search</span>
                    <Link to="/shop" onClick={closeMenus} className="font-bold text-copper hover:underline dark:text-ochre">
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-sandstoneBorder bg-surface text-forest transition hover:border-copper hover:text-copper dark:border-white/10 dark:bg-charcoal dark:text-surface"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/watchlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-sandstoneBorder bg-surface text-forest transition hover:border-copper hover:text-copper dark:border-white/10 dark:bg-charcoal dark:text-surface"
              aria-label="Kitchen Wishlist"
            >
              <Heart size={16} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-copper px-1 text-[10px] font-bold text-surface">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button & Preview Drawer */}
            <div ref={cartRef} className="relative">
              <button
                type="button"
                onClick={() => setCartOpen((prev) => !prev)}
                className="relative flex h-10 items-center gap-2 rounded-xl border border-copper bg-copper px-3 sm:px-3.5 text-surface transition hover:bg-[#B05932] active:scale-95 shadow-sm"
                aria-label={`Basket containing ${totalItems} items`}
              >
                <ShoppingCart size={15} />
                <span className="text-xs font-bold font-sans">
                  ₹{total.toFixed(0)}
                </span>
                {totalItems > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-surface text-copper px-1 text-[10px] font-black">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Drawer Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-sandstoneBorder bg-surface shadow-floating z-50 dark:bg-charcoal dark:border-white/10">
                  <div className="flex items-center justify-between border-b border-sandstoneBorder bg-oat/50 px-4 py-3 dark:bg-forest dark:border-white/10">
                    <div>
                      <p className="font-serif text-sm font-semibold text-forest dark:text-surface">Your Market Basket</p>
                      <p className="text-[11px] font-medium text-mutedStone dark:text-surface/60">{totalItems} item{totalItems === 1 ? '' : 's'} crated</p>
                    </div>
                    <button type="button" onClick={() => setCartOpen(false)} className="rounded-full p-1 text-mutedStone hover:text-forest dark:text-surface/60">
                      <X size={15} />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <ShoppingBag size={34} className="mx-auto mb-2 text-sandstoneBorder" />
                        <p className="font-serif text-sm font-medium text-forest dark:text-surface">Your basket is waiting</p>
                        <p className="text-xs text-mutedStone mt-1 dark:text-surface/60">Discover fresh produce and culinary recipe kits.</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 rounded-xl border border-sandstoneBorder/60 bg-oat/30 p-2.5 dark:bg-forest/60 dark:border-white/5">
                          <ProductArtwork product={item} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-forest dark:text-surface">{item.name}</p>
                            <p className="text-[11px] font-medium text-mutedStone dark:text-surface/60">Qty {item.quantity} &bull; ₹{item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            className="rounded-lg p-1.5 text-mutedStone hover:bg-errorRed/10 hover:text-errorRed transition"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-sandstoneBorder p-4 bg-surface dark:bg-charcoal dark:border-white/10">
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-mutedStone dark:text-surface/60">Crated Subtotal</span>
                        <span className="font-serif text-base font-bold text-forest dark:text-surface">₹{total.toFixed(0)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-xl border border-sandstoneBorder py-2.5 text-xs font-bold text-forest hover:bg-oat transition dark:border-white/20 dark:text-surface"
                        >
                          View Basket
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={closeMenus}
                          className="flex items-center justify-center rounded-xl bg-copper py-2.5 text-xs font-bold text-surface hover:bg-[#B05932] transition shadow-sm"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <div ref={profileRef} className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-sandstoneBorder bg-surface px-3 text-xs font-bold text-forest transition hover:border-copper dark:border-white/10 dark:bg-charcoal dark:text-surface"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-surface text-[10px] font-serif dark:bg-ochre dark:text-forest">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </span>
                  <span className="hidden sm:inline-block max-w-[85px] truncate">{user.name || 'Account'}</span>
                  <ChevronDown size={13} className="text-mutedStone" />
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="flex h-10 items-center gap-1.5 rounded-xl border border-sandstoneBorder bg-surface px-3.5 text-xs font-bold text-forest hover:border-copper hover:text-copper transition dark:border-white/10 dark:bg-charcoal dark:text-surface"
                >
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Profile Menu Dropdown */}
              {profileOpen && user && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-sandstoneBorder bg-surface py-2 shadow-floating z-50 dark:bg-charcoal dark:border-white/10">
                  <div className="border-b border-sandstoneBorder px-4 py-2.5 dark:border-white/10">
                    <p className="text-xs font-bold text-forest truncate dark:text-surface">{user.name}</p>
                    <p className="text-[11px] text-mutedStone truncate dark:text-surface/60">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/dashboard" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest hover:bg-oat dark:text-surface dark:hover:bg-forest">
                      <LayoutDashboard size={14} className="text-mutedStone" /> Patron Overview
                    </Link>
                    <Link to="/orders" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest hover:bg-oat dark:text-surface dark:hover:bg-forest">
                      <Package size={14} className="text-mutedStone" /> Order History
                    </Link>
                    <Link to="/track" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest hover:bg-oat dark:text-surface dark:hover:bg-forest">
                      <Truck size={14} className="text-mutedStone" /> Track Live Order
                    </Link>
                    <Link to="/settings" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest hover:bg-oat dark:text-surface dark:hover:bg-forest">
                      <Settings size={14} className="text-mutedStone" /> Account Settings
                    </Link>
                  </div>
                  {(user.role === 'admin' || user.role === 'inventory_manager' || user.role === 'delivery') && (
                    <div className="border-t border-sandstoneBorder py-1 bg-oat/50 dark:bg-forest/50 dark:border-white/10">
                      <p className="px-4 py-1 text-[9px] font-extrabold uppercase tracking-widest text-mutedStone dark:text-surface/50">Staff Consoles</p>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-copper hover:bg-oat dark:text-ochre">
                          <LayoutDashboard size={14} /> Store Admin Console
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'inventory_manager') && (
                        <Link to="/waste-radar" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-copper hover:bg-oat dark:text-ochre">
                          <SlidersHorizontal size={14} /> Freshness Waste Radar
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'delivery') && (
                        <Link to="/delivery" onClick={closeMenus} className="flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-copper hover:bg-oat dark:text-ochre">
                          <Truck size={14} /> Delivery Fleet Terminal
                        </Link>
                      )}
                    </div>
                  )}
                  <div className="border-t border-sandstoneBorder pt-1 dark:border-white/10">
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

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-sandstoneBorder bg-surface text-forest lg:hidden dark:border-white/10 dark:bg-charcoal dark:text-surface"
              aria-label="Toggle navigation drawer"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MOBILE NAVIGATION DRAWER
        ───────────────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="border-t border-sandstoneBorder py-4 lg:hidden dark:border-white/10">
            {/* Mobile Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              className="flex items-center gap-2 rounded-xl border border-sandstoneBorder bg-surface px-3 py-2 mb-4 dark:bg-charcoal dark:border-white/10"
            >
              <Search size={15} className="text-mutedStone shrink-0" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search fresh provisions, pantry..."
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-forest outline-none dark:text-surface"
              />
              <button type="submit" className="rounded-lg bg-copper px-3 py-1 text-xs font-bold text-surface">
                Search
              </button>
            </form>

            <div className="flex flex-col space-y-1">
              <Link to="/" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">Home</Link>
              <Link to="/shop" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">All Aisles & Catalog</Link>
              <Link to="/shop?category=Vegetables" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">Fresh Market Produce</Link>
              <Link to="/bundles" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">1-Click Recipe Kits</Link>
              <Link to="/waste-radar" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-copper dark:text-ochre">Smart Savings & Waste Radar</Link>
              <Link to="/track" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">Track Order</Link>
              <Link to="/watchlist" onClick={closeMenus} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-forest dark:text-surface">Saved Items ({watchlist.length})</Link>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PINCODE MODAL
      ───────────────────────────────────────────────────────────── */}
      {pincodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-forest/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-sandstoneBorder bg-surface p-6 shadow-floating dark:bg-charcoal dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-copper" />
                <h3 className="font-serif text-base font-bold text-forest dark:text-surface">Delivery PIN Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setPincodeModal(false)}
                className="rounded-full p-1 text-mutedStone hover:text-forest dark:text-surface/60"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-mutedStone mb-4 leading-relaxed dark:text-surface/70">
              Enter your 6-digit Indian PIN code to verify serviceability and real-time cold-chain delivery slots.
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={tempPincode}
                onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 400001"
                className="w-full rounded-xl border border-sandstoneBorder bg-oat/30 px-4 py-2.5 font-mono text-sm font-bold tracking-widest text-forest outline-none focus:border-copper dark:bg-forest dark:text-surface dark:border-white/10"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPincodeModal(false)}
                  className="rounded-xl border border-sandstoneBorder py-2 text-xs font-semibold text-mutedStone hover:text-forest dark:border-white/10 dark:text-surface/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-copper py-2 text-xs font-bold text-surface hover:bg-[#B05932] transition"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
