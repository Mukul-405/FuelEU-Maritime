import { useState } from 'react';
import type { Route } from '../../../core/domain/Route';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import { CheckCircle } from 'lucide-react';

interface RoutesTableProps {
  routes: Route[];
  onBaselineSet: () => void;
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ routes, onBaselineSet }) => {
  const [vesselFilter, setVesselFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filtered = routes.filter((r) => {
    const matchVessel = !vesselFilter || r.vessel_type.toLowerCase().includes(vesselFilter.toLowerCase());
    const matchFuel = !fuelFilter || r.fuel_type.toLowerCase().includes(fuelFilter.toLowerCase());
    const matchYear = !yearFilter || r.year.toString() === yearFilter;
    return matchVessel && matchFuel && matchYear;
  });

  const handleSetBaseline = async (id: number) => {
    setLoadingId(id);
    try {
      await routeApiClient.setBaseline(id);
      onBaselineSet();
    } catch (err) {
      console.error('Failed to set baseline', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4 bg-white/[0.02] p-5 rounded-2xl border border-white/10 shadow-inner">
        <div className="flex flex-col flex-1 relative group">
          <label className="text-[10px] uppercase tracking-widest text-neutral-400/80 mb-2 font-semibold ml-1">Vessel Type</label>
          <input
            type="text"
            placeholder="e.g. Container"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-neutral-600 font-medium"
            value={vesselFilter}
            onChange={(e) => setVesselFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1 relative group">
          <label className="text-[10px] uppercase tracking-widest text-neutral-400/80 mb-2 font-semibold ml-1">Fuel Type</label>
          <input
            type="text"
            placeholder="e.g. HFO"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-neutral-600 font-medium"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1 relative group">
          <label className="text-[10px] uppercase tracking-widest text-neutral-400/80 mb-2 font-semibold ml-1">Year</label>
          <input
            type="number"
            placeholder="e.g. 2025"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-neutral-600 font-medium"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-5 rounded-tl-2xl">Route ID</th>
              <th className="px-6 py-5">Vessel Type</th>
              <th className="px-6 py-5">Fuel Type</th>
              <th className="px-6 py-5">Year</th>
              <th className="px-6 py-5">GHG Intensity</th>
              <th className="px-6 py-5">Fuel Cons. (t)</th>
              <th className="px-6 py-5">Distance (km)</th>
              <th className="px-6 py-5">Total Emis. (t)</th>
              <th className="px-6 py-5 text-center rounded-tr-2xl">Baseline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filtered.map((r) => (
              <tr key={r.route_id} className="group hover:bg-white/[0.04] transition-colors duration-200">
                <td className="px-6 py-4 font-bold text-white font-mono flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">ID</span>
                  {r.route_id}
                </td>
                <td className="px-6 py-4 text-neutral-300 font-medium">{r.vessel_type}</td>
                <td className="px-6 py-4">
                  <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-md font-semibold border border-neutral-700 tracking-wide">{r.fuel_type}</span>
                </td>
                <td className="px-6 py-4 text-neutral-300 font-medium">{r.year}</td>
                <td className="px-6 py-4 text-white font-mono font-medium">
                  {r.ghg_intensity.toFixed(2)} <span className="text-[10px] text-neutral-500 ml-1 uppercase">gCO₂e/MJ</span>
                </td>
                <td className="px-6 py-4 text-white font-mono font-medium">
                  {r.fuel_consumption.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-white font-mono font-medium">
                  {r.distance.toLocaleString()} <span className="text-[10px] text-neutral-500 ml-1">KM</span>
                </td>
                <td className="px-6 py-4 text-white font-mono font-medium">
                  {r.total_emissions.toLocaleString()}
                </td>
                <td className="px-6 py-4 flex justify-center">
                  {r.is_baseline ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                      <CheckCircle size={14} /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => r.id != null && handleSetBaseline(r.id)}
                      disabled={loadingId === r.id || r.id == null}
                      className="group/btn relative overflow-hidden bg-white/5 hover:bg-transparent disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider border border-white/10 hover:border-transparent px-5 py-2 rounded-xl transition-all shadow-lg"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">{loadingId === r.id ? 'Setting...' : 'Set Baseline'}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl opacity-50">🔍</span>
                    <span className="font-medium">No routes match your filters</span>
                    <span className="text-sm text-neutral-600">Try adjusting the vessel, fuel, or year filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
