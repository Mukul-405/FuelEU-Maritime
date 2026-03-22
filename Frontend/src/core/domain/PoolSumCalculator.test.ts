import { describe, it, expect } from 'vitest';
import { PoolSumCalculator } from './PoolSumCalculator';

describe('PoolSumCalculator', () => {
  describe('calculateSum', () => {
    it('returns 0 for empty members', () => {
      expect(PoolSumCalculator.calculateSum([])).toBe(0);
    });

    it('sums all member CBs correctly', () => {
      const members = [
        { shipId: 'A', cb: 5000 },
        { shipId: 'B', cb: -3000 },
        { shipId: 'C', cb: 1000 },
      ];
      expect(PoolSumCalculator.calculateSum(members)).toBe(3000);
    });

    it('returns negative sum for deficit-heavy pool', () => {
      const members = [
        { shipId: 'A', cb: 1000 },
        { shipId: 'B', cb: -5000 },
      ];
      expect(PoolSumCalculator.calculateSum(members)).toBe(-4000);
    });
  });

  describe('isPoolValid', () => {
    it('returns true when sum is positive', () => {
      expect(PoolSumCalculator.isPoolValid([{ shipId: 'A', cb: 100 }])).toBe(true);
    });

    it('returns true when sum is exactly 0', () => {
      expect(PoolSumCalculator.isPoolValid([
        { shipId: 'A', cb: 500 },
        { shipId: 'B', cb: -500 },
      ])).toBe(true);
    });

    it('returns false when sum is negative', () => {
      expect(PoolSumCalculator.isPoolValid([
        { shipId: 'A', cb: 100 },
        { shipId: 'B', cb: -500 },
      ])).toBe(false);
    });

    it('returns true for empty members (sum=0)', () => {
      expect(PoolSumCalculator.isPoolValid([])).toBe(true);
    });
  });
});
