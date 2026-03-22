import { IRouteRepository } from '../ports/IRouteRepository';

export interface RouteComparisonResult {
    route_id: string;
    vessel_type: string;
    fuel_type: string;
    ghg_intensity: number;
    baseline_ghg_intensity: number;
    variance_percentage: number;
    is_baseline: boolean;
}

export class GetRouteComparisonUseCase {
    constructor(private routeRepository: IRouteRepository) {}

    async execute(): Promise<RouteComparisonResult[]> {
        const routes = await this.routeRepository.getRoutes();
        
        const baselineRoute = routes.find(r => r.is_baseline);
        if (!baselineRoute) {
            throw new Error("No baseline route configured.");
        }

        const baselineIntensity = baselineRoute.ghg_intensity;

        return routes.map(route => {
            let variance = 0;
            if (baselineIntensity > 0) {
                variance = ((route.ghg_intensity - baselineIntensity) / baselineIntensity) * 100;
            }

            return {
                route_id: route.route_id,
                vessel_type: route.vessel_type,
                fuel_type: route.fuel_type,
                ghg_intensity: route.ghg_intensity,
                baseline_ghg_intensity: baselineIntensity,
                variance_percentage: parseFloat(variance.toFixed(2)),
                is_baseline: route.is_baseline
            };
        });
    }
}
