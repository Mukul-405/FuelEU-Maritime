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
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">Routes Overview</h1>
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8 shadow-xl">
        {loading ? (
          <div className="text-neutral-400 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading routes...
          </div>
        ) : routes.length > 0 ? (
          <RoutesTable routes={routes} onBaselineSet={fetchRoutes} />
        ) : (
          <div className="text-neutral-400">No routes found. Add routes via <code className="text-blue-400">POST /api/routes</code>.</div>
        )}
      </div>
    </div>
  );
};
