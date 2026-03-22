import { IComplianceRepository } from '../ports/IComplianceRepository';
import { BankSurplus } from '../domain/PoolingBankingRules'; // Core domain rules from previous mission

export class BankSurplusUseCase {
    constructor(private complianceRepository: IComplianceRepository) {}

    async execute(shipId: string, year: number, amountToBank: number): Promise<void> {
        const currentCb = await this.complianceRepository.getComplianceBalance(shipId, year);
        if (currentCb === null) {
            throw new Error("Ship compliance balance not found for the given year.");
        }

        // Core domain rule validates if the entire balance >= 0 is bankable
        if (!BankSurplus(currentCb)) {
            throw new Error("Current CB is not a surplus (must be > 0).");
        }

        if (amountToBank <= 0) {
            throw new Error("Amount to bank must be positive.");
        }

        if (amountToBank > currentCb) {
            throw new Error("Cannot bank more than the current surplus.");
        }

        // Save positive amount to bank_entries to add funds to the bank
        await this.complianceRepository.saveBankEntry(shipId, year, amountToBank);
        
        // Deduct the banked amount from active CB
        const newCb = currentCb - amountToBank;
        await this.complianceRepository.saveComplianceBalance(shipId, year, newCb);
    }
}
