import { Route } from '@domain/entities/Route';

export interface IRouteRepository {
    getRoutes(): Promise<Route[]>;
    setBaseline(id: number): Promise<void>;
}
