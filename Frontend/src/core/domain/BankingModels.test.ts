import { describe, it, expect } from 'vitest';
import { canBankSurplus } from './BankingModels';

describe('Banking domain logic', () => {
  describe('canBankSurplus', () => {
    it('returns true when CB is positive', () => {
      expect(canBankSurplus(5000)).toBe(true);
    });

    it('returns false when CB is 0', () => {
      expect(canBankSurplus(0)).toBe(false);
    });

    it('returns false when CB is negative', () => {
      expect(canBankSurplus(-1000)).toBe(false);
    });
  });
});
