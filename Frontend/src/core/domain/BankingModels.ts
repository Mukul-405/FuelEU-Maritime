export interface BankRecord {
  id: number;
  shipId: string;
  year: number;
  amount_gco2eq: number;
}

export interface ComplianceBalanceResult {
  cb_gco2eq: number;
}

export interface AdjustedCbResult {
  adjusted_cb: number;
}

/**
 * Determines whether the Bank/Apply buttons should be enabled.
 * Bank requires CB > 0 (surplus). Apply requires banked surplus available.
 */
export function canBankSurplus(cb: number): boolean {
  return cb > 0;
}
