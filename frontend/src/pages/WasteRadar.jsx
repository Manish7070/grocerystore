import { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, TrendingDown, Clock, CheckCircle2, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { inventoryAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const WasteRadar = () => {
  const [radar, setRadar] = useState(null);
  const [wasteLogs, setWasteLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      inventoryAPI.getRadar(),
      inventoryAPI.getWasteLogs(),
    ])
      .then(([radarRes, logsRes]) => {
        setRadar(radarRes.data);
        setWasteLogs(logsRes.data);
        setLoading(false);
      })
      .catch(() => {
        showToast('Unable to load Freshness Radar data', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyMarkdown = (batchId, discountPercent) => {
    inventoryAPI.applyMarkdown(batchId, discountPercent)
      .then((res) => {
        showToast(res.data.message, 'success');
        loadData();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to apply markdown', 'error');
      });
  };

  const handleWriteOff = (batchId, quantity) => {
    const reason = window.prompt('Enter reason for write-off (e.g. expired, damaged):', 'expired');
    if (!reason) return;

    inventoryAPI.writeOff(batchId, quantity, reason, 'Logged via Freshness Audit Center')
      .then((res) => {
        showToast(res.data.message, 'success');
        loadData();
      })
      .catch((err) => {
        showToast(err.response?.data?.message || 'Failed to log write-off', 'error');
      });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles size={14} />
            Smart Grocery Differentiator
          </span>
          <h1 className="mt-2 text-3xl font-black text-stone-900 tracking-tight dark:text-white sm:text-4xl">
            Freshness & Waste Reduction Center
          </h1>
          <p className="mt-1 text-sm font-medium text-stone-500">
            Enforcing strict FEFO (First-Expiring-First-Out) harvest batch tracking and smart markdowns to achieve zero food waste.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 shadow-sm hover:bg-stone-50 dark:bg-stone-900 dark:border-white/10 dark:text-white"
        >
          <RefreshCw size={16} />
          Sync Batches
        </button>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-[2.5rem] bg-stone-200 dark:bg-stone-800" />
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Total Active Batches</p>
              <p className="mt-1 text-3xl font-black text-stone-900 dark:text-white">{radar?.totalBatches || 0}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">100% FEFO Compliance</p>
            </div>

            <div className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Clock size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Near-Expiry Radar (Next 7 Days)</p>
              <p className="mt-1 text-3xl font-black text-amber-600">{radar?.nearExpiryCount || 0}</p>
              <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">Eligible for Markdown Deals</p>
            </div>

            <div className="rounded-[2rem] border border-orange-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                <TrendingDown size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Rescued Inventory Value</p>
              <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{radar?.rescuedValueEstimate || 0}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">Saved through dynamic pricing</p>
            </div>

            <div className="rounded-[2rem] border border-red-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <ShieldAlert size={22} />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-stone-400">Write-Offs / Loss Recorded</p>
              <p className="mt-1 text-3xl font-black text-red-600">₹{radar?.totalLossRecorded || 0}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">Direct farm damage & spillage</p>
            </div>
          </div>

          {/* Near-Expiry Action Radar Table */}
          <div className="mb-8 rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" size={20} />
                  Near-Expiry Stock Action Radar
                </h2>
                <p className="text-xs font-medium text-stone-500">
                  Batches expiring soon. Apply smart markdowns to trigger customer savings before expiration.
                </p>
              </div>
            </div>

            {radar?.nearExpiryBatches?.length === 0 ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center text-sm font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                All perishable stock is currently well within safe freshness windows!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs font-black uppercase tracking-wider text-stone-400 dark:border-white/10">
                      <th className="pb-3">Batch & Product</th>
                      <th className="pb-3">Farm Origin</th>
                      <th className="pb-3">Days Left</th>
                      <th className="pb-3">Units Left</th>
                      <th className="pb-3">Selling Price</th>
                      <th className="pb-3">Smart Markdown</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                    {radar?.nearExpiryBatches?.map((batch) => {
                      const daysLeft = Math.ceil((new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

                      return (
                        <tr key={batch._id} className="hover:bg-stone-50/70 dark:hover:bg-white/5">
                          <td className="py-4">
                            <p className="font-bold text-stone-900 dark:text-white">{batch.productName}</p>
                            <p className="text-xs font-mono text-stone-500">{batch.batchNumber}</p>
                          </td>
                          <td className="py-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
                            {batch.farmOrigin}
                          </td>
                          <td className="py-4">
                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {daysLeft} days
                            </span>
                          </td>
                          <td className="py-4 font-bold text-stone-800 dark:text-stone-200">
                            {batch.quantityRemaining} units
                          </td>
                          <td className="py-4 font-black text-emerald-800 dark:text-emerald-400">
                            ₹{batch.sellingPrice}
                          </td>
                          <td className="py-4">
                            {batch.markdownApplied ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
                                {batch.markdownDiscount}% Markdown Active
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-stone-500">
                                Suggested: {batch.markdownDiscount || 20}% OFF
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!batch.markdownApplied && (
                                <button
                                  onClick={() => handleApplyMarkdown(batch._id, batch.markdownDiscount || 20)}
                                  className="rounded-xl bg-[#075F46] px-3 py-1.5 text-xs font-black text-white hover:bg-[#064D3A]"
                                >
                                  Apply {batch.markdownDiscount || 20}% Markdown
                                </button>
                              )}
                              <button
                                onClick={() => handleWriteOff(batch._id, batch.quantityRemaining, batch.costPrice)}
                                className="rounded-xl border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                                title="Write-off damaged / spoiled units"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Audit Log / Write-Off Ledger */}
          <div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 shadow-sm dark:bg-[#14231a] dark:border-white/10 sm:p-8">
            <h2 className="mb-4 text-xl font-black text-stone-900 dark:text-white">Write-Off & Audit History</h2>
            {wasteLogs.length === 0 ? (
              <p className="text-sm font-medium text-stone-500">No write-offs logged yet. Inventory health is optimal.</p>
            ) : (
              <div className="space-y-3">
                {wasteLogs.map((log) => (
                  <div key={log._id} className="flex items-center justify-between rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-white">{log.productName} ({log.quantity} units)</p>
                      <p className="text-xs text-stone-500">Reason: {log.reason} · {new Date(log.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-black text-red-600">Loss: ₹{log.financialLoss}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WasteRadar;
