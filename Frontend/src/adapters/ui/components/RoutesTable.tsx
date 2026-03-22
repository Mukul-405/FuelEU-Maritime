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
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap lg:flex-nowrap gap-4 bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
        <div className="flex flex-col flex-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Vessel Type</label>
          <input
            type="text"
            placeholder="e.g. Container"
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors"
            value={vesselFilter}
            onChange={(e) => setVesselFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Fuel Type</label>
          <input
            type="text"
            placeholder="e.g. HFO"
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 font-medium">Year</label>
          <input
            type="number"
            placeholder="e.g. 2025"
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-neutral-700 rounded-xl bg-neutral-900">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-700 text-neutral-400 text-sm">
              <th className="p-4 font-semibold">Route ID</th>
              <th className="p-4 font-semibold">Vessel Type</th>
              <th className="p-4 font-semibold">Fuel Type</th>
              <th className="p-4 font-semibold">Year</th>
              <th className="p-4 font-semibold">GHG Intensity</th>
              <th className="p-4 font-semibold">Distance</th>
              <th className="p-4 font-semibold">Baseline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.route_id} className="border-b border-neutral-800 hover:bg-neutral-800/80 transition-colors">
                <td className="p-4 font-medium text-white font-mono">{r.route_id}</td>
                <td className="p-4 text-neutral-300">{r.vessel_type}</td>
                <td className="p-4 text-neutral-300">{r.fuel_type}</td>
                <td className="p-4 text-neutral-300">{r.year}</td>
                <td className="p-4 text-neutral-300 font-mono">{r.ghg_intensity.toFixed(2)} <span className="text-xs text-neutral-500">gCO2e/MJ</span></td>
                <td className="p-4 text-neutral-300 font-mono">{r.distance} <span className="text-xs text-neutral-500">NM</span></td>
                <td className="p-4">
                  {r.is_baseline ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                      <CheckCircle size={16} /> Baseline
                    </span>
                  ) : (
                    <button
                      onClick={() => r.id != null && handleSetBaseline(r.id)}
                      disabled={loadingId === r.id || r.id == null}
                      className="bg-neutral-800 hover:bg-blue-600 disabled:opacity-50 text-white border border-neutral-600 hover:border-blue-500 text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
                    >
                      {loadingId === r.id ? 'Setting...' : 'Set Baseline'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-neutral-500">
                  No routes match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
