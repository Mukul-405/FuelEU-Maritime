import { IComplianceRepository } from '../ports/IComplianceRepository';

export class GetBankRecordsUseCase {
    constructor(private complianceRepository: IComplianceRepository) {}

    async execute(shipId: string, year?: number): Promise<any[]> {
        if (!shipId) {
            throw new Error("Ship ID is required to fetch bank records.");
        }
        return await this.complianceRepository.getBankRecords(shipId, year);
    }
}
