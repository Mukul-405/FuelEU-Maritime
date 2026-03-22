import { IRouteRepository } from '../ports/IRouteRepository';
import { Route } from '../../domain/entities/Route';

export class GetRoutesUseCase {
    constructor(private routeRepository: IRouteRepository) {}

    async execute(): Promise<Route[]> {
        return await this.routeRepository.getRoutes();
    }
}
