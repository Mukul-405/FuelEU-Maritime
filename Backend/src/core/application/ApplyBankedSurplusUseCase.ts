import { IComplianceRepository } from '../ports/IComplianceRepository';

export class ApplyBankedSurplusUseCase {
    constructor(private complianceRepository: IComplianceRepository) {}

    async execute(shipId: string, year: number, amountToApply: number): Promise<void> {
        if (amountToApply <= 0) {
            throw new Error("Amount to apply must be positive.");
        }

        // Get total available banked surplus
        const bankBalance = await this.complianceRepository.getBankBalance(shipId);

        if (bankBalance < amountToApply) {
            throw new Error("Insufficient banked surplus.");
        }

        // Save negative amount to bank_entries to withdraw funds
        await this.complianceRepository.saveBankEntry(shipId, year, -amountToApply);

        // Fetch current CB and add the applied amount to offset deficit
        // Null coalescing to 0 just to be safe if ship doesn't have an active compliance record yet
        const currentCb = await this.complianceRepository.getComplianceBalance(shipId, year) ?? 0;
        const newCb = currentCb + amountToApply;
        
        await this.complianceRepository.saveComplianceBalance(shipId, year, newCb);
    }
}
