import { IComplianceUseCase } from "../ports/in/IComplianceUseCase";
import { IRouteRepository } from "../ports/out/IRouteRepository";
import { ComplianceService } from "../../../src/domain/services/ComplianceService";

export class ComplianceUseCase implements IComplianceUseCase {
    constructor(private routeRepo: IRouteRepository) { }

    async getComplianceBalance(): Promise<any> {
        const baseline = await this.routeRepo.findBaseline();
        if (!baseline) {
            throw new Error("No baseline route found to act as Target.");
        }

        const targetIntensity = baseline.ghg_intensity;
        const allRoutes = await this.routeRepo.findAll();

        // (Target - Actual) * (Fuel Consumption * 41,000)
        let totalCB = 0;
        const breakdown = allRoutes.map(route => {
            const actualIntensity = route.ghg_intensity;
            const cb = (targetIntensity - actualIntensity) * (route.fuel_consumption * 41000);
            totalCB += cb;
            return {
                route_id: route.route_id,
                vessel_type: route.vessel_type,
                fuel_type: route.fuel_type,
                compliance_balance: cb
            };
        });

        return {
            targetIntensity,
            totalComplianceBalance: totalCB,
            breakdown
        };
    }
}
