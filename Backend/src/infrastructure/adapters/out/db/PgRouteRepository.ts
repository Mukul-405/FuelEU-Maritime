import { IRouteRepository } from "../../../../../src/application/ports/out/IRouteRepository";
import { Route, RouteData } from "../../../../../src/domain/entities/Route";
import { dbPool } from "./DatabasePool";

export class PgRouteRepository implements IRouteRepository {
    async save(route: Route): Promise<Route> {
        const query = `
            INSERT INTO routes (
                route_id, vessel_type, fuel_type, year, ghg_intensity, 
                fuel_consumption, distance, total_emissions, is_baseline
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const values = [
            route.route_id, route.vessel_type, route.fuel_type, route.year,
            route.ghg_intensity, route.fuel_consumption, route.distance,
            route.total_emissions, route.is_baseline
        ];
        const res = await dbPool.query(query, values);
        return new Route(res.rows[0]);
    }

    async findAll(): Promise<Route[]> {
        const query = `SELECT * FROM routes ORDER BY id DESC;`;
        const res = await dbPool.query(query);
        return res.rows.map((r: any) => new Route(r));
    }

    async findById(id: number): Promise<Route | null> {
        const query = `SELECT * FROM routes WHERE id = $1;`;
        const res = await dbPool.query(query, [id]);
        if (res.rows.length === 0) return null;
        return new Route(res.rows[0]);
    }

    async markAsBaseline(id: number): Promise<void> {
        // First, optionally turn off other baselines if there can be only one,
        // but let's just mark this one as baseline.
        const query = `UPDATE routes SET is_baseline = true WHERE id = $1;`;
        await dbPool.query(query, [id]);
    }

    async findBaseline(): Promise<Route | null> {
        const query = `SELECT * FROM routes WHERE is_baseline = true LIMIT 1;`;
        const res = await dbPool.query(query);
        if (res.rows.length === 0) return null;
        return new Route(res.rows[0]);
    }
}
