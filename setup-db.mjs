import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

async function main() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  console.log('Connecting to PostgreSQL to run migration...');

  // Remove query string params like sslmode=require
  const cleanConnectionString = connectionString.split('?')[0];

  const client = new Client({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected. Creating table "aether_user_activities" if it does not exist...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS aether_user_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        week_start_date DATE NOT NULL,
        activity_log JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT unique_user_week UNIQUE (email, week_start_date)
      );
    `;
    
    await client.query(query);
    console.log('✅ Table "aether_user_activities" created successfully or already exists!');
    await client.end();
  } catch (err) {
    console.error('❌ Failed to create table:', err.message);
  }
}

main();
