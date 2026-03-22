export interface IBankUseCase {
    bankSurplus(vesselName: string, amount: number): Promise<any>;
    applyBanked(vesselName: string, amount: number): Promise<any>;
    getBankBalance(vesselName: string): Promise<number>;
}
