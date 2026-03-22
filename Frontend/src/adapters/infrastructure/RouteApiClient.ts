import axios from 'axios';
import type { IRouteApiClient } from '../../core/ports/IRouteApiClient';
import type { Route } from '../../core/domain/Route';
import type { RouteComparison } from '../../core/domain/RouteComparison';
import type { BankRecord, ComplianceBalanceResult, AdjustedCbResult } from '../../core/domain/BankingModels';
import type { PoolMemberInput, PoolResult } from '../../core/domain/PoolingModels';

export class RouteApiClient implements IRouteApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async getRoutes(): Promise<Route[]> {
    const response = await axios.get<Route[]>(`${this.baseUrl}/routes`);
    return response.data;
  }

  async setBaseline(id: number): Promise<void> {
    await axios.post(`${this.baseUrl}/api/routes/${id}/baseline`);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const response = await axios.get<RouteComparison[]>(`${this.baseUrl}/routes/comparison`);
    return response.data;
  }

  // Banking
  async getComplianceCb(actualIntensity: number, fuelConsumption: number): Promise<ComplianceBalanceResult> {
    const response = await axios.get<ComplianceBalanceResult>(`${this.baseUrl}/compliance/cb`, {
      params: { actual_intensity: actualIntensity, fuel_consumption: fuelConsumption },
    });
    return response.data;
  }

  async getBankRecords(shipId: string, year?: number): Promise<BankRecord[]> {
    const response = await axios.get<BankRecord[]>(`${this.baseUrl}/banking/records`, {
      params: { shipId, ...(year !== undefined && { year }) },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<void> {
    await axios.post(`${this.baseUrl}/banking/bank`, { ship_id: shipId, year, amount });
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number): Promise<void> {
    await axios.post(`${this.baseUrl}/banking/apply`, { ship_id: shipId, year, amount });
  }

  // Pooling
  async getAdjustedCb(shipId: string, year: number): Promise<AdjustedCbResult> {
    const response = await axios.get<AdjustedCbResult>(`${this.baseUrl}/compliance/adjusted-cb`, {
      params: { ship_id: shipId, year },
    });
    return response.data;
  }

  async createPool(year: number, members: PoolMemberInput[]): Promise<PoolResult> {
    const response = await axios.post<PoolResult>(`${this.baseUrl}/pools`, { year, members });
    return response.data;
  }
}

export const routeApiClient = new RouteApiClient();
