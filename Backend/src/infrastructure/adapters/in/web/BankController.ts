import { Request, Response } from "express";
import { IBankUseCase } from "@application/ports/in/IBankUseCase";

export class BankController {
    constructor(private bankUseCase: IBankUseCase) { }

    async bankSurplus(req: Request, res: Response): Promise<void> {
        const { vesselName, amount } = req.body;
        try {
            const result = await this.bankUseCase.bankSurplus(vesselName as string, amount as number);
            res.status(200).json(result);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    async getBalance(req: Request, res: Response): Promise<void> {
        const { vesselName } = req.params;
        try {
            const balance = await this.bankUseCase.getBankBalance(vesselName as string);
            res.status(200).json({ vesselName, balance });
        } catch (error: any) { res.status(500).json({ error: error.message }); }
    }
}
