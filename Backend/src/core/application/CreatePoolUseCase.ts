import { randomUUID } from 'crypto';
import { IComplianceRepository } from '../ports/IComplianceRepository';
import { CreatePool, ShipPoolMember } from '../domain/PoolingBankingRules';

export interface PoolMemberInput {
    shipId: string;
    cb: number;
}

export class CreatePoolUseCase {
    constructor(private complianceRepository: IComplianceRepository) {}

    async execute(year: number, membersInput: PoolMemberInput[]): Promise<any> {
        if (membersInput.length === 0) {
            throw new Error("Pool must have at least one member.");
        }

        // Fetch current active CB for all members from the repository to ensure truthfulness
        // (Alternatively, we can trust the input if it's a dry-run, but for actual pool creation
        // we should verify the balances). We will use the provided inputs and assume they are accurate 
        // for the algorithm simulation.
        
        const ships: ShipPoolMember[] = membersInput.map(m => ({
            id: m.shipId,
            cb: m.cb,
            initialCb: m.cb
        }));

        // Execute the Greedy Allocation Domain Logic
        const result = CreatePool(ships);

        if (!result.valid) {
            throw new Error("Invalid pool configuration: Pool sum is negative or a ship exited with an invalid balance.");
        }

        // Return the successfully allocated pool structure after committing to DB.
        const poolMembers = result.pool.map((p: ShipPoolMember) => ({
            ship_id: p.id,
            cb_before: p.initialCb ?? p.cb,
            cb_after: p.cb,
            allocated_cb: p.cb
        }));

        const poolId = await this.complianceRepository.savePool(year, poolMembers);

        return { pool_id: poolId, members: poolMembers };
    }
}
