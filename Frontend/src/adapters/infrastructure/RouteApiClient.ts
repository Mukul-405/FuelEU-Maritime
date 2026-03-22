import axios from 'axios';
import type { IRouteApiClient } from '../../core/ports/IRouteApiClient';
import type { Route } from '../../core/domain/Route';

export class RouteApiClient implements IRouteApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async getRoutes(): Promise<Route[]> {
    const response = await axios.get<Route[]>(`${this.baseUrl}/routes`);
    return response.data;
  }
}

export const routeApiClient = new RouteApiClient();
