const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    // SSL disabled for local dev/simpler connection
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const query = `
      ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
      ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check 
      CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_show'));
    `;

        await client.query(query);
        console.log("Successfully updated 'status' constraint to include 'no_show'.");

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
