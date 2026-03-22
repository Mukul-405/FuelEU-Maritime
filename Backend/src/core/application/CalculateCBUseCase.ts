import { ComputeCB } from '../domain/ComplianceMath';
// Fallback if not there

import { IComplianceRepository } from '../ports/IComplianceRepository';

export const TARGET_INTENSITY_2025 = 89.3368;
export const ENERGY_CONSTANT = 41000;

export class CalculateCBUseCase {
    constructor(private complianceRepository?: IComplianceRepository) {}

    async execute(actualIntensity: number, fuelConsumption: number, shipId?: string, year?: number): Promise<number> {
        const cb = (TARGET_INTENSITY_2025 - actualIntensity) * (fuelConsumption * ENERGY_CONSTANT);
        
        if (this.complianceRepository && shipId && year) {
            await this.complianceRepository.saveComplianceBalance(shipId, year, cb);
        }
        
        return cb;
    }
}
