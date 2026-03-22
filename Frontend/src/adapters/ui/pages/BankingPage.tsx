import { useState } from 'react';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import type { BankRecord } from '../../../core/domain/BankingModels';
import { canBankSurplus } from '../../../core/domain/BankingModels';
import { Banknote, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';

export const BankingPage = () => {
  // CB Calculation inputs
  const [intensity, setIntensity] = useState('');
  const [fuelCons, setFuelCons] = useState('');
  const [currentCb, setCurrentCb] = useState<number | null>(null);

  // Banking action inputs
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState('2025');
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');

  // Bank records
  const [records, setRecords] = useState<BankRecord[]>([]);
  const [totalBanked, setTotalBanked] = useState(0);

  // Status
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const clearMessage = () => setTimeout(() => setMessage(null), 4000);

  const handleCalculateCB = async () => {
    if (!intensity || !fuelCons) return;
    setLoading(true);
    try {
      const result = await routeApiClient.getComplianceCb(parseFloat(intensity), parseFloat(fuelCons));
      setCurrentCb(result.cb_gco2eq);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate CB';
      setMessage({ type: 'error', text: msg });
      clearMessage();
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRecords = async () => {
    if (!shipId) return;
    setLoading(true);
    try {
      const data = await routeApiClient.getBankRecords(shipId, year ? parseInt(year) : undefined);
      setRecords(data);
      const banked = data.reduce((sum, r) => sum + r.amount_gco2eq, 0);
      setTotalBanked(banked);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch records';
      setMessage({ type: 'error', text: msg });
      clearMessage();
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!shipId || !year || !bankAmount) return;
    setLoading(true);
    try {
      await routeApiClient.bankSurplus(shipId, parseInt(year), parseFloat(bankAmount));
      setMessage({ type: 'success', text: 'Surplus banked successfully!' });
      clearMessage();
      setBankAmount('');
      handleFetchRecords();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Bank operation failed';
      setMessage({ type: 'error', text: errMsg });
      clearMessage();
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!shipId || !year || !applyAmount) return;
    setLoading(true);
    try {
      await routeApiClient.applyBankedSurplus(shipId, parseInt(year), parseFloat(applyAmount));
      setMessage({ type: 'success', text: 'Banked surplus applied successfully!' });
      clearMessage();
      setApplyAmount('');
      handleFetchRecords();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Apply operation failed';
      setMessage({ type: 'error', text: errMsg });
      clearMessage();
    } finally {
      setLoading(false);
    }
  };

  const bankDisabled = currentCb === null || !canBankSurplus(currentCb) || loading;
  const applyDisabled = totalBanked <= 0 || loading;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-3xl font-extrabold text-white">Art. 20 — Banking Module</h1>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' : 'bg-rose-400/10 border-rose-400/30 text-rose-400'}`}>
          {message.text}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Current CB</div>
          <div className={`text-3xl font-black ${currentCb !== null && currentCb > 0 ? 'text-emerald-400' : currentCb !== null && currentCb < 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
            {currentCb !== null ? currentCb.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
          </div>
          <div className="text-xs text-neutral-500 mt-1">gCO₂eq</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Total Banked</div>
          <div className="text-3xl font-black text-blue-400 flex items-center gap-2">
            <Banknote size={28} /> {totalBanked.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-neutral-500 mt-1">gCO₂eq surplus</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Bank Status</div>
          {currentCb !== null && canBankSurplus(currentCb) ? (
            <div className="text-xl font-bold text-emerald-400">Eligible to Bank</div>
          ) : (
            <div className="text-xl font-bold text-amber-400 flex items-center gap-2"><AlertTriangle size={20} /> CB ≤ 0</div>
          )}
        </div>
      </div>

      {/* CB Calculator */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" /> Calculate Compliance Balance
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Actual GHG Intensity</label>
            <input type="number" step="0.01" placeholder="e.g. 85.5" className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors" value={intensity} onChange={e => setIntensity(e.target.value)} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Fuel Consumption (tonnes)</label>
            <input type="number" step="0.01" placeholder="e.g. 1200" className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors" value={fuelCons} onChange={e => setFuelCons(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={handleCalculateCB} disabled={loading || !intensity || !fuelCons} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all">
              Calculate
            </button>
          </div>
        </div>
      </div>

      {/* Banking Actions */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block" /> Banking Actions
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Ship ID</label>
            <input type="text" placeholder="e.g. SHIP-001" className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors" value={shipId} onChange={e => setShipId(e.target.value)} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Year</label>
            <input type="number" placeholder="2025" className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors" value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={handleFetchRecords} disabled={loading || !shipId} className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all">
              Load Records
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bank Surplus */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-emerald-400"><ArrowDownCircle size={20} /> Bank Surplus</h3>
            <div className="flex gap-3">
              <input type="number" step="0.01" placeholder="Amount to bank" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-emerald-500 transition-colors flex-1" value={bankAmount} onChange={e => setBankAmount(e.target.value)} />
              <button onClick={handleBank} disabled={bankDisabled || !bankAmount} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-all">
                Bank
              </button>
            </div>
            {bankDisabled && currentCb !== null && <p className="text-xs text-amber-400 mt-2">CB must be &gt; 0 to bank surplus.</p>}
          </div>

          {/* Apply Banked */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-400"><ArrowUpCircle size={20} /> Apply Banked Surplus</h3>
            <div className="flex gap-3">
              <input type="number" step="0.01" placeholder="Amount to apply" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors flex-1" value={applyAmount} onChange={e => setApplyAmount(e.target.value)} />
              <button onClick={handleApply} disabled={applyDisabled || !applyAmount} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-all">
                Apply
              </button>
            </div>
            {applyDisabled && <p className="text-xs text-amber-400 mt-2">No banked surplus available to apply.</p>}
          </div>
        </div>
      </div>

      {/* Bank Records Table */}
      {records.length > 0 && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full inline-block" /> Bank Records
          </h2>
          <div className="overflow-x-auto border border-neutral-700 rounded-xl bg-neutral-900">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950 border-b border-neutral-700 text-neutral-400 text-sm">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Ship</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-800 hover:bg-neutral-800/80 transition-colors">
                    <td className="p-4 text-neutral-400 font-mono text-sm">{r.id}</td>
                    <td className="p-4 text-white font-mono">{r.shipId}</td>
                    <td className="p-4 text-neutral-300">{r.year}</td>
                    <td className={`p-4 font-mono ${r.amount_gco2eq >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {r.amount_gco2eq >= 0 ? '+' : ''}{r.amount_gco2eq.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
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
