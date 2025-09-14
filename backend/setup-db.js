require('dotenv').config();
const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    user: 'postgres', // Change this to your PostgreSQL username
    host: 'localhost',
    database: 'postgres', // Connect to default database first
    password: 'password', // Change this to your PostgreSQL password
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Create database if it doesn't exist
    const dbName = 'store_rating_platform';
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
    const result = await client.query(checkDbQuery);

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }

  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
