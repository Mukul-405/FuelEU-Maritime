import request from 'supertest';
import app from '../../../../src/infrastructure/config/ExpressApp';
import { dbPool } from '../../../../src/infrastructure/adapters/out/db/DatabasePool';

describe('Banking and Adjusted CB API Integration Tests', () => {
    // Teardown the DB connection pool after tests run natively
    afterAll(async () => {
        await dbPool.end();
    });

    const mockShipId = "TEST_SHIP_123";
    const year = 2025;
    const initialCb = 500; // a positive surplus

    beforeAll(async () => {
        // Setup initial db state: A ship with 500 surplus
        await dbPool.query(`DELETE FROM bank_entries WHERE ship_id = $1`, [mockShipId]);
        await dbPool.query(`DELETE FROM ship_compliance WHERE ship_id = $1`, [mockShipId]);
        
        await dbPool.query(
            `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES ($1, $2, $3)`,
            [mockShipId, year, initialCb]
        );
    });

    it('POST /banking/bank should bank surplus successfully', async () => {
        const amountToBank = 100;
        const response = await request(app)
            .post('/banking/bank')
            .send({ ship_id: mockShipId, year, amount: amountToBank });

        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/banked successfully/i);

        // Verify that adjusted CB is now 400 (500 - 100)
        let cbResponse = await request(app).get(`/compliance/adjusted-cb?ship_id=${mockShipId}&year=${year}`);
        expect(cbResponse.body.adjusted_cb).toBe(400);
    });

    it('POST /banking/apply should apply banked surplus to improve deficit/balance', async () => {
        const amountToApply = 50;
        const response = await request(app)
            .post('/banking/apply')
            .send({ ship_id: mockShipId, year, amount: amountToApply });

        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/applied successfully/i);

        // Verify that adjusted CB is now 450 (400 + 50)
        let cbResponse = await request(app).get(`/compliance/adjusted-cb?ship_id=${mockShipId}&year=${year}`);
        expect(cbResponse.body.adjusted_cb).toBe(450);
    });

    it('POST /banking/apply should fail if insufficient funds are available in the bank', async () => {
        // We banked 100, applied 50, so we have 50 banked left.
        // Trying to apply 100 should fail.
        const response = await request(app)
            .post('/banking/apply')
            .send({ ship_id: mockShipId, year, amount: 100 });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/insufficient/i);
    });
});
