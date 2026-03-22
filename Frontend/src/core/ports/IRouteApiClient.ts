import type { Route } from '../domain/Route';

export interface IRouteApiClient {
  getRoutes(): Promise<Route[]>;
}
