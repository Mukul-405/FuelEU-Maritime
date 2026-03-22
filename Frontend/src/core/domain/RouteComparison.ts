export interface RouteComparison {
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  ghg_intensity: number;
  baseline_ghg_intensity: number;
  variance_percentage: number;
  is_baseline: boolean;
}
