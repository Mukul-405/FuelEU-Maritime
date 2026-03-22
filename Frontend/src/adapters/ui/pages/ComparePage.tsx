import { useEffect, useState } from 'react';
import {
  BarChart, Bar, ReferenceLine, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import type { RouteComparison } from '../../../core/domain/RouteComparison';
import { ComplianceCalculator, TARGET_INTENSITY } from '../../../core/domain/ComplianceCalculator';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const ComparePage = () => {
  const [data, setData] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await routeApiClient.getComparison();
        setData(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load comparison data';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data.map((c) => ({
    ...c,
    compliant: ComplianceCalculator.isCompliant(c.variance_percentage),
  }));

  const compliantCount = chartData.filter((d) => d.compliant).length;
  const nonCompliantCount = chartData.length - compliantCount;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-white">Compare Routes</h1>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading comparison data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-white">Compare Routes</h1>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[200px]">
          <div className="text-amber-400 flex items-center gap-2">
            <AlertTriangle size={20} /> {error}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-white">Compare Routes</h1>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[200px] text-neutral-400">
          No comparison data available. Set a baseline route first.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-3xl font-extrabold text-white">Compare Routes</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Target Intensity</div>
          <div className="text-3xl font-black text-blue-400">{TARGET_INTENSITY}</div>
          <div className="text-xs text-neutral-500 mt-1">gCO2e/MJ</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Compliant</div>
          <div className="text-3xl font-black text-emerald-400 flex items-center gap-2">
            {compliantCount} <CheckCircle size={28} />
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Non-Compliant</div>
          <div className="text-3xl font-black text-rose-400 flex items-center gap-2">
            {nonCompliantCount} <AlertTriangle size={28} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl min-h-[500px]">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" />
          GHG Intensity by Route
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
              <XAxis
                dataKey="route_id"
                stroke="#a3a3a3"
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                fontSize={12}
              />
              <YAxis stroke="#a3a3a3" axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#262626' }}
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#404040',
                  color: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                }}
              />
              <Legend wrapperStyle={{ color: '#d4d4d4', paddingTop: '20px' }} iconType="circle" />
              <ReferenceLine
                y={TARGET_INTENSITY}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  position: 'right',
                  value: `Target ${TARGET_INTENSITY}`,
                  fill: '#ef4444',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="ghg_intensity" name="GHG Intensity (gCO2e/MJ)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.compliant ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block" />
          Compliance Breakdown
        </h2>
        <div className="overflow-x-auto border border-neutral-700 rounded-xl bg-neutral-900">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-700 text-neutral-400 text-sm">
                <th className="p-4 font-semibold">Route ID</th>
                <th className="p-4 font-semibold">Vessel</th>
                <th className="p-4 font-semibold">Fuel</th>
                <th className="p-4 font-semibold">Actual GHG</th>
                <th className="p-4 font-semibold">Baseline GHG</th>
                <th className="p-4 font-semibold">% Difference</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((r) => (
                <tr key={r.route_id} className="border-b border-neutral-800 hover:bg-neutral-800/80 transition-colors">
                  <td className="p-4 font-medium text-white font-mono">{r.route_id}</td>
                  <td className="p-4 text-neutral-300">{r.vessel_type}</td>
                  <td className="p-4 text-neutral-300">{r.fuel_type}</td>
                  <td className="p-4 text-neutral-300 font-mono">{r.ghg_intensity.toFixed(2)}</td>
                  <td className="p-4 text-neutral-400 font-mono">{r.baseline_ghg_intensity.toFixed(2)}</td>
                  <td className="p-4 font-mono">
                    <span className={r.variance_percentage > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {r.variance_percentage > 0 ? '+' : ''}{r.variance_percentage}%
                    </span>
                  </td>
                  <td className="p-4">
                    {r.compliant ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                        <CheckCircle size={16} /> Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-400 text-sm font-medium bg-rose-400/10 px-3 py-1.5 rounded-full border border-rose-400/20">
                        <AlertTriangle size={16} /> Non-Compliant
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
