import React from 'react';

const CompareTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Compliance Comparison</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl min-h-[400px] flex items-center justify-center relative">
                    {/* Placeholder for Recharts Chart */}
                    <div className="text-center space-y-4">
                        <div className="flex items-end justify-center gap-4 h-48">
                            <div className="w-12 bg-slate-700 rounded-t-lg h-full relative group">
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs">89.33</span>
                            </div>
                            <div className="w-12 bg-accent rounded-t-lg h-3/4 relative group">
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs">84.50</span>
                            </div>
                        </div>
                        <p className="text-slate-400">Target vs. Actual Intensity (gCO2e/MJ)</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-medium mb-4">Summary Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Avg. Intensity</span>
                                <span className="font-semibold text-emerald-400">85.2 g/MJ</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Total Surplus</span>
                                <span className="font-semibold text-accent">4.8M MJ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareTab;
