import { CreatePool, ShipPoolMember } from '../../../src/core/domain/PoolingBankingRules';

describe('PoolingBankingRules Unit Tests', () => {
    it('should correctly execute greedy allocation with 3 ships matching compliance requirements', () => {
        const ships: ShipPoolMember[] = [
            { id: 'SHIP_A', cb: -1000 },
            { id: 'SHIP_B', cb: 600 },
            { id: 'SHIP_C', cb: 500 }
        ];
        
        const result = CreatePool(ships);
        
        expect(result.valid).toBe(true);

        // Sorting is Descending: B (600), C (500), A (-1000)
        // B (600) satisfies 600 of A's deficit. B is now 0. A is now -400.
        // C (500) satisfies the remaining 400 of A's deficit. C is now 100. A is now 0.
        expect(result.pool.find(s => s.id === 'SHIP_B')?.cb).toBe(0);
        expect(result.pool.find(s => s.id === 'SHIP_A')?.cb).toBe(0);
        expect(result.pool.find(s => s.id === 'SHIP_C')?.cb).toBe(100);
    });

    it('should invalidate an allocation if total CB sum is strictly negative', () => {
        const ships: ShipPoolMember[] = [
            { id: 'SHIP_D', cb: -500 },
            { id: 'SHIP_E', cb: 100 }
        ];

        const result = CreatePool(ships);

        expect(result.valid).toBe(false);
    });
});
