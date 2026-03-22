import React from 'react';

const RoutesTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Voyage Routes</h2>
                <button className="bg-accent hover:bg-accent/90 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors">
                    Add New Route
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Vessel</th>
                            <th className="px-6 py-4 font-medium">Route</th>
                            <th className="px-6 py-4 font-medium">Fuel (t)</th>
                            <th className="px-6 py-4 font-medium">Intensity</th>
                            <th className="px-6 py-4 font-medium">Compliance Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium">Varuna Navigator</td>
                                <td className="px-6 py-4 text-slate-400">Rotterdam → New York</td>
                                <td className="px-6 py-4">420 t</td>
                                <td className="px-6 py-4">
                                    <span className="text-emerald-400">84.5 g/MJ</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs">
                                        +1.2M MJ
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoutesTab;
