import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Route, RouteData } from '../../../domain/entities/Route';
import { dbPool } from '../../../infrastructure/adapters/out/db/DatabasePool';

export class PgRouteRepository implements IRouteRepository {
    async getRoutes(): Promise<Route[]> {
        const query = `
            SELECT 
                id, 
                route_id, 
                vessel_type, 
                fuel_type, 
                year, 
                ghg_intensity, 
                fuel_consumption, 
                distance, 
                total_emissions, 
                is_baseline
            FROM routes
        `;

        try {
            const result = await dbPool.query(query);
            return result.rows.map((row: any) => {
                const routeData: RouteData = {
                    id: row.id,
                    route_id: row.route_id,
                    vessel_type: row.vessel_type,
                    fuel_type: row.fuel_type,
                    year: row.year,
                    ghg_intensity: parseFloat(row.ghg_intensity),
                    fuel_consumption: parseFloat(row.fuel_consumption),
                    distance: parseFloat(row.distance),
                    total_emissions: parseFloat(row.total_emissions),
                    is_baseline: row.is_baseline
                };
                return new Route(routeData);
            });
        } catch (error) {
            console.error('Error fetching routes from Postgres:', error);
            throw new Error('Failed to fetch routes');
        }
    }

    async setBaseline(id: number): Promise<void> {
        try {
            // Remove existing baseline flags
            await dbPool.query(`UPDATE routes SET is_baseline = false WHERE is_baseline = true`);
            // Set the new baseline
            const result = await dbPool.query(`UPDATE routes SET is_baseline = true WHERE id = $1`, [id]);
            if (result.rowCount === 0) {
                throw new Error(`Route with id ${id} not found`);
            }
        } catch (error) {
            console.error('Error setting baseline in Postgres:', error);
            throw error;
        }
    }
}
