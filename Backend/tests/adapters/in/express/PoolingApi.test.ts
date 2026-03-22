import request from 'supertest';
import app from '../../../../src/infrastructure/config/ExpressApp';
import { dbPool } from '../../../../src/infrastructure/adapters/out/db/DatabasePool';

describe('Pooling API Integration Tests', () => {
    afterAll(async () => {
        await dbPool.end();
    });

    it('POST /pools should handle a valid pool creation correctly', async () => {
        const payload = {
            year: 2025,
            members: [
                { shipId: 'SHIP_P1', cb: 500 },
                { shipId: 'SHIP_P2', cb: -300 }
            ]
        };

        const response = await request(app)
            .post('/pools')
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.pool_id).toBeDefined();
        
        // Members returned
        const members = response.body.members;
        expect(members).toHaveLength(2);

        // SHIP_P1 transferred 300 to SHIP_P2. P1 becomes 200, P2 becomes 0.
        const p1 = members.find((m: any) => m.ship_id === 'SHIP_P1');
        const p2 = members.find((m: any) => m.ship_id === 'SHIP_P2');

        expect(p1.allocated_cb).toBe(200);
        expect(p2.allocated_cb).toBe(0);
    });

    it('POST /pools should return 400 error if pool configuration is invalid (sum < 0)', async () => {
        const payload = {
            year: 2025,
            members: [
                { shipId: 'SHIP_P3', cb: -1000 },
                { shipId: 'SHIP_P4', cb: 200 }
            ]
        };

        const response = await request(app)
            .post('/pools')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Invalid pool configuration/i);
    });
});
