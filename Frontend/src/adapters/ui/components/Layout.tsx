import { NavLink, Outlet } from 'react-router-dom';
import { Anchor, BarChart2, Briefcase, Users } from 'lucide-react';

export const Layout = () => {
    return (
        <div className="flex h-screen bg-neutral-900 text-white font-sans">
            <aside className="w-64 bg-neutral-950 p-6 flex flex-col gap-6 border-r border-neutral-800">
                <div className="text-2xl font-bold tracking-tight text-blue-400">FuelEU Maritime</div>
                <nav className="flex flex-col gap-2">
                    <NavLink to="/routes" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 shadow-md shadow-blue-900/50 text-white font-medium' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                        <Anchor size={20} /> Routes
                    </NavLink>
                    <NavLink to="/compare" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 shadow-md shadow-blue-900/50 text-white font-medium' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                        <BarChart2 size={20} /> Compare
                    </NavLink>
                    <NavLink to="/banking" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 shadow-md shadow-blue-900/50 text-white font-medium' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                        <Briefcase size={20} /> Banking
                    </NavLink>
                    <NavLink to="/pooling" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 shadow-md shadow-blue-900/50 text-white font-medium' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                        <Users size={20} /> Pooling
                    </NavLink>
                </nav>
            </aside>
            <main className="flex-1 overflow-auto bg-neutral-900 p-8">
                <Outlet />
            </main>
        </div>
    );
};
