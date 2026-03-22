import { IPoolUseCase } from "../ports/in/IPoolUseCase";

export interface IPoolRepository {
    save(pool: any): Promise<any>;
    findById(id: string): Promise<any>;
    findAll(): Promise<any[]>;
}

export class PoolingUseCase implements IPoolUseCase {
    constructor(private poolRepository: IPoolRepository) { }

    async createPool(name: string, vessels: string[]): Promise<any> {
        return await this.poolRepository.save({ name, vessels, totalBalance: 0 });
    }

    async getPool(id: string): Promise<any> {
        return await this.poolRepository.findById(id);
    }

    async getAllPools(): Promise<any[]> {
        return await this.poolRepository.findAll();
    }
}
