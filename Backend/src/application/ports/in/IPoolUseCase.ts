export interface IPoolUseCase {
    createPool(name: string, vessels: string[]): Promise<any>;
    getPool(id: string): Promise<any>;
    getAllPools(): Promise<any[]>;
}
