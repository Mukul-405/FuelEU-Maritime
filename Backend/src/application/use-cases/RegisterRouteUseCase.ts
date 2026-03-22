import { IRouteUseCase } from "../ports/in/IRouteUseCase";
import { IRouteRepository } from "../ports/out/IRouteRepository";
import { Route, RouteData } from "../../../src/domain/entities/Route";

export class RegisterRouteUseCase implements IRouteUseCase {
    constructor(private routeRepository: IRouteRepository) { }

    async registerRoute(data: RouteData): Promise<Route> {
        // Validation/Mapping
        const route = new Route({
            ...data,
            is_baseline: data.is_baseline || false,
        });

        return await this.routeRepository.save(route);
    }

    async getAllRoutes(): Promise<Route[]> {
        return await this.routeRepository.findAll();
    }

    async setBaseline(id: number): Promise<void> {
        await this.routeRepository.markAsBaseline(id);
    }
}
