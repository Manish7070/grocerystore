import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Trash2,
  UserCheck,
  UserPlus,
  PackagePlus,
  Filter,
  Search,
  Check,
  X,
  AlertCircle,
  Eye,
  Store,
  Wheat,
  Truck,
} from 'lucide-react';
import { adminAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active Tab: 'orders' | 'users' | 'approvals' | 'catalog'
  const [activeTab, setActiveTab] = useState('orders');

  // Loading & metrics
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');

  // Users Tab State
  const [usersList, setUsersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    businessName: '',
    villageOrArea: '',
  });

  // Approvals Tab State
  const [approvalsList, setApprovalsList] = useState([]);
  const [approvalPrices, setApprovalPrices] = useState({});

  // Direct Product Creation State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    mrp: '',
    stock: 100,
    unit: '1 kg',
    image: '',
    description: '',
  });

  // Admin login fallback state if not authenticated as admin
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Load telemetry metrics
  const loadMetrics = async () => {
    try {
      const { data } = await adminAPI.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    try {
      const { data } = await adminAPI.getOrders({ status: orderFilter });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  // Load Users
  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers({
        role: userRoleFilter,
        status: userStatusFilter,
        search: userSearch,
      });
      setUsersList(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  // Load Pending Approvals
  const loadApprovals = async () => {
    try {
      const { data } = await adminAPI.getApprovals();
      setApprovalsList(data);
      // Prepopulate prices for ease of admin approval
      const initialPrices = {};
      data.forEach((prod) => {
        initialPrices[prod._id] = {
          customerPrice: prod.price || prod.kisanBasePrice || 0,
          mrp: prod.mrp || Math.round((prod.price || prod.kisanBasePrice || 0) * 1.2),
        };
      });
      setApprovalPrices(initialPrices);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    }
  };

  // Main data loader
  const refreshAllData = async () => {
    setLoading(true);
    await Promise.all([loadMetrics(), loadOrders(), loadUsers(), loadApprovals()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user && (user.isAdmin || user.role === 'admin')) {
      refreshAllData();
    }
  }, [user]);

  useEffect(() => {
    if (user && (user.isAdmin || user.role === 'admin')) {
      loadOrders();
    }
  }, [orderFilter]);

  useEffect(() => {
    if (user && (user.isAdmin || user.role === 'admin')) {
      loadUsers();
    }
  }, [userRoleFilter, userStatusFilter]);

  // Handle Admin Direct Signin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    try {
      const { data } = await authAPI.signin(adminLoginForm);
      if (data.role !== 'admin' && !data.isAdmin) {
        showToast('Access denied: Account does not have administrator privileges', 'error');
        setAdminLoginLoading(false);
        return;
      }
      login(data);
      showToast('Welcome, Super Administrator!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid administrator credentials', 'error');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // User Actions: Block / Unblock
  const handleToggleBlock = async (targetUser) => {
    const isBlocking = !targetUser.isBlocked;
    let reason = '';
    if (isBlocking) {
      reason = window.prompt(`Enter suspension reason for ${targetUser.name}:`, 'Violation of store terms & quality policies');
      if (reason === null) return;
    }

    try {
      await adminAPI.blockUser(targetUser._id, { isBlocked: isBlocking, reason });
      showToast(isBlocking ? `${targetUser.name} has been suspended` : `${targetUser.name} has been unblocked`);
      loadUsers();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user block status', 'error');
    }
  };

  // User Actions: Update Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}`);
      loadUsers();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  // User Actions: Delete User
  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${targetUser.name} (${targetUser.email})? This cannot be undone.`)) {
      return;
    }
    try {
      await adminAPI.deleteUser(targetUser._id);
      showToast('User deleted permanently');
      loadUsers();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // User Actions: Verify Partner
  const handleVerifyPartner = async (targetUser) => {
    const newStatus = !targetUser.partnerProfile?.isVerified;
    try {
      await adminAPI.verifyPartner(targetUser._id, newStatus);
      showToast(newStatus ? 'Partner successfully verified & approved' : 'Partner marked unverified');
      loadUsers();
    } catch (err) {
      showToast('Failed to update partner verification status', 'error');
    }
  };

  // Create New User/Staff
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser({
        name: newUserForm.name,
        email: newUserForm.email,
        password: newUserForm.password,
        role: newUserForm.role,
        partnerProfile: {
          businessName: newUserForm.businessName,
          villageOrArea: newUserForm.villageOrArea,
          isVerified: true,
        },
      });
      showToast(`Created new ${newUserForm.role} account successfully!`);
      setShowAddUserModal(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'customer', businessName: '', villageOrArea: '' });
      loadUsers();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  // Product Approvals Action (Dual Pricing & Admin Markup)
  const handleProcessApproval = async (productId, action) => {
    try {
      const priceConfig = approvalPrices[productId] || {};
      let rejectionReason = '';
      if (action === 'reject') {
        rejectionReason = window.prompt('Enter reason for rejecting this product:', 'Quality standard not met or incomplete image');
        if (!rejectionReason) return;
      }

      await adminAPI.processApproval(productId, {
        action,
        customerPrice: priceConfig.customerPrice,
        mrp: priceConfig.mrp,
        rejectionReason,
      });

      showToast(action === 'approve' ? 'Product approved and published to customer storefront!' : 'Product rejected');
      loadApprovals();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to process approval', 'error');
    }
  };

  // Create Product Directly
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addProduct(newProductForm);
      showToast('Product added directly to catalog!');
      setShowAddProductModal(false);
      setNewProductForm({ name: '', category: 'Vegetables', price: '', mrp: '', stock: 100, unit: '1 kg', image: '', description: '' });
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      showToast(`Order marked as ${newStatus}`);
      loadOrders();
      loadMetrics();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  // ==========================================
  // SECURITY SHIELD: IF NOT LOGGED IN AS ADMIN
  // ==========================================
  if (!user || (!user.isAdmin && user.role !== 'admin')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0E1A18] px-4 py-16">
        <div className="w-full max-w-md bg-white dark:bg-[#162421] p-8 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#192D2A] text-[#D9A441] mx-auto mb-6">
            <Lock size={26} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-center text-[#192D2A] dark:text-[#F8F3EA]">
            Super Admin Control
          </h2>
          <p className="text-xs text-center text-[#625F59] dark:text-[#E7E2D9]/70 mt-1 mb-6">
            This administration gateway is strictly restricted. Please authenticate with administrator credentials.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#192D2A] dark:text-[#F8F3EA] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminLoginForm.email}
                onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                placeholder="admin@grocerystore.in"
                className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-transparent px-3.5 py-2.5 text-xs text-[#192D2A] dark:text-[#F8F3EA] outline-none focus:border-[#C66B42]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#192D2A] dark:text-[#F8F3EA] mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={adminLoginForm.password}
                onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-transparent px-3.5 py-2.5 text-xs text-[#192D2A] dark:text-[#F8F3EA] outline-none focus:border-[#C66B42]"
              />
            </div>
            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 bg-[#192D2A] hover:bg-[#253D39] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>{adminLoginLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#DDD5C8]/60 dark:border-white/10 text-center">
            <Link to="/" className="text-xs font-semibold text-[#C66B42] hover:underline">
              &larr; Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL SUPER ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E1A18] text-[#192D2A] dark:text-[#F8F3EA] pb-24">
      {/* Top Banner & Control Bar */}
      <section className="border-b border-[#DDD5C8] dark:border-white/10 bg-white/70 dark:bg-[#121E1C]/90 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1E8D8] dark:bg-white/10 border border-[#DDD5C8] dark:border-white/10 rounded-full text-xs font-bold text-[#C66B42] dark:text-[#D9A441] uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              <span>Super Administrator Command Hub</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              GroceryStore Operations & Governance
            </h1>
            <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1">
              Full control over user accounts, farmer direct pricing, branch distributors, order fulfillment & approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#17745A] hover:bg-[#125c47] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
            >
              <PackagePlus size={15} />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C66B42] hover:bg-[#b05932] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
            <button
              onClick={refreshAllData}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 text-xs font-bold rounded-xl hover:bg-[#F1E8D8] transition shadow-sm"
              title="Refresh Live Data"
            >
              <RefreshCw size={15} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Metric Cards Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Total Revenue</p>
            <p className="font-serif text-2xl font-bold text-[#192D2A] dark:text-[#F8F3EA] mt-1">₹{metrics?.totalRevenue || 0}</p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">Online & Cash</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Orders In Pipeline</p>
            <p className="font-serif text-2xl font-bold text-[#C66B42] mt-1">{metrics?.pendingOrders || 0}</p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">{metrics?.totalOrders || 0} lifetime</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Pending Approvals</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${metrics?.pendingApprovals > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {metrics?.pendingApprovals || 0}
            </p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">Farmer & Branch</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Kisan Partners</p>
            <p className="font-serif text-2xl font-bold text-[#17745A] mt-1">{metrics?.totalKisans || 0}</p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">Direct Producers</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Dukan / Kirana</p>
            <p className="font-serif text-2xl font-bold text-blue-600 mt-1">{metrics?.totalShopkeepers || 0}</p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">Local 500m Hubs</p>
          </div>

          <div className="bg-white dark:bg-[#162421] p-4 rounded-2xl border border-[#DDD5C8] dark:border-white/10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">Suspended Users</p>
            <p className="font-serif text-2xl font-bold text-red-600 mt-1">{metrics?.totalBlockedUsers || 0}</p>
            <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/50 mt-0.5">Restricted</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DDD5C8] dark:border-white/10 mb-6 gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#C66B42] text-[#C66B42] dark:border-[#D9A441] dark:text-[#D9A441]'
                : 'border-transparent text-[#625F59] dark:text-[#E7E2D9]/70 hover:text-[#192D2A]'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Fulfillment Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#C66B42] text-[#C66B42] dark:border-[#D9A441] dark:text-[#D9A441]'
                : 'border-transparent text-[#625F59] dark:text-[#E7E2D9]/70 hover:text-[#192D2A]'
            }`}
          >
            <Users size={15} />
            <span>User & Partner Management ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap relative ${
              activeTab === 'approvals'
                ? 'border-[#C66B42] text-[#C66B42] dark:border-[#D9A441] dark:text-[#D9A441]'
                : 'border-transparent text-[#625F59] dark:text-[#E7E2D9]/70 hover:text-[#192D2A]'
            }`}
          >
            <Wheat size={15} />
            <span>Pending Approvals & Pricing</span>
            {approvalsList.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1">
                {approvalsList.length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS FULFILLMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
              <div>
                <h2 className="font-serif text-lg font-bold">Orders Dispatch & Handover Queue</h2>
                <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                  Track and transit statuses for home delivery and local helper pickups.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      orderFilter === st
                        ? 'bg-[#C66B42] text-white shadow-sm'
                        : 'bg-[#F1E8D8]/50 dark:bg-white/5 border border-[#DDD5C8] dark:border-white/10 text-[#625F59] dark:text-[#E7E2D9]/70 hover:text-[#192D2A]'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                No orders matching the selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DDD5C8] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Customer & Location</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Update Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD5C8]/50 dark:divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#F1E8D8]/30 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 font-bold">
                          <Link to={`/track/${ord.orderNumber}`} className="text-[#C66B42] hover:underline">
                            {ord.orderNumber}
                          </Link>
                          <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/60 font-normal">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="py-3.5">
                          <p className="font-bold">{ord.deliveryAddress?.name}</p>
                          <p className="text-[11px] text-[#625F59] dark:text-[#E7E2D9]/70">
                            {ord.deliveryAddress?.phone || 'No phone'} &bull; {ord.deliveryAddress?.city} ({ord.deliveryAddress?.pincode})
                          </p>
                        </td>
                        <td className="py-3.5 text-[#625F59] dark:text-[#E7E2D9]/80">
                          {ord.items?.length} items
                        </td>
                        <td className="py-3.5 font-bold text-sm">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex rounded-md bg-[#F1E8D8] dark:bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                            {ord.deliveryStatus?.replace(/_/g, ' ')}
                          </span>
                          {ord.qualityAlert?.isTriggered && (
                            <span className="block mt-1 text-[10px] text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-200" title={ord.qualityAlert.reason}>
                              ⚠️ Quality Alert
                            </span>
                          )}
                          {ord.feedback?.submittedAt && !ord.qualityAlert?.isTriggered && (
                            <span className="block mt-1 text-[10px] text-emerald-800 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                              ★ {ord.feedback.freshnessRating} Fresh
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <select
                            value={ord.deliveryStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="rounded-lg border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-2 py-1 text-xs font-semibold text-[#192D2A] dark:text-[#F8F3EA] outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="packed">Packed</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USER & PARTNER MANAGEMENT (RBAC, BLOCK, REMOVE) */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
              <div>
                <h2 className="font-serif text-lg font-bold">User Directory & Role Access Control (RBAC)</h2>
                <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                  Manage permissions, assign partner status, suspend abusive accounts, and delete records.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-[#625F59]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                    placeholder="Search name, email, village..."
                    className="rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-transparent pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#C66B42]"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-3 py-1.5 text-xs font-semibold outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="kisan">Kisans (Farmers)</option>
                  <option value="shopkeeper">Shopkeepers (Dukandar)</option>
                  <option value="distributor">Distributors / Branch</option>
                  <option value="helper">Delivery Helpers</option>
                  <option value="admin">Administrators</option>
                </select>

                {/* Status Filter */}
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-3 py-1.5 text-xs font-semibold outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="blocked">Suspended Only</option>
                </select>
              </div>
            </div>

            {usersList.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                No users found matching query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DDD5C8] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#625F59] dark:text-[#E7E2D9]/60">
                      <th className="pb-3">User & Profile</th>
                      <th className="pb-3">Current Role</th>
                      <th className="pb-3">Partner Info</th>
                      <th className="pb-3">Account Status</th>
                      <th className="pb-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD5C8]/50 dark:divide-white/5">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-[#F1E8D8]/30 dark:hover:bg-white/5 transition">
                        <td className="py-3.5">
                          <p className="font-bold text-[#192D2A] dark:text-[#F8F3EA]">{u.name}</p>
                          <p className="text-[11px] text-[#625F59] dark:text-[#E7E2D9]/70">{u.email}</p>
                          <p className="text-[10px] text-[#625F59]/70 font-mono">ID: {u._id.slice(-6)}</p>
                        </td>
                        <td className="py-3.5">
                          <select
                            value={u.role || 'customer'}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={u._id === user._id}
                            className="rounded-lg border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#1A2624] px-2 py-1 text-xs font-bold outline-none uppercase tracking-wider"
                          >
                            <option value="customer">Customer</option>
                            <option value="kisan">🌾 Kisan (Farmer)</option>
                            <option value="shopkeeper">🏪 Shopkeeper (Dukan)</option>
                            <option value="distributor">🚚 Distributor / Hub</option>
                            <option value="helper">🛵 Delivery Helper</option>
                            <option value="admin">🛡️ Admin</option>
                          </select>
                        </td>
                        <td className="py-3.5">
                          {u.partnerProfile?.businessName ? (
                            <div>
                              <p className="font-semibold text-xs text-[#17745A]">{u.partnerProfile.businessName}</p>
                              <p className="text-[10px] text-[#625F59] dark:text-[#E7E2D9]/60">
                                Area: {u.partnerProfile.villageOrArea || 'Village Area'}
                              </p>
                              <button
                                onClick={() => handleVerifyPartner(u)}
                                className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  u.partnerProfile?.isVerified
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                {u.partnerProfile?.isVerified ? '✓ Verified Partner' : '! Unverified'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#625F59]/60 italic">Standard Consumer</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          {u.isBlocked ? (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                <Lock size={11} />
                                <span>Suspended</span>
                              </span>
                              {u.blockedReason && (
                                <p className="text-[10px] text-red-600 mt-1 max-w-[180px] truncate" title={u.blockedReason}>
                                  Reason: {u.blockedReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle2 size={11} />
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Block / Unblock Toggle */}
                            <button
                              onClick={() => handleToggleBlock(u)}
                              disabled={u._id === user._id}
                              className={`p-1.5 rounded-lg border transition ${
                                u.isBlocked
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                              } disabled:opacity-40`}
                              title={u.isBlocked ? 'Unblock user' : 'Suspend / Block user'}
                            >
                              {u.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                            </button>

                            {/* Permanently Delete */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={u._id === user._id}
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition disabled:opacity-40"
                              title="Delete user permanently"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRODUCT APPROVALS & DUAL PRICING */}
        {/* ========================================================= */}
        {activeTab === 'approvals' && (
          <div className="bg-white dark:bg-[#162421] rounded-2xl border border-[#DDD5C8] dark:border-white/10 p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
              <h2 className="font-serif text-lg font-bold">Producer & Branch Approval Gate</h2>
              <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/60">
                Approve fresh harvests from Kisans and inventory from branch partners. Set the consumer selling price with complete privacy — producers will never see retail pricing margins.
              </p>
            </div>

            {approvalsList.length === 0 ? (
              <div className="py-16 text-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex flex-col items-center justify-center">
                <CheckCircle2 size={36} className="mb-2 text-emerald-600" />
                <span>Zero pending approvals in queue! All partner produce is verified.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {approvalsList.map((prod) => {
                  const prices = approvalPrices[prod._id] || { customerPrice: prod.price || 0, mrp: prod.mrp || 0 };
                  const isKisan = prod.addedBy?.role === 'kisan';

                  return (
                    <div
                      key={prod._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#DDD5C8] dark:border-white/10 bg-[#F1E8D8]/20 dark:bg-white/5"
                    >
                      <div className="flex items-start gap-3">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover border" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-[#F1E8D8] dark:bg-white/10 flex items-center justify-center text-lg">
                            🥕
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#192D2A] dark:text-[#F8F3EA]">{prod.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isKisan ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isKisan ? '🌾 Direct Kisan Harvest' : '🏪 Branch Inventory'}
                            </span>
                          </div>
                          <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-0.5">
                            Category: {prod.category} &bull; Unit: {prod.unit || '1 kg'} &bull; Quantity: {prod.stock || 100} in stock
                          </p>
                          <p className="text-xs font-semibold text-[#17745A] mt-1">
                            {isKisan ? 'Kisan Asking Price (Kharid Mulya):' : 'Partner Base Cost:'}{' '}
                            <span className="font-bold text-sm">₹{prod.kisanBasePrice || prod.price}</span>
                            <span className="text-[10px] text-[#625F59] font-normal"> (This remains strictly private to producer)</span>
                          </p>
                          <p className="text-[11px] text-[#625F59] mt-0.5">
                            Submitted by: {prod.addedBy?.name || 'Partner'} ({prod.addedBy?.userId?.email || 'N/A'})
                          </p>
                        </div>
                      </div>

                      {/* Pricing Config & Actions */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#DDD5C8]/60">
                        <div className="flex items-center gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#625F59] mb-0.5">
                              Store Retail Price (₹)
                            </label>
                            <input
                              type="number"
                              value={prices.customerPrice}
                              onChange={(e) =>
                                setApprovalPrices({
                                  ...approvalPrices,
                                  [prod._id]: { ...prices, customerPrice: Number(e.target.value) },
                                })
                              }
                              className="w-24 rounded-lg border border-[#DDD5C8] dark:border-white/10 px-2 py-1 text-xs font-bold outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#625F59] mb-0.5">
                              MRP (₹)
                            </label>
                            <input
                              type="number"
                              value={prices.mrp}
                              onChange={(e) =>
                                setApprovalPrices({
                                  ...approvalPrices,
                                  [prod._id]: { ...prices, mrp: Number(e.target.value) },
                                })
                              }
                              className="w-20 rounded-lg border border-[#DDD5C8] dark:border-white/10 px-2 py-1 text-xs font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleProcessApproval(prod._id, 'approve')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17745A] hover:bg-[#125c47] text-white text-xs font-bold uppercase rounded-lg transition shadow-sm"
                          >
                            <Check size={14} />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => handleProcessApproval(prod._id, 'reject')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold uppercase rounded-lg transition"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: CREATE USER / STAFF / PARTNER DIRECTLY */}
      {/* ========================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#162421] p-6 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8] dark:border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold">Create New User or Partner Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 rounded-full hover:bg-black/5">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Account Password</label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assign User Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 font-bold outline-none uppercase"
                >
                  <option value="customer">Customer</option>
                  <option value="kisan">🌾 Kisan (Farmer)</option>
                  <option value="shopkeeper">🏪 Shopkeeper (Dukan Partner)</option>
                  <option value="distributor">🚚 Distributor / Hub Branch</option>
                  <option value="helper">🛵 Delivery Helper (300-500m)</option>
                  <option value="admin">🛡️ Administrator</option>
                </select>
              </div>

              {['kisan', 'shopkeeper', 'distributor'].includes(newUserForm.role) && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Farm / Business Name</label>
                    <input
                      type="text"
                      value={newUserForm.businessName}
                      onChange={(e) => setNewUserForm({ ...newUserForm, businessName: e.target.value })}
                      placeholder="e.g. Kisan Organic Fields / Gupta Kirana Store"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Village / Locality</label>
                    <input
                      type="text"
                      value={newUserForm.villageOrArea}
                      onChange={(e) => setNewUserForm({ ...newUserForm, villageOrArea: e.target.value })}
                      placeholder="e.g. Rampur Village / Ward 4"
                      className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#192D2A] text-white font-bold uppercase rounded-xl hover:bg-[#253D39] transition"
                >
                  Confirm & Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DIRECT ADD PRODUCT */}
      {/* ========================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#162421] p-6 rounded-3xl border border-[#DDD5C8] dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C8] dark:border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold">Add Direct Store Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="p-1 rounded-full hover:bg-black/5">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Farm Fresh Shimla Apples"
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Rice">Rice & Grains</option>
                    <option value="Pulses">Pulses & Dals</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Spices">Spices</option>
                    <option value="Oils">Oils & Ghee</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Weight</label>
                  <input
                    type="text"
                    value={newProductForm.unit}
                    onChange={(e) => setNewProductForm({ ...newProductForm, unit: e.target.value })}
                    placeholder="e.g. 1 kg / 500g"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    placeholder="40"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.mrp}
                    onChange={(e) => setNewProductForm({ ...newProductForm, mrp: e.target.value })}
                    placeholder="50"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    placeholder="100"
                    className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#DDD5C8] dark:border-white/10 px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#17745A] text-white font-bold uppercase rounded-xl hover:bg-[#125c47] transition"
                >
                  Publish Directly to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
