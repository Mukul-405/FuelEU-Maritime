import { PrismaClient } from "@prisma/client";
import { IRouteRepository } from "@application/ports/out/IRouteRepository";
import { Route } from "@domain/entities/Route";

export class PrismaRouteRepository implements IRouteRepository {
    private prisma: PrismaClient;
    constructor() { this.prisma = new PrismaClient(); }

    async save(route: Route): Promise<Route> {
        const saved = await this.prisma.route.create({
            data: {
                vesselName: route.vesselName,
                departurePort: route.departurePort,
                arrivalPort: route.arrivalPort,
                fuelConsumption: route.fuelConsumption,
                actualIntensity: route.actualIntensity,
                complianceBalance: route.complianceBalance,
            },
        });
        return new Route({ ...saved });
    }

    async findAll(): Promise<Route[]> {
        const routes = await this.prisma.route.findMany({ orderBy: { createdAt: 'desc' } });
        return routes.map((r: any) => new Route({ ...r }));
    }
}
