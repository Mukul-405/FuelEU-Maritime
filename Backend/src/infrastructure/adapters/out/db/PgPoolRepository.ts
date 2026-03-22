import { IPoolRepository } from "../../../../../src/application/use-cases/PoolingUseCase";
import { dbPool } from "./DatabasePool";

export class PgPoolRepository implements IPoolRepository {
    async save(pool: any): Promise<any> {
        const year = new Date().getFullYear();
        const res = await dbPool.query(`INSERT INTO pools (year) VALUES ($1) RETURNING *`, [year]);
        const poolId = res.rows[0].id;

        for (const shipId of (pool.vessels || [])) {
            await dbPool.query(
                `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, 0, 0)`,
                [poolId, shipId]
            );
        }
        return { id: poolId, year, vessels: pool.vessels };
    }

    async findById(id: string): Promise<any> {
        const res = await dbPool.query(`SELECT * FROM pools WHERE id = $1`, [parseInt(id)]);
        if (!res.rows.length) return null;

        const members = await dbPool.query(`SELECT ship_id FROM pool_members WHERE pool_id = $1`, [parseInt(id)]);
        return {
            ...res.rows[0],
            vessels: members.rows.map(m => m.ship_id)
        };
    }

    async findAll(): Promise<any[]> {
        const res = await dbPool.query(`SELECT * FROM pools`);
        const result = [];
        for (const row of res.rows) {
            const members = await dbPool.query(`SELECT ship_id FROM pool_members WHERE pool_id = $1`, [row.id]);
            result.push({
                ...row,
                vessels: members.rows.map(m => m.ship_id)
            });
        }
        return result;
    }
}
