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
            const shipId = req.query.ship_id as string | undefined;
            const yearStr = req.query.year as string | undefined;
            const actualIntensityStr = req.query.actual_intensity as string | undefined;
            const fuelConsumptionStr = req.query.fuel_consumption as string | undefined;

            // Route 1: ship_id + year — compute from route data and store snapshot
            if (shipId && yearStr) {
                const year = parseInt(yearStr);
                const actualIntensity = actualIntensityStr ? parseFloat(actualIntensityStr) : undefined;
                const fuelConsumption = fuelConsumptionStr ? parseFloat(fuelConsumptionStr) : undefined;

                if (actualIntensity !== undefined && fuelConsumption !== undefined) {
                    const cb = await this.calculateCBUseCase.execute(actualIntensity, fuelConsumption, shipId, year);
                    res.status(200).json({ cb_gco2eq: cb });
                } else {
                    // If no intensity/fuel provided, just use placeholder values
                    res.status(400).json({ error: "Missing actual_intensity and fuel_consumption for CB computation. Provide ship_id, year, actual_intensity, and fuel_consumption." });
                }
                return;
            }

            // Route 2: actual_intensity + fuel_consumption only — pure calculation, no storage
            const actualIntensity = parseFloat(actualIntensityStr || '');
            const fuelConsumption = parseFloat(fuelConsumptionStr || '');

            if (isNaN(actualIntensity) || isNaN(fuelConsumption)) {
                res.status(400).json({ error: "Missing or invalid query parameters. Provide (ship_id & year & actual_intensity & fuel_consumption) or (actual_intensity & fuel_consumption)." });
                return;
            }

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
