import { Route } from '../../../domain/entities/Route';

export interface IRouteRepository {
    getRoutes(): Promise<Route[]>;
}
