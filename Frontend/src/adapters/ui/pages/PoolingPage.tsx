import { useState } from 'react';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import type { PoolMemberInput, PoolResult } from '../../../core/domain/PoolingModels';
import { PoolSumCalculator } from '../../../core/domain/PoolSumCalculator';
import { Users, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface ShipEntry {
  shipId: string;
  year: string;
  cb: number | null;
  loading: boolean;
}

export const PoolingPage = () => {
  const [poolYear, setPoolYear] = useState('2025');
  const [ships, setShips] = useState<ShipEntry[]>([{ shipId: '', year: '2025', cb: null, loading: false }]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PoolResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedMembers: PoolMemberInput[] = ships
    .filter((s) => s.cb !== null && s.shipId)
    .map((s) => ({ shipId: s.shipId, cb: s.cb! }));

  const poolSum = PoolSumCalculator.calculateSum(selectedMembers);
  const poolValid = PoolSumCalculator.isPoolValid(selectedMembers);

  const addShipRow = () => {
    setShips([...ships, { shipId: '', year: poolYear, cb: null, loading: false }]);
  };

  const removeShipRow = (index: number) => {
    setShips(ships.filter((_, i) => i !== index));
  };

  const updateShip = (index: number, field: keyof ShipEntry, value: string) => {
    setShips(ships.map((s, i) => (i === index ? { ...s, [field]: value, ...(field !== 'cb' ? { cb: null } : {}) } : s)));
  };

  const fetchCb = async (index: number) => {
    const ship = ships[index];
    if (!ship.shipId || !ship.year) return;

    setShips(ships.map((s, i) => (i === index ? { ...s, loading: true } : s)));
    try {
      const res = await routeApiClient.getAdjustedCb(ship.shipId, parseInt(ship.year));
      setShips(prev => prev.map((s, i) => (i === index ? { ...s, cb: res.adjusted_cb, loading: false } : s)));
    } catch {
      setShips(prev => prev.map((s, i) => (i === index ? { ...s, cb: null, loading: false } : s)));
      setError(`Could not fetch CB for ${ship.shipId}`);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleSubmitPool = async () => {
    if (selectedMembers.length === 0 || !poolValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await routeApiClient.createPool(parseInt(poolYear), selectedMembers);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create pool';
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-3xl font-extrabold text-white">Art. 21 — Pooling Tool</h1>

      {error && (
        <div className="p-4 rounded-xl border bg-rose-400/10 border-rose-400/30 text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Pool Sum Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Ships Selected</div>
          <div className="text-3xl font-black text-blue-400 flex items-center gap-2">
            <Users size={28} /> {selectedMembers.length}
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center col-span-1 lg:col-span-2" role="status" aria-label={`Pool Sum Indicator: ${selectedMembers.length === 0 ? 'No ships selected' : poolValid ? 'Valid pool configuration' : 'Invalid pool configuration'}`}>
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Pool Sum Indicator</div>
          <div className={`text-3xl font-black flex items-center gap-3 ${poolValid ? 'text-emerald-400' : 'text-rose-400'}`} aria-live="polite">
            {poolValid ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
            {selectedMembers.length === 0 ? '—' : poolSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-sm font-normal text-neutral-500">gCO₂eq</span>
          </div>
          <div className={`text-xs mt-1 ${poolValid ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>
            {selectedMembers.length === 0 ? 'Add ships to see the pool sum' : poolValid ? 'Pool sum ≥ 0 — Valid configuration' : 'Pool sum < 0 — Invalid configuration'}
          </div>
        </div>
      </div>

      {/* Ship Multi-Select */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" /> Select Ships for Pool
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Pool Year</label>
            <input type="number" value={poolYear} onChange={e => setPoolYear(e.target.value)} className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors w-24 text-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {ships.map((ship, i) => (
            <div key={i} className="flex flex-wrap lg:flex-nowrap items-end gap-3 bg-neutral-900 border border-neutral-700 rounded-xl p-4">
              <div className="flex flex-col flex-1">
                <label className="text-xs text-neutral-500 mb-1">Ship ID</label>
                <input type="text" placeholder="e.g. SHIP-001" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors text-sm" value={ship.shipId} onChange={e => updateShip(i, 'shipId', e.target.value)} />
              </div>
              <div className="flex flex-col w-24">
                <label className="text-xs text-neutral-500 mb-1">Year</label>
                <input type="number" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors text-sm" value={ship.year} onChange={e => updateShip(i, 'year', e.target.value)} />
              </div>
              <button onClick={() => fetchCb(i)} disabled={ship.loading || !ship.shipId} className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shrink-0">
                {ship.loading ? 'Loading...' : 'Fetch CB'}
              </button>
              <div className="flex flex-col w-36">
                <label className="text-xs text-neutral-500 mb-1">CB</label>
                <div className={`bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono ${ship.cb !== null ? (ship.cb >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-neutral-500'}`}>
                  {ship.cb !== null ? ship.cb.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                </div>
              </div>
              <button onClick={() => removeShipRow(i)} disabled={ships.length <= 1} className="text-neutral-500 hover:text-rose-400 disabled:opacity-30 transition-colors shrink-0 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button onClick={addShipRow} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Plus size={16} /> Add Ship
          </button>
          <button onClick={handleSubmitPool} disabled={submitting || selectedMembers.length === 0 || !poolValid} aria-label={!poolValid ? 'Cannot create pool: sum is negative' : 'Create pool'} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-all">
            {submitting ? 'Creating Pool...' : 'Create Pool'}
          </button>
        </div>
      </div>

      {/* Pool Result */}
      {result && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block" /> Pool Created — <span className="text-blue-400 font-mono">{result.pool_id}</span>
          </h2>
          <div className="overflow-x-auto border border-neutral-700 rounded-xl bg-neutral-900">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950 border-b border-neutral-700 text-neutral-400 text-sm">
                  <th className="p-4 font-semibold">Ship</th>
                  <th className="p-4 font-semibold">CB Before</th>
                  <th className="p-4 font-semibold">CB After</th>
                  <th className="p-4 font-semibold">Allocated</th>
                </tr>
              </thead>
              <tbody>
                {result.members.map((m) => (
                  <tr key={m.ship_id} className="border-b border-neutral-800 hover:bg-neutral-800/80 transition-colors">
                    <td className="p-4 text-white font-mono">{m.ship_id}</td>
                    <td className={`p-4 font-mono ${m.cb_before >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{m.cb_before.toLocaleString()}</td>
                    <td className={`p-4 font-mono ${m.cb_after >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{m.cb_after.toLocaleString()}</td>
                    <td className="p-4 font-mono text-blue-400">{m.allocated_cb.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
