import { Request, Response } from "express";
import { IComplianceUseCase } from "../../../../../src/application/ports/in/IComplianceUseCase";

export class ComplianceController {
    constructor(private complianceUseCase: IComplianceUseCase) { }

    async getComplianceBalance(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.complianceUseCase.getComplianceBalance();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
