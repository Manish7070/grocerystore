import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, ShoppingBag, AlertTriangle, RefreshCw, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
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
        showToast(`Order status updated to ${newStatus}`);
        loadData();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to update order status', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-apricot/30 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta uppercase tracking-wider mb-3">
              <LayoutDashboard size={13} />
              <span>Operations Management Console</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight">
              Store Analytics & Fulfillment Queue
            </h1>
            <p className="mt-1 text-sm text-warmStone leading-relaxed max-w-2xl">
              Real-time gross transaction telemetry, inventory thresholds, FEFO dispatch routing, and fulfillment status control.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/waste-radar"
              className="px-4 py-2.5 bg-aubergine text-ivory text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-aubergine/90 transition-colors shadow-sm"
            >
              Waste Radar
            </Link>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-porcelain hover:bg-sandstone/30 border border-sandstone rounded-xl text-xs font-semibold text-espresso uppercase tracking-wider transition-colors shadow-sm"
            >
              <RefreshCw size={14} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-32 bg-ivory rounded-2xl border border-sandstone animate-pulse" />
              ))}
            </div>
            <div className="h-96 bg-ivory rounded-2xl border border-sandstone animate-pulse" />
          </div>
        ) : (
          <>
            {/* Real Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <TrendingUp size={20} className="text-terracotta" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Total Gross GMV</p>
                <p className="font-serif text-3xl text-espresso font-semibold mt-1">₹{metrics?.totalRevenue || 0}</p>
                <p className="text-xs text-warmStone mt-1">Captured online & COD</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <ShoppingBag size={20} className="text-antiqueBrass" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Lifetime Orders</p>
                <p className="font-serif text-3xl text-espresso font-semibold mt-1">{metrics?.totalOrders || 0}</p>
                <p className="text-xs text-warmStone mt-1">{metrics?.deliveredOrders || 0} successfully delivered</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-apricot/30 border border-terracotta/20 flex items-center justify-center text-terracotta mb-4">
                  <Clock size={20} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Fulfillment Pipeline</p>
                <p className="font-serif text-3xl text-terracotta font-semibold mt-1">{metrics?.pendingOrders || 0}</p>
                <p className="text-xs text-warmStone mt-1">Awaiting packing or delivery</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <AlertTriangle size={20} className="text-aubergine" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Low Stock SKUs</p>
                <p className="font-serif text-3xl text-aubergine font-semibold mt-1">{metrics?.lowStockCount || 0}</p>
                <p className="text-xs text-warmStone mt-1">Procurement reorder required</p>
              </div>
            </div>

            {/* Orders Management Queue */}
            <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sandstone pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-espresso font-semibold">Customer Fulfillment Queue</h2>
                  <p className="text-xs text-warmStone mt-0.5">Control order status lifecycle through cold chain to doorstep handover</p>
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['All', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        statusFilter === st
                          ? 'bg-terracotta text-ivory'
                          : 'bg-porcelain text-warmStone hover:text-espresso border border-sandstone'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-warmStone font-medium">
                  No orders found matching the filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-sandstone text-[11px] font-semibold uppercase tracking-wider text-warmStone">
                        <th className="pb-3">Order Identifier</th>
                        <th className="pb-3">Recipient & Destination</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Fulfillment Status</th>
                        <th className="pb-3 text-right">Workflow Transition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone/60">
                      {orders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-porcelain/60 transition-colors">
                          <td className="py-4">
                            <Link
                              to={`/track/${ord.orderNumber}`}
                              className="font-medium text-xs text-espresso hover:text-terracotta underline decoration-sandstone underline-offset-4"
                            >
                              {ord.orderNumber || 'GS-Order'}
                            </Link>
                            <p className="text-[11px] text-warmStone mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4">
                            <p className="text-xs font-medium text-espresso">{ord.deliveryAddress?.name}</p>
                            <p className="text-[11px] text-warmStone">{ord.deliveryAddress?.city} ({ord.deliveryAddress?.pincode})</p>
                          </td>
                          <td className="py-4 text-xs text-warmStone">
                            {ord.items?.length || 0} items
                          </td>
                          <td className="py-4 font-semibold text-xs text-espresso">
                            ₹{ord.totalAmount}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-porcelain border border-sandstone text-espresso'
                                : 'bg-apricot/30 text-terracotta'
                            }`}>
                              {ord.paymentStatus} ({ord.paymentMethod})
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="inline-flex rounded-full bg-porcelain border border-sandstone px-2.5 py-0.5 text-[11px] font-medium text-espresso uppercase tracking-wider">
                              {ord.deliveryStatus?.replace(/_/g, ' ') || 'pending'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {ord.deliveryStatus === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateStatus(ord._id, 'packed')}
                                  className="rounded-lg bg-aubergine text-ivory px-3 py-1.5 text-xs font-medium hover:bg-aubergine/90 transition-colors"
                                >
                                  Mark Packed
                                </button>
                              )}
                              {ord.deliveryStatus === 'packed' && (
                                <button
                                  onClick={() => handleUpdateStatus(ord._id, 'out_for_delivery')}
                                  className="rounded-lg bg-terracotta text-ivory px-3 py-1.5 text-xs font-medium hover:bg-terracotta/90 transition-colors"
                                >
                                  Dispatch Fleet
                                </button>
                              )}
                              {ord.deliveryStatus === 'out_for_delivery' && (
                                <button
                                  onClick={() => handleUpdateStatus(ord._id, 'delivered')}
                                  className="rounded-lg bg-espresso text-ivory px-3 py-1.5 text-xs font-medium hover:bg-espresso/90 transition-colors"
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
    </div>
  );
};

export default AdminDashboard;
