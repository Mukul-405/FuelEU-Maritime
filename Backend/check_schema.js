const { Client } = require('pg');
const fs = require('fs');
const client = new Client({ user: 'postgres', password: '123456', host: 'localhost', port: 5432, database: 'postgres' });

async function check() {
    const result = {};
    try {
        await client.connect();
        const tables = ['routes', 'ship_compliance', 'bank_entries', 'pools', 'pool_members'];
        for (const table of tables) {
            const res = await client.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1;', [table]);
            result[table] = res.rows;
        }
        fs.writeFileSync('schema_dump.json', JSON.stringify(result, null, 2));
        console.log("Dumped to schema_dump.json");
    } catch (err) {
        console.error('DB_ERROR:', err.message);
    } finally {
        await client.end();
    }
}
check();
