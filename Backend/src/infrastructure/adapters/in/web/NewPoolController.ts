import { Request, Response } from "express";
import { CreatePoolUseCase } from "../../../../core/application/CreatePoolUseCase";

export class NewPoolController {
    constructor(private createPoolUseCase: CreatePoolUseCase) {}

    async createPool(req: Request, res: Response): Promise<void> {
        try {
            const { year, members } = req.body;
            
            if (!year || !Array.isArray(members) || members.length === 0) {
                res.status(400).json({ error: "Missing year or members array." });
                return;
            }

            const poolResult = await this.createPoolUseCase.execute(parseInt(year), members);
            
            res.status(200).json(poolResult);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
