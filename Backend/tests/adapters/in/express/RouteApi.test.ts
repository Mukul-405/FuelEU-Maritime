import request from 'supertest';
import app from '../../../../src/infrastructure/config/ExpressApp'; // The Express app export
import { dbPool } from '../../../../src/infrastructure/adapters/out/db/DatabasePool';

describe('Route API Integration Test', () => {
    afterAll(async () => {
        await dbPool.end();
    });

    it('GET /routes should return the 5 seeded routes from Postgres', async () => {
        const response = await request(app).get('/routes');
        
        // Ensure successful request
        expect(response.status).toBe(200);

        // Parse response body and ensure it is an array
        const routes = response.body;
        expect(Array.isArray(routes)).toBe(true);
        
        // Assert exactly 5 seeded routes are returned
        expect(routes.length).toBe(5);

        // Verify the properties match our entity interface
        const firstRoute = routes[0];
        expect(firstRoute).toHaveProperty('id');
        expect(firstRoute).toHaveProperty('route_id');
        expect(firstRoute).toHaveProperty('vessel_type');
        expect(firstRoute).toHaveProperty('fuel_type');
        expect(firstRoute).toHaveProperty('year');
        expect(firstRoute).toHaveProperty('ghg_intensity');
        expect(firstRoute).toHaveProperty('fuel_consumption');
        expect(firstRoute).toHaveProperty('distance');
        expect(firstRoute).toHaveProperty('total_emissions');
        expect(firstRoute).toHaveProperty('is_baseline');
    });
});
