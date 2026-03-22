import React from 'react';

const PoolingTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Compliance Pools</h2>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-lg font-medium transition-colors">
                    Create New Pool
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium">No Compliance Pools Active</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Pools allow multiple vessels to aggregate their compliance balances to meet targets collectively.
                </p>
            </div>
        </div>
    );
};

export default PoolingTab;
