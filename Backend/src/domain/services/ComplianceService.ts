export class ComplianceService {
    private static readonly TARGET_INTENSITY = 89.3368;
    private static readonly ENERGY_CONVERSION_FACTOR = 41000;

    static calculateBalance(actualIntensity: number, fuelConsumption: number): number {
        const energy = fuelConsumption * this.ENERGY_CONVERSION_FACTOR;
        const balance = (this.TARGET_INTENSITY - actualIntensity) * energy;
        return balance;
    }

    static bankSurplus(currentBanked: number, surplus: number): number {
        return currentBanked + surplus;
    }

    static applyBanked(currentBanked: number, deficit: number): { remainingBanked: number, remainingDeficit: number } {
        const absoluteDeficit = Math.abs(deficit);
        if (currentBanked >= absoluteDeficit) {
            return { remainingBanked: currentBanked - absoluteDeficit, remainingDeficit: 0 };
        } else {
            return { remainingBanked: 0, remainingDeficit: absoluteDeficit - currentBanked };
        }
    }

    static calculatePoolBalance(vesselBalances: number[]): number {
        return vesselBalances.reduce((acc, curr) => acc + curr, 0);
    }
}
