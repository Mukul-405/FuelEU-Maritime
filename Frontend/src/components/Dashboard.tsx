import React, { useState } from 'react';
import RoutesTab from './tabs/RoutesTab';
import CompareTab from './tabs/CompareTab';
import BankingTab from './tabs/BankingTab';
import PoolingTab from './tabs/PoolingTab';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('routes');

    const tabs = [
        { id: 'routes', label: 'Routes' },
        { id: 'compare', label: 'Compare' },
        { id: 'banking', label: 'Banking' },
        { id: 'pooling', label: 'Pooling' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100">
            <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                    Varuna Marine | FuelEU Compliance
                </h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-accent/10 text-accent border border-accent/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                        {activeTab === 'routes' && <RoutesTab />}
                        {activeTab === 'compare' && <CompareTab />}
                        {activeTab === 'banking' && <BankingTab />}
                        {activeTab === 'pooling' && <PoolingTab />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
