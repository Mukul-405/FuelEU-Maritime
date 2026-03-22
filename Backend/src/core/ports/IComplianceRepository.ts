export interface IComplianceRepository {
    saveComplianceBalance(shipId: string, year: number, cb: number): Promise<void>;
    getComplianceBalance(shipId: string, year: number): Promise<number | null>;
    saveBankEntry(shipId: string, year: number, amount: number): Promise<void>;
    getBankBalance(shipId: string): Promise<number>;
    getBankRecords(shipId: string, year?: number): Promise<{ id: number; shipId: string; year: number; amount_gco2eq: number }[]>;
    savePool(year: number, members: { ship_id: string, cb_before: number, cb_after: number }[]): Promise<number>;
}
