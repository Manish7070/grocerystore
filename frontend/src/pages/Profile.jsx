import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  MapPin,
  Building,
  CreditCard,
  CheckCircle,
  Package,
  ExternalLink,
  Save,
  Lock,
} from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setName(user.name || '');
    setEmail(user.email || '');
    setAddress(user.deliveryProfile?.address || '');
    setCity(user.deliveryProfile?.city || '');
    setPincode(user.deliveryProfile?.pincode || '');
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({
        name,
        email,
        deliveryProfile: {
          address,
          city,
          pincode,
        },
      });
      login({ ...user, ...res.data });
      showToast('Profile information successfully updated!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Store Administrator', bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
      case 'shopkeeper':
        return { label: 'Merchant / Store Partner', bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
      case 'kisan':
        return { label: 'Direct Producer / Farmer', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
      case 'distributor':
        return { label: 'Regional Logistics Distributor', bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
      default:
        return { label: 'Verified Member / Consumer', bg: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800' };
    }
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B1311] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#17745A] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                  {user.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-1 flex items-center gap-1.5">
                <Mail size={13} /> {user.email}
              </p>
            </div>
          </div>

          {/* Quick Hub Navigation based on Role */}
          <div className="flex flex-wrap items-center gap-2">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Shield size={14} /> Admin Terminal
              </Link>
            )}
            {user.role === 'shopkeeper' && (
              <Link
                to="/partner/shop"
                className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Building size={14} /> Merchant Hub
              </Link>
            )}
            {user.role === 'kisan' && (
              <Link
                to="/partner/farmer"
                className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Building size={14} /> Farmer Portal
              </Link>
            )}
            {user.role === 'distributor' && (
              <Link
                to="/partner/distributor"
                className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Building size={14} /> Logistics Hub
              </Link>
            )}
            <Link
              to="/orders"
              className="btn-secondary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Package size={14} /> My Orders
            </Link>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Role Details & Partner Information */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                Account Attributes
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#625F59] dark:text-[#A7B3AF] block font-medium">User ID</span>
                  <span className="font-mono text-[11px] font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                    {user._id}
                  </span>
                </div>
                <div>
                  <span className="text-[#625F59] dark:text-[#A7B3AF] block font-medium">Account Access</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={13} /> Active & Verified
                  </span>
                </div>
                {user.partnerProfile?.businessName && (
                  <div>
                    <span className="text-[#625F59] dark:text-[#A7B3AF] block font-medium">Registered Establishment</span>
                    <span className="font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                      {user.partnerProfile.businessName}
                    </span>
                  </div>
                )}
                {user.partnerProfile?.villageOrArea && (
                  <div>
                    <span className="text-[#625F59] dark:text-[#A7B3AF] block font-medium">Assigned Sector / Ward</span>
                    <span className="font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                      {user.partnerProfile.villageOrArea}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-[#F1E8D8]/40 dark:bg-[#162723] p-5 text-xs text-[#625F59] dark:text-[#A7B3AF] space-y-2">
              <p className="font-bold text-[#192D2A] dark:text-[#F8FAFC]">🔐 Security & Privacy</p>
              <p>Your personal data is encrypted and used only for doorstep delivery dispatch and order settlement.</p>
            </div>
          </div>

          {/* Right: Personal & Delivery Address Form */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleUpdateProfile}
              className="rounded-3xl border border-[#DDD5C8] dark:border-[#223832] bg-white dark:bg-[#13221E] p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="font-serif text-lg font-bold text-[#192D2A] dark:text-[#F8FAFC]">
                  Edit Profile & Delivery Details
                </h2>
                <p className="text-xs text-[#625F59] dark:text-[#A7B3AF] mt-0.5">
                  Update your contact info and default doorstep delivery address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#192D2A] dark:text-[#F8FAFC] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="border-t border-[#DDD5C8]/60 dark:border-[#223832] pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#17745A] dark:text-[#10B981] mb-3 flex items-center gap-1.5">
                  <MapPin size={14} /> Doorstep Delivery Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                      Street Address / House No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, Green Valley Apartments"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                        City / District
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rampur"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#192D2A] dark:text-[#F8FAFC] mb-1">
                        Postal PIN Code (6-digit)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 110001"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
