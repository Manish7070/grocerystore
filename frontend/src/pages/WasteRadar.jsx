import { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, TrendingDown, Clock, CheckCircle2, AlertTriangle, RefreshCw, Trash2, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Editorial Header */}
      <section className="border-b border-sandstone bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-apricot/30 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>FEFO Cold-Chain Governance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-semibold tracking-tight">
              Freshness & Waste Radar
            </h1>
            <p className="mt-2 text-sm text-warmStone max-w-2xl leading-relaxed">
              Real-time harvest batch monitoring. First-Expiring-First-Out (FEFO) routing dynamically discounts near-peak produce to ensure zero food waste while guaranteeing maximum freshness for customers.
            </p>
          </div>
          <button
            onClick={loadData}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-porcelain hover:bg-sandstone/30 border border-sandstone rounded-xl text-xs font-semibold text-espresso uppercase tracking-wider transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Sync Batches</span>
          </button>
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
            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <CheckCircle2 size={20} className="text-terracotta" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Active Batches</p>
                <p className="font-serif text-3xl text-espresso font-semibold mt-1">{radar?.totalBatches || 0}</p>
                <p className="text-xs text-warmStone mt-1">100% FEFO Compliance</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-apricot/30 border border-terracotta/20 flex items-center justify-center text-terracotta mb-4">
                  <Clock size={20} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Near-Expiry (7 Days)</p>
                <p className="font-serif text-3xl text-terracotta font-semibold mt-1">{radar?.nearExpiryCount || 0}</p>
                <p className="text-xs text-warmStone mt-1">Eligible for flash markdown</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <TrendingDown size={20} className="text-antiqueBrass" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Rescued Inventory Value</p>
                <p className="font-serif text-3xl text-espresso font-semibold mt-1">₹{radar?.rescuedValueEstimate || 0}</p>
                <p className="text-xs text-warmStone mt-1">Saved via dynamic pricing</p>
              </div>

              <div className="bg-ivory p-6 rounded-2xl border border-sandstone shadow-[0_2px_8px_rgba(39,34,31,0.04)]">
                <div className="w-10 h-10 rounded-xl bg-porcelain border border-sandstone flex items-center justify-center text-espresso mb-4">
                  <ShieldAlert size={20} className="text-aubergine" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warmStone">Loss Recorded</p>
                <p className="font-serif text-3xl text-aubergine font-semibold mt-1">₹{radar?.totalLossRecorded || 0}</p>
                <p className="text-xs text-warmStone mt-1">Direct farm damage & spillage</p>
              </div>
            </div>

            {/* Near-Expiry Action Radar Table */}
            <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8 mb-10">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl text-espresso font-semibold flex items-center gap-2">
                    <AlertTriangle className="text-terracotta" size={22} />
                    <span>Near-Expiry Freshness Radar</span>
                  </h2>
                  <p className="text-xs text-warmStone mt-1">
                    Batches approaching peak maturity. Apply targeted customer savings before expiration.
                  </p>
                </div>
              </div>

              {radar?.nearExpiryBatches?.length === 0 ? (
                <div className="rounded-xl bg-porcelain border border-sandstone p-8 text-center text-sm font-medium text-warmStone">
                  All perishable produce is currently well within safe freshness thresholds.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-sandstone text-[11px] font-semibold uppercase tracking-wider text-warmStone">
                        <th className="pb-3">Batch & Product</th>
                        <th className="pb-3">Farm Origin</th>
                        <th className="pb-3">Days Remaining</th>
                        <th className="pb-3">Remaining Stock</th>
                        <th className="pb-3">Market Price</th>
                        <th className="pb-3">Markdown Status</th>
                        <th className="pb-3 text-right">Intervention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone/60">
                      {radar?.nearExpiryBatches?.map((batch) => {
                        const daysLeft = Math.ceil((new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                          <tr key={batch._id} className="hover:bg-porcelain/60 transition-colors">
                            <td className="py-4">
                              <p className="font-medium text-espresso">{batch.productName}</p>
                              <p className="text-[11px] font-mono text-warmStone">{batch.batchNumber}</p>
                            </td>
                            <td className="py-4 text-xs text-warmStone">
                              {batch.farmOrigin}
                            </td>
                            <td className="py-4">
                              <span className="inline-flex rounded-full bg-apricot/30 border border-terracotta/20 px-2.5 py-0.5 text-xs font-semibold text-terracotta">
                                {daysLeft} days
                              </span>
                            </td>
                            <td className="py-4 text-xs font-medium text-espresso">
                              {batch.quantityRemaining} units
                            </td>
                            <td className="py-4 font-semibold text-espresso">
                              ₹{batch.sellingPrice}
                            </td>
                            <td className="py-4">
                              {batch.markdownApplied ? (
                                <span className="inline-flex rounded-full bg-porcelain border border-sandstone px-2.5 py-0.5 text-xs font-semibold text-terracotta">
                                  {batch.markdownDiscount}% Markdown Active
                                </span>
                              ) : (
                                <span className="text-xs text-warmStone">
                                  Suggested: {batch.markdownDiscount || 20}% OFF
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!batch.markdownApplied && (
                                  <button
                                    onClick={() => handleApplyMarkdown(batch._id, batch.markdownDiscount || 20)}
                                    className="rounded-lg bg-terracotta text-ivory px-3 py-1.5 text-xs font-medium hover:bg-terracotta/90 transition-colors"
                                  >
                                    Apply {batch.markdownDiscount || 20}% OFF
                                  </button>
                                )}
                                <button
                                  onClick={() => handleWriteOff(batch._id, batch.quantityRemaining, batch.costPrice)}
                                  className="rounded-lg border border-sandstone bg-porcelain p-1.5 text-warmStone hover:text-aubergine hover:border-aubergine/40 transition-colors"
                                  title="Write-off damaged / spoiled units"
                                >
                                  <Trash2 size={15} />
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
            <div className="bg-ivory rounded-2xl border border-sandstone shadow-[0_2px_12px_rgba(39,34,31,0.04)] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-espresso font-semibold mb-2">Write-Off & Audit History</h2>
              <p className="text-xs text-warmStone mb-6">Traceable ledger of spoiled or damaged produce removed from circulation.</p>
              {wasteLogs.length === 0 ? (
                <p className="text-xs text-warmStone italic">No write-offs logged yet. Inventory health is optimal.</p>
              ) : (
                <div className="space-y-2.5">
                  {wasteLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-3.5 rounded-xl bg-porcelain border border-sandstone/60">
                      <div>
                        <p className="text-xs font-semibold text-espresso">{log.productName} ({log.quantity} units)</p>
                        <p className="text-[11px] text-warmStone">Reason: {log.reason} &bull; {new Date(log.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs font-semibold text-terracotta">Loss: ₹{log.financialLoss}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WasteRadar;
