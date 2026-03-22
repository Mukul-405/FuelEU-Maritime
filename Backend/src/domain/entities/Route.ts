export interface RouteData {
    id?: number;
    route_id: string;
    vessel_type: string;
    fuel_type: string;
    year: number;
    ghg_intensity: number;
    fuel_consumption: number;
    distance: number;
    total_emissions: number;
    is_baseline?: boolean;
}

export class Route {
    public id?: number;
    public route_id: string;
    public vessel_type: string;
    public fuel_type: string;
    public year: number;
    public ghg_intensity: number;
    public fuel_consumption: number;
    public distance: number;
    public total_emissions: number;
    public is_baseline: boolean;

    constructor(data: RouteData) {
        this.id = data.id;
        this.route_id = data.route_id;
        this.vessel_type = data.vessel_type;
        this.fuel_type = data.fuel_type;
        this.year = data.year;
        this.ghg_intensity = data.ghg_intensity;
        this.fuel_consumption = data.fuel_consumption;
        this.distance = data.distance;
        this.total_emissions = data.total_emissions;
        this.is_baseline = data.is_baseline || false;
    }
}
