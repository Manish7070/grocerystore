import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Bell, Heart, Home, Mail, MapPin, Package, Save, ShieldCheck, ShoppingCart, User, Edit3, LogOut } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useWatchlist } from '../context/WatchlistContext';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { cart, total } = useCart();
  const { watchlist } = useWatchlist();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [deliveryEditing, setDeliveryEditing] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    address: user?.deliveryProfile?.address || '',
    city: user?.deliveryProfile?.city || '',
    pincode: user?.deliveryProfile?.pincode || '',
    preferredSlot: user?.deliveryProfile?.preferredSlot || 'Morning delivery · 8 AM to 11 AM',
  });
  const [loading, setLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
      setDeliveryData({
        address: user.deliveryProfile?.address || '',
        city: user.deliveryProfile?.city || '',
        pincode: user.deliveryProfile?.pincode || '',
        preferredSlot: user.deliveryProfile?.preferredSlot || 'Morning delivery · 8 AM to 11 AM',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data);
      setEditing(false);
      showToast('Profile updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update profile';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out of GroceryStore');
    navigate('/');
  };

  const handleDeliverySave = async (e) => {
    e.preventDefault();
    setDeliveryLoading(true);
    setError('');
    try {
      const res = await api.put('/auth/profile', {
        name: user.name,
        email: user.email,
        deliveryProfile: deliveryData,
      });
      updateUser(res.data);
      setDeliveryEditing(false);
      showToast('Delivery profile updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update delivery profile';
      setError(message);
      showToast(message, 'error');
    } finally {
      setDeliveryLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-16 px-4 bg-porcelain flex items-center justify-center">
        <div className="max-w-md w-full bg-ivory rounded-2xl border border-sandstone p-8 text-center shadow-sm">
          <User size={48} className="mx-auto mb-4 text-warmStone/60" />
          <h2 className="font-serif text-2xl text-espresso font-semibold mb-2">Member Authentication Required</h2>
          <p className="text-xs text-warmStone mb-6">Please sign in to manage your account details and delivery addresses.</p>
          <Link
            to="/signin"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-terracotta text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-terracotta/90 transition-colors shadow-sm"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">Patron Preferences</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight mt-1">
            Account & Delivery Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-warmStone">
            Manage your personal profile, preferred doorstep delivery slots, and saved addresses.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Quick Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-sandstone bg-ivory p-5 shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <ShoppingCart className="mb-3 text-terracotta" size={22} />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Current Basket</p>
            <p className="font-serif text-2xl font-semibold text-espresso mt-1">{cart.length} items</p>
          </div>
          <div className="rounded-2xl border border-sandstone bg-ivory p-5 shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <Heart className="mb-3 text-terracotta" size={22} />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Curated Wishlist</p>
            <p className="font-serif text-2xl font-semibold text-espresso mt-1">{watchlist.length} saved</p>
          </div>
          <div className="rounded-2xl border border-sandstone bg-ivory p-5 shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <Package className="mb-3 text-antiqueBrass" size={22} />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Basket Value</p>
            <p className="font-serif text-2xl font-semibold text-espresso mt-1">₹{total.toFixed(0)}</p>
          </div>
          <div className="rounded-2xl border border-sandstone bg-ivory p-5 shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
            <ShieldCheck className="mb-3 text-aubergine" size={22} />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Membership</p>
            <p className="font-serif text-2xl font-semibold text-espresso mt-1">Verified</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Profile Form */}
          <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-espresso font-semibold mb-2">Member Profile</h2>
            <p className="text-xs text-warmStone mb-6">Your personal contact details associated with orders.</p>

            <form onSubmit={handleSave}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl mb-6 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warmStone" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-porcelain border border-sandstone rounded-xl text-espresso text-sm focus:outline-none focus:border-terracotta disabled:opacity-70"
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warmStone" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-porcelain border border-sandstone rounded-xl text-espresso text-sm focus:outline-none focus:border-terracotta disabled:opacity-70"
                      disabled={!editing}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {editing ? (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-terracotta text-ivory py-3 px-6 rounded-xl hover:bg-terracotta/90 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
                    >
                      {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Save size={16} />}
                      <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-porcelain text-warmStone border border-sandstone py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider hover:text-espresso transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="bg-porcelain border border-sandstone text-espresso py-3 px-6 rounded-xl hover:border-terracotta text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors sm:col-span-2 shadow-sm"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-aubergine text-ivory py-3 px-6 rounded-xl hover:bg-aubergine/90 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors sm:col-span-2 shadow-sm"
                >
                  <LogOut size={16} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Delivery Profile & Preferences */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-[0_2px_12px_rgba(39,34,31,0.04)]">
              <div className="mb-4 flex items-center gap-2.5">
                <MapPin className="text-terracotta" size={20} />
                <h3 className="font-serif text-xl font-semibold text-espresso">Delivery Preferences</h3>
              </div>

              <form onSubmit={handleDeliverySave} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1.5 block font-semibold uppercase tracking-wider text-espresso">Street Address</label>
                  <textarea
                    rows="2"
                    value={deliveryData.address}
                    onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                    placeholder="Apartment, building, lane"
                    disabled={!deliveryEditing}
                    className="w-full rounded-xl border border-sandstone bg-porcelain px-3 py-2.5 text-espresso text-xs focus:outline-none focus:border-terracotta disabled:opacity-70"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-semibold uppercase tracking-wider text-espresso">City</label>
                    <input
                      type="text"
                      value={deliveryData.city}
                      onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                      placeholder="City"
                      disabled={!deliveryEditing}
                      className="w-full rounded-xl border border-sandstone bg-porcelain px-3 py-2.5 text-espresso text-xs focus:outline-none focus:border-terracotta disabled:opacity-70"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-semibold uppercase tracking-wider text-espresso">PIN Code</label>
                    <input
                      type="text"
                      value={deliveryData.pincode}
                      onChange={(e) => setDeliveryData({ ...deliveryData, pincode: e.target.value })}
                      placeholder="PIN Code"
                      disabled={!deliveryEditing}
                      className="w-full rounded-xl border border-sandstone bg-porcelain px-3 py-2.5 text-espresso text-xs focus:outline-none focus:border-terracotta disabled:opacity-70"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-semibold uppercase tracking-wider text-espresso">Default Delivery Slot</label>
                  <select
                    value={deliveryData.preferredSlot}
                    onChange={(e) => setDeliveryData({ ...deliveryData, preferredSlot: e.target.value })}
                    disabled={!deliveryEditing}
                    className="w-full rounded-xl border border-sandstone bg-porcelain px-3 py-2.5 text-espresso text-xs focus:outline-none focus:border-terracotta disabled:opacity-70"
                  >
                    <option>Morning delivery · 8 AM to 11 AM</option>
                    <option>Afternoon delivery · 12 PM to 3 PM</option>
                    <option>Evening delivery · 5 PM to 8 PM</option>
                    <option>Express cold-chain · Within 90 mins</option>
                  </select>
                </div>

                {deliveryEditing ? (
                  <div className="grid gap-2 sm:grid-cols-2 pt-2">
                    <button
                      type="submit"
                      disabled={deliveryLoading}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-terracotta/90 disabled:opacity-60"
                    >
                      <Save size={15} />
                      <span>{deliveryLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryEditing(false)}
                      className="rounded-xl border border-sandstone bg-porcelain px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-warmStone hover:text-espresso"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeliveryEditing(true)}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-sandstone bg-porcelain px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-espresso hover:border-terracotta transition-colors"
                  >
                    <Home size={15} />
                    <span>Edit Address</span>
                  </button>
                )}
              </form>
            </div>

            <div className="rounded-2xl border border-sandstone bg-ivory p-6 shadow-[0_2px_12px_rgba(39,34,31,0.04)]">
              <div className="mb-4 flex items-center gap-2.5">
                <Bell className="text-terracotta" size={20} />
                <h3 className="font-serif text-xl font-semibold text-espresso">Notifications</h3>
              </div>
              <div className="space-y-2.5">
                {['Alert me on pre-harvest seasonal arrivals', 'Send cold-chain delivery dispatch SMS', 'Preserve pantry essentials for instant re-order'].map((item) => (
                  <label key={item} className="flex items-center justify-between gap-4 rounded-xl bg-porcelain border border-sandstone/60 p-3 text-xs text-espresso">
                    <span>{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-sandstone text-terracotta focus:ring-terracotta" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
