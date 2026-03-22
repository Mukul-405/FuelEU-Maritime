export const TARGET_INTENSITY_2025 = 89.3368;
export const ENERGY_CONSTANT = 41000;

/**
 * Computes the Compliance Balance (CB) for a ship.
 * @param actualIntensity The actual GHG intensity of the ship (gCO2e/MJ)
 * @param fuelConsumption The fuel consumption of the ship (tonnes)
 * @returns The Compliance Balance (surplus if positive, deficit if negative)
 */
export function ComputeCB(actualIntensity: number, fuelConsumption: number): number {
    return (TARGET_INTENSITY_2025 - actualIntensity) * (fuelConsumption * ENERGY_CONSTANT);
}
