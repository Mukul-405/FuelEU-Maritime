import { ComplianceService } from '../../../src/domain/services/ComplianceService';

describe('Compliance Math / Logic', () => {
    it('calculates the valid balance correctly', () => {
        // Target - Actual * Fuel Consumption * 41,000
        // Target = 89.3368, Actual = 92.5, Fuel = 100
        // (89.3368 - 92.5) * 100 * 41000 = -3.1632 * 4100000 = -12969120
        const balance = ComplianceService.calculateBalance(92.5, 100);
        expect(balance).toBeCloseTo(-12969120);
    });

    it('banks surplus accurately', () => {
        expect(ComplianceService.bankSurplus(1000, 500)).toBe(1500);
    });

    it('applies banked amounts correctly when deficit > banked', () => {
        const result = ComplianceService.applyBanked(1000, -1500);
        expect(result.remainingBanked).toBe(0);
        expect(result.remainingDeficit).toBe(500);
    });

    it('applies banked amounts correctly when banked > deficit', () => {
        const result = ComplianceService.applyBanked(2000, -1500);
        expect(result.remainingBanked).toBe(500);
        expect(result.remainingDeficit).toBe(0);
    });
});
