import { Request, Response } from "express";
import { CalculateCBUseCase } from "../../../../core/application/CalculateCBUseCase";
import { GetAdjustedCBUseCase } from "../../../../core/application/GetAdjustedCBUseCase";

export class NewComplianceController {
    constructor(
        private calculateCBUseCase: CalculateCBUseCase,
        private getAdjustedCBUseCase: GetAdjustedCBUseCase
    ) {}

    async getComplianceCb(req: Request, res: Response): Promise<void> {
        try {
            const actualIntensity = parseFloat(req.query.actual_intensity as string);
            const fuelConsumption = parseFloat(req.query.fuel_consumption as string);

            if (isNaN(actualIntensity) || isNaN(fuelConsumption)) {
                res.status(400).json({ error: "Missing or invalid actual_intensity / fuel_consumption query parameters" });
                return;
            }

            // Execute use case with passed query params, no save to DB so no shipId/year
            const cb = await this.calculateCBUseCase.execute(actualIntensity, fuelConsumption);
            res.status(200).json({ cb_gco2eq: cb });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAdjustedCb(req: Request, res: Response): Promise<void> {
        try {
            const { ship_id, year } = req.query;
            if (!ship_id || !year) {
                res.status(400).json({ error: "Missing ship_id or year query parameters" });
                return;
            }
            const cb = await this.getAdjustedCBUseCase.execute(ship_id as string, parseInt(year as string));
            res.status(200).json({ adjusted_cb: cb });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}
