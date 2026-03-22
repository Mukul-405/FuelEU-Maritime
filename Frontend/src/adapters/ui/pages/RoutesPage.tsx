import { useEffect, useState, useCallback } from 'react';
import { routeApiClient } from '../../infrastructure/RouteApiClient';
import type { Route } from '../../../core/domain/Route';
import { RoutesTable } from '../components/RoutesTable';

export const RoutesPage = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await routeApiClient.getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Failed to fetch routes', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 mb-2">Routes Overview</h1>
        
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-neutral-400 font-medium">Loading routes mapping...</p>
            </div>
          ) : routes.length > 0 ? (
            <RoutesTable routes={routes} onBaselineSet={fetchRoutes} />
          ) : (
            <div className="text-neutral-400 text-center py-12">
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <span className="text-2xl">🚢</span>
              </div>
              No routes found. Add routes via <code className="bg-black/50 px-2 py-1 rounded text-blue-400 font-mono text-sm border border-white/5">POST /api/routes</code>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
