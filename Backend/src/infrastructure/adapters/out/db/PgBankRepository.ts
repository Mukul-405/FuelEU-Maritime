import { IBankRepository } from "../../../../../src/application/use-cases/BankingUseCase";
import { dbPool } from "./DatabasePool";

export class PgBankRepository implements IBankRepository {
    async getBalance(vesselName: string): Promise<number> {
        const query = `SELECT cb_gco2eq FROM ship_compliance WHERE ship_id = $1 ORDER BY year DESC LIMIT 1`;
        const res = await dbPool.query(query, [vesselName]);
        return res.rows.length ? Number(res.rows[0].cb_gco2eq) : 0;
    }

    async updateBalance(vesselName: string, amount: number): Promise<void> {
        const year = new Date().getFullYear();
        // Insert or update logic
        const query = `
            INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING; -- Assuming you'd have constraints, but let's do an update instead if it exists
        `;
        // Without ON CONFLICT on a unique constraint, let's just do a manual check or direct update.
        // Wait, pg manual tables might not have unique constraints. Let's do an update.
        const updateQ = `UPDATE ship_compliance SET cb_gco2eq = $1 WHERE ship_id = $2 AND year = $3 RETURNING *`;
        const res = await dbPool.query(updateQ, [amount, vesselName, year]);

        if (res.rows.length === 0) {
            await dbPool.query(
                `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES ($1, $2, $3)`,
                [vesselName, year, amount]
            );
        }
    }

    async addEntry(vesselName: string, amount: number, type: "BANKED" | "APPLIED"): Promise<void> {
        // PG schema does not have the 'type' column, only amount_gco2eq.
        // We will store amount. Applied might just be represented with a negative amount maybe? 
        // For now, we will just insert amount since DB schema has no 'type'.
        const val = type === "APPLIED" ? -amount : amount;
        const year = new Date().getFullYear();
        await dbPool.query(`INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3)`, [vesselName, year, val]);
    }
}
