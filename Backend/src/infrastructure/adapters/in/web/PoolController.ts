import { Request, Response } from "express";
import { IPoolUseCase } from "@application/ports/in/IPoolUseCase";

export class PoolController {
    constructor(private poolUseCase: IPoolUseCase) { }

    async createPool(req: Request, res: Response): Promise<void> {
        const { name, vessels } = req.body;
        try {
            const pool = await this.poolUseCase.createPool(name as string, vessels as string[]);
            res.status(201).json(pool);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    async getAllPools(req: Request, res: Response): Promise<void> {
        try {
            const pools = await this.poolUseCase.getAllPools();
            res.status(200).json(pools);
        } catch (error: any) { res.status(500).json({ error: error.message }); }
    }
}
