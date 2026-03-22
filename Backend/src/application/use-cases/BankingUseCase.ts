import { ComplianceService } from "@domain/services/ComplianceService";
import { IBankUseCase } from "../ports/in/IBankUseCase";

export interface IBankRepository {
    getBalance(vesselName: string): Promise<number>;
    updateBalance(vesselName: string, amount: number): Promise<void>;
    addEntry(vesselName: string, amount: number, type: "BANKED" | "APPLIED"): Promise<void>;
}

export class BankingUseCase implements IBankUseCase {
    constructor(private bankRepository: IBankRepository) { }

    async bankSurplus(vesselName: string, amount: number): Promise<any> {
        const current = await this.bankRepository.getBalance(vesselName);
        const updated = ComplianceService.bankSurplus(current, amount);
        await this.bankRepository.updateBalance(vesselName, updated);
        await this.bankRepository.addEntry(vesselName, amount, "BANKED");
        return { vesselName, newBalance: updated };
    }

    async applyBanked(vesselName: string, amount: number): Promise<any> {
        const current = await this.bankRepository.getBalance(vesselName);
        const { remainingBanked, remainingDeficit } = ComplianceService.applyBanked(current, amount);
        await this.bankRepository.updateBalance(vesselName, remainingBanked);
        await this.bankRepository.addEntry(vesselName, amount, "APPLIED");
        return { vesselName, remainingBanked, remainingDeficit };
    }

    async getBankBalance(vesselName: string): Promise<number> {
        return await this.bankRepository.getBalance(vesselName);
    }
}
