import { useEffect, useState } from 'react';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import type { Route } from '../../../core/domain/Route';

export const RoutesPage = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const data = await routeApiClient.getRoutes();
                setRoutes(data);
            } catch (error) {
                console.error('Failed to fetch routes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-extrabold text-white">Routes Overview</h1>
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">
                {loading ? (
                    <div className="text-neutral-400 flex items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> Loading routes...</div>
                ) : routes.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                        {routes.map(r => (
                            <li key={r.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-700 flex justify-between items-center hover:border-blue-500/50 transition-colors">
                                <div>
                                    <div className="font-semibold text-lg">{r.name}</div>
                                    <div className="text-sm text-neutral-400">{r.sourcePort} &rarr; {r.destinationPort}</div>
                                </div>
                                <div className="text-blue-400 font-mono bg-blue-900/20 px-3 py-1 rounded-full">{r.distanceNm} NM</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-neutral-400">No routes found. Start by adding a route via the API.</div>
                )}
            </div>
        </div>
    );
};
