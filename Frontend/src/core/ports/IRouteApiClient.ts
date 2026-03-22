import type { Route } from '../domain/Route';
import type { RouteComparison } from '../domain/RouteComparison';
import type { BankRecord, ComplianceBalanceResult, AdjustedCbResult } from '../domain/BankingModels';
import type { PoolMemberInput, PoolResult } from '../domain/PoolingModels';

export interface IRouteApiClient {
  getRoutes(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getComparison(): Promise<RouteComparison[]>;

  // Banking
  getComplianceCb(actualIntensity: number, fuelConsumption: number): Promise<ComplianceBalanceResult>;
  getBankRecords(shipId: string, year?: number): Promise<BankRecord[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<void>;
  applyBankedSurplus(shipId: string, year: number, amount: number): Promise<void>;

  // Pooling
  getAdjustedCb(shipId: string, year: number): Promise<AdjustedCbResult>;
  createPool(year: number, members: PoolMemberInput[]): Promise<PoolResult>;
}
