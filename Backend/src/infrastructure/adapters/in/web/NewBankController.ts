import { Request, Response } from "express";
import { BankSurplusUseCase } from "../../../../core/application/BankSurplusUseCase";
import { ApplyBankedSurplusUseCase } from "../../../../core/application/ApplyBankedSurplusUseCase";
import { GetBankRecordsUseCase } from "../../../../core/application/GetBankRecordsUseCase";

export class NewBankController {
    constructor(
        private bankSurplusUseCase: BankSurplusUseCase,
        private applyBankedSurplusUseCase: ApplyBankedSurplusUseCase,
        private getBankRecordsUseCase: GetBankRecordsUseCase
    ) {}

    async bankSurplus(req: Request, res: Response): Promise<void> {
        try {
            const { ship_id, year, amount } = req.body;
            await this.bankSurplusUseCase.execute(ship_id, parseInt(year), parseFloat(amount));
            res.status(200).json({ message: "Surplus banked successfully." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async applyBankedSurplus(req: Request, res: Response): Promise<void> {
        try {
            const { ship_id, year, amount } = req.body;
            await this.applyBankedSurplusUseCase.execute(ship_id, parseInt(year), parseFloat(amount));
            res.status(200).json({ message: "Banked surplus applied successfully." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBankRecords(req: Request, res: Response): Promise<void> {
        try {
            const shipId = req.query.shipId as string;
            const yearStr = req.query.year as string | undefined;

            if (!shipId) {
                res.status(400).json({ error: "Missing shipId query parameter" });
                return;
            }

            const year = yearStr ? parseInt(yearStr) : undefined;
            const records = await this.getBankRecordsUseCase.execute(shipId, year);
            res.status(200).json(records);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
