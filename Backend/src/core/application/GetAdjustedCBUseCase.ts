import { IComplianceRepository } from '../ports/IComplianceRepository';

export class GetAdjustedCBUseCase {
    constructor(private complianceRepository: IComplianceRepository) {}

    async execute(shipId: string, year: number): Promise<number | null> {
        const adjustedCb = await this.complianceRepository.getComplianceBalance(shipId, year);
        if (adjustedCb === null) {
            throw new Error(`No compliance record found for ship ${shipId} in year ${year}`);
        }
        return adjustedCb;
    }
}
