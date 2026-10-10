import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, ShoppingBag, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { adminAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminAPI.getMetrics(),
      adminAPI.getOrders({ status: statusFilter }),
    ])
      .then(([metricsRes, ordersRes]) => {
        setMetrics(metricsRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      })
      .catch(() => {
        showToast('Unable to load admin analytics', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleUpdateStatus = (orderId, newStatus) => {
    adminAPI.updateOrderStatus(orderId, { status: newStatus })
      .then(() => {
        showToast(`Order status updated to ${newStatus}`, 'success');
        loadData();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to update order status', 'error');
      });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <LayoutDashboard size={14} />
            Store Management Console
          </span>
          <h1 className="mt-2 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
            Live Store Operations & Analytics
          </h1>
          <p className="mt-1 text-sm font-medium text-stone-500">
            Real-time fulfillment metrics, gross revenue, inventory health, and dispatch queue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/waste-center"
            className="rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition"
          >
            Waste Reduction Center
          </Link>
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 shadow-sm hover:bg-stone-50 dark:bg-stone-900 dark:border-white/10 dark:text-white"
          >
            <RefreshCw size={16} />
            Sync
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-[2.5rem] bg-stone-200 dark:bg-stone-800" />
      ) : (
        <>
          {/* Real Metrics Grid */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <TrendingUp size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Total Gross Sales</p>
              <p className="mt-1 text-3xl font-black text-stone-900 dark:text-white">₹{metrics?.totalRevenue || 0}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">Captured Online & COD</p>
            </div>

            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <ShoppingBag size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Lifetime Orders</p>
              <p className="mt-1 text-3xl font-black text-stone-900 dark:text-white">{metrics?.totalOrders || 0}</p>
              <p className="mt-1 text-xs font-semibold text-blue-600">{metrics?.deliveredOrders || 0} Delivered</p>
            </div>

            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Clock size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Orders in Fulfillment</p>
              <p className="mt-1 text-3xl font-black text-amber-600">{metrics?.pendingOrders || 0}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">Awaiting Delivery / Packing</p>
            </div>

            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <AlertTriangle size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Low Stock Products</p>
              <p className="mt-1 text-3xl font-black text-rose-600">{metrics?.lowStockCount || 0}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">Restock needed soon</p>
            </div>
          </div>

          {/* Orders Management Queue */}
          <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white">Customer Order Fulfillment Queue</h2>
                <p className="text-xs font-medium text-stone-500">Manage order state progression from packing to doorstep delivery.</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition capitalize ${
                      statusFilter === st
                        ? 'bg-[#075F46] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="py-8 text-center text-sm font-medium text-stone-500">No orders found for this status filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs font-black uppercase tracking-wider text-stone-400 dark:border-white/10">
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Recipient & City</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Advance Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-stone-50/70 dark:hover:bg-white/5">
                        <td className="py-4">
                          <Link to={`/track/${ord.orderNumber}`} className="font-bold text-emerald-800 hover:underline dark:text-emerald-400">
                            {ord.orderNumber || 'TD-Order'}
                          </Link>
                          <p className="text-xs text-stone-400">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-semibold text-stone-800 dark:text-stone-200">{ord.deliveryAddress?.name}</p>
                          <p className="text-xs text-stone-500">{ord.deliveryAddress?.city} ({ord.deliveryAddress?.pincode})</p>
                        </td>
                        <td className="py-4 font-medium text-stone-600 dark:text-stone-300">
                          {ord.items?.length || 0} items
                        </td>
                        <td className="py-4 font-black text-emerald-800 dark:text-emerald-400">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-black capitalize ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-black capitalize text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            {ord.deliveryStatus?.replace(/_/g, ' ') || 'pending'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {ord.deliveryStatus === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(ord._id, 'packed')}
                                className="rounded-xl bg-blue-600 px-3 py-1 text-xs font-black text-white hover:bg-blue-700"
                              >
                                Mark Packed
                              </button>
                            )}
                            {ord.deliveryStatus === 'packed' && (
                              <button
                                onClick={() => handleUpdateStatus(ord._id, 'out_for_delivery')}
                                className="rounded-xl bg-amber-600 px-3 py-1 text-xs font-black text-white hover:bg-amber-700"
                              >
                                Dispatch
                              </button>
                            )}
                            {ord.deliveryStatus === 'out_for_delivery' && (
                              <button
                                onClick={() => handleUpdateStatus(ord._id, 'delivered')}
                                className="rounded-xl bg-emerald-700 px-3 py-1 text-xs font-black text-white hover:bg-emerald-800"
                              >
                                Complete Delivery
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
