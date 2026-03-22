import { Request, Response } from "express";
import { GetRoutesUseCase } from "../../../../core/application/GetRoutesUseCase";
import { GetRouteComparisonUseCase } from "../../../../core/application/GetRouteComparisonUseCase";

export class NewRouteController {
    constructor(
        private getRoutesUseCase: GetRoutesUseCase,
        private getRouteComparisonUseCase: GetRouteComparisonUseCase
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
}
