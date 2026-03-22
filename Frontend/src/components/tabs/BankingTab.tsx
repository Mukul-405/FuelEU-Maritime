import React from 'react';

const BankingTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Compliance Banking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-accent/20 to-blue-600/5 border border-accent/20 p-6 rounded-xl shadow-lg shadow-accent/5">
                    <p className="text-accent/80 text-sm font-medium uppercase tracking-wider mb-1">Banked Balance</p>
                    <h3 className="text-3xl font-bold">12.4M MJ</h3>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Available for Banking</p>
                    <h3 className="text-3xl font-bold text-emerald-400">2.1M MJ</h3>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <button className="w-full h-full text-center border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-all">
                        Bank Surplus Energy
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Banking History</h3>
                <p className="text-slate-500 text-sm italic">No recent transactions recorded.</p>
            </div>
        </div>
    );
};

export default BankingTab;
