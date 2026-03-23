import { IRouteRepository } from '../ports/IRouteRepository';

export class SetBaselineUseCase {
    constructor(private routeRepository: IRouteRepository) {}

    async execute(id: number): Promise<void> {
        await this.routeRepository.setBaseline(id);
    }
}
