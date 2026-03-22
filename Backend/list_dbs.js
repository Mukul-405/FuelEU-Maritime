const { Client } = require('pg');
const client = new Client({ user: 'postgres', password: '123456', host: 'localhost', port: 5432, database: 'postgres' });
async function check() {
    try {
        await client.connect();
        const res = await client.query('SELECT datname FROM pg_database;');
        console.log("Databases:", res.rows.map(r => r.datname));
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await client.end();
    }
}
check();
