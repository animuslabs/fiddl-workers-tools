import { Client } from 'pg';
import config from "../config.json"

async function clearWaitingPromptsTable(): Promise<void> {
  const client = new Client({
    user: config['server-db'].user,
    host: config['server-db'].host,
    database: config['server-db']['db-name'],
    password: config['server-db'].pass,
    port: config['server-db'].port,
  });

  try {
    // Connect to the PostgreSQL database
    await client.connect();

    // Execute the query to delete all records from the table, including cascading the truncation to dependent tables
    const queryText = 'TRUNCATE TABLE public.waiting_prompts CASCADE;';
    await client.query(queryText);

    console.log('All records from the waiting_prompts table and dependent tables have been deleted.');
  } catch (err) {
    console.error('Error clearing the waiting_prompts table:', err);
  } finally {
    // Close the database connection
    await client.end();
  }
}

clearWaitingPromptsTable();
