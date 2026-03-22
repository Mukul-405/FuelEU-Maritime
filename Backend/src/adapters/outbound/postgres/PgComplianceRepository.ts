import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { dbPool } from '../../../infrastructure/adapters/out/db/DatabasePool';

export class PgComplianceRepository implements IComplianceRepository {
    async saveComplianceBalance(shipId: string, year: number, cb: number): Promise<void> {
        const updateQuery = `
            UPDATE ship_compliance 
            SET cb_gco2eq = $3 
            WHERE ship_id = $1 AND year = $2
        `;
        const insertQuery = `
            INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
            VALUES ($1, $2, $3)
        `;
        try {
            const result = await dbPool.query(updateQuery, [shipId, year, cb]);
            if (result.rowCount === 0) {
                await dbPool.query(insertQuery, [shipId, year, cb]);
            }
        } catch (error) {
            console.error('Error saving compliance balance to Postgres:', error);
            throw new Error('Failed to save compliance balance');
        }
    }

    async getComplianceBalance(shipId: string, year: number): Promise<number | null> {
        const query = `
            SELECT cb_gco2eq FROM ship_compliance WHERE ship_id = $1 AND year = $2
        `;
        try {
            const result = await dbPool.query(query, [shipId, year]);
            if (result.rows.length === 0) return null;
            return parseFloat(result.rows[0].cb_gco2eq);
        } catch (error) {
            console.error('Error fetching compliance balance from Postgres:', error);
            throw new Error('Failed to fetch compliance balance');
        }
    }

    async saveBankEntry(shipId: string, year: number, amount: number): Promise<void> {
        const query = `
            INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
            VALUES ($1, $2, $3)
        `;
        try {
            await dbPool.query(query, [shipId, year, amount]);
        } catch (error) {
            console.error('Error saving bank entry to Postgres:', error);
            throw new Error('Failed to save bank entry');
        }
    }

    async getBankBalance(shipId: string): Promise<number> {
        const query = `
            SELECT SUM(amount_gco2eq) as total_balance 
            FROM bank_entries 
            WHERE ship_id = $1
        `;
        try {
            const result = await dbPool.query(query, [shipId]);
            const balance = result.rows[0]?.total_balance;
            return balance ? parseFloat(balance) : 0;
        } catch (error) {
            console.error('Error fetching bank balance from Postgres:', error);
            throw new Error('Failed to fetch bank balance');
        }
    }

    async getBankRecords(shipId: string, year?: number): Promise<{ id: number; shipId: string; year: number; amount_gco2eq: number }[]> {
        try {
            let query = `SELECT id, ship_id as "shipId", year, amount_gco2eq FROM bank_entries WHERE ship_id = $1`;
            const params: any[] = [shipId];

            if (year !== undefined) {
                query += ` AND year = $2`;
                params.push(year);
            }

            query += ` ORDER BY year DESC, id DESC`;

            const result = await dbPool.query(query, params);
            return result.rows.map(row => ({
                id: row.id,
                shipId: row.shipId,
                year: row.year,
                amount_gco2eq: parseFloat(row.amount_gco2eq)
            }));
        } catch (error) {
            console.error('Error fetching bank records from Postgres:', error);
            throw new Error('Failed to fetch bank records');
        }
    }

    async savePool(year: number, members: { ship_id: string, cb_before: number, cb_after: number }[]): Promise<number> {
        const client = await dbPool.connect();
        try {
            await client.query('BEGIN');
            
            // 1. Insert into pools
            const poolResult = await client.query(
                `INSERT INTO pools (year) VALUES ($1) RETURNING id`,
                [year]
            );
            const poolId = poolResult.rows[0].id;

            // 2. Insert members and update active compliance balances
            for (const member of members) {
                await client.query(
                    `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)`,
                    [poolId, member.ship_id, member.cb_before, member.cb_after]
                );

                const updateCbQuery = `
                    UPDATE ship_compliance 
                    SET cb_gco2eq = $3 
                    WHERE ship_id = $1 AND year = $2
                `;
                const insertCbQuery = `
                    INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
                    VALUES ($1, $2, $3)
                `;
                const dbResult = await client.query(updateCbQuery, [member.ship_id, year, member.cb_after]);
                if (dbResult.rowCount === 0) {
                    await client.query(insertCbQuery, [member.ship_id, year, member.cb_after]);
                }
            }
            await client.query('COMMIT');
            return parseInt(poolId);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error saving pool transaction:', error);
            throw new Error('Failed to save pool due to transaction rollback: ' + (error as any).message);
        } finally {
            client.release();
        }
    }
}
