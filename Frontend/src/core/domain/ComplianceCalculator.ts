export const TARGET_INTENSITY = 89.3368;

export class ComplianceCalculator {
  /**
   * Calculates the percentage difference between actual and target GHG intensity.
   * Positive = above target (non-compliant), Negative = below target (compliant).
   */
  static percentDiff(actual: number, target: number): number {
    if (target === 0) return 0;
    const diff = ((actual - target) / target) * 100;
    return Math.round(diff * 100) / 100;
  }

  static isCompliant(variancePercentage: number): boolean {
    return variancePercentage <= 0;
  }
}
