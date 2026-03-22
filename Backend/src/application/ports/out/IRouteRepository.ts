import { Route } from "@domain/entities/Route";

export interface IRouteRepository {
    save(route: Route): Promise<Route>;
    findAll(): Promise<Route[]>;
    findById(id: number): Promise<Route | null>;
    markAsBaseline(id: number): Promise<void>;
    findBaseline(): Promise<Route | null>;
}
