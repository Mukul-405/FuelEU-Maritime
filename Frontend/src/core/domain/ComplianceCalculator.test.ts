import { describe, it, expect } from 'vitest';
import { ComplianceCalculator } from './ComplianceCalculator';

describe('ComplianceCalculator', () => {
  describe('percentDiff', () => {
    it('returns negative when actual is below target (compliant)', () => {
      const result = ComplianceCalculator.percentDiff(85, 89.3368);
      expect(result).toBeLessThan(0);
      expect(result).toBe(-4.85);
    });

    it('returns positive when actual is above target (non-compliant)', () => {
      const result = ComplianceCalculator.percentDiff(95, 89.3368);
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(6.34);
    });

    it('returns 0 when actual equals target', () => {
      expect(ComplianceCalculator.percentDiff(89.3368, 89.3368)).toBe(0);
    });

    it('returns 0 when target is 0 (avoids division by zero)', () => {
      expect(ComplianceCalculator.percentDiff(100, 0)).toBe(0);
    });
  });

  describe('isCompliant', () => {
    it('returns true when variance is zero', () => {
      expect(ComplianceCalculator.isCompliant(0)).toBe(true);
    });

    it('returns true when variance is negative', () => {
      expect(ComplianceCalculator.isCompliant(-5)).toBe(true);
    });

    it('returns false when variance is positive', () => {
      expect(ComplianceCalculator.isCompliant(3.5)).toBe(false);
    });
  });
});
