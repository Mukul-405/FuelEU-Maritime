import { Request, Response } from "express";
import { GetRoutesUseCase } from "../../../../core/application/GetRoutesUseCase";
import { GetRouteComparisonUseCase } from "../../../../core/application/GetRouteComparisonUseCase";
import { SetBaselineUseCase } from "../../../../core/application/SetBaselineUseCase";

export class NewRouteController {
    constructor(
        private getRoutesUseCase: GetRoutesUseCase,
        private getRouteComparisonUseCase: GetRouteComparisonUseCase,
        private setBaselineUseCase?: SetBaselineUseCase
    ) {}

    async getRoutes(req: Request, res: Response): Promise<void> {
        try {
            const routes = await this.getRoutesUseCase.execute();
            res.status(200).json(routes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getComparison(req: Request, res: Response): Promise<void> {
        try {
            const comparison = await this.getRouteComparisonUseCase.execute();
            res.status(200).json(comparison);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async setBaseline(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid route ID" });
                return;
            }
            if (!this.setBaselineUseCase) {
                res.status(500).json({ error: "SetBaseline use case not configured" });
                return;
            }
            await this.setBaselineUseCase.execute(id);
            res.status(200).json({ message: "Baseline set successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
