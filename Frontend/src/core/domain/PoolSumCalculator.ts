import type { PoolMemberInput } from './PoolingModels';

export class PoolSumCalculator {
  /**
   * Calculates the total CB sum of all selected pool members.
   * Green (valid) if >= 0, Red (invalid) if < 0.
   */
  static calculateSum(members: PoolMemberInput[]): number {
    return members.reduce((sum, m) => sum + m.cb, 0);
  }

  static isPoolValid(members: PoolMemberInput[]): boolean {
    return PoolSumCalculator.calculateSum(members) >= 0;
  }
}
