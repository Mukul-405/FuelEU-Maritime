import { ComputeCB, TARGET_INTENSITY_2025, ENERGY_CONSTANT } from '../../../src/core/domain/ComplianceMath';

describe('ComplianceMath', () => {
    describe('ComputeCB', () => {
        it('should calculate a positive CB (surplus) when actual intensity is below target', () => {
            const actualIntensity = 80.0; // below 89.3368
            const fuelConsumption = 1000;
            const cb = ComputeCB(actualIntensity, fuelConsumption);
            
            const expectedCb = (TARGET_INTENSITY_2025 - actualIntensity) * (fuelConsumption * ENERGY_CONSTANT);
            expect(cb).toBe(expectedCb);
            expect(cb).toBeGreaterThan(0);
        });

        it('should calculate a negative CB (deficit) when actual intensity is above target', () => {
            const actualIntensity = 100.0; // above 89.3368
            const fuelConsumption = 1000;
            const cb = ComputeCB(actualIntensity, fuelConsumption);
            
            const expectedCb = (TARGET_INTENSITY_2025 - actualIntensity) * (fuelConsumption * ENERGY_CONSTANT);
            expect(cb).toBe(expectedCb);
            expect(cb).toBeLessThan(0);
        });

        it('should calculate zero CB when actual intensity equals target', () => {
            const actualIntensity = 89.3368;
            const fuelConsumption = 1000;
            const cb = ComputeCB(actualIntensity, fuelConsumption);
            
            expect(cb).toBe(0);
        });
    });
});
