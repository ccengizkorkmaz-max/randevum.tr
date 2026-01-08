const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function applyMigration() {
    // Try to get DATABASE_URL, or construct from Supabase env vars if possible (unlikely for direct connection string)
    // Usually Next.js apps with Supabase have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    // But for DB access we specifically need DATABASE_URL (postgres://...)
    // If it's not in .env.local, we can't do this.

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, '..', 'supabase', 'add_reminder_columns.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration...');
        const result = await client.query(sql);
        console.log('Migration applied successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyMigration();
