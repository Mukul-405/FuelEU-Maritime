import { RouteData, Route } from "../../../domain/entities/Route";

export interface IRouteUseCase {
    registerRoute(data: RouteData): Promise<Route>;
    getAllRoutes(): Promise<Route[]>;
    setBaseline(id: number): Promise<void>;
}
