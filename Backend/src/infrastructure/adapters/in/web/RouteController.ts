import { Request, Response } from "express";
import { IRouteUseCase } from "../../../../../src/application/ports/in/IRouteUseCase";

export class RouteController {
    constructor(private routeUseCase: IRouteUseCase) { }

    async registerRoute(req: Request, res: Response): Promise<void> {
        try {
            const route = await this.routeUseCase.registerRoute(req.body as any);
            res.status(201).json(route);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllRoutes(req: Request, res: Response): Promise<void> {
        try {
            const routes = await this.routeUseCase.getAllRoutes();
            res.status(200).json(routes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async setBaseline(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            await this.routeUseCase.setBaseline(id);
            res.status(200).json({ message: "Baseline set successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
