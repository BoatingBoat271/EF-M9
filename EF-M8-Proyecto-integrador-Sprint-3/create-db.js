require('dotenv').config();
const { Client } = require('pg');

async function createDatabaseIfNeeded() {
  const dbName = process.env.DB_NAME;

  if (!dbName) {
    throw new Error('Falta DB_NAME en .env');
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  await client.connect();

  const check = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );

  if (check.rowCount > 0) {
    console.log(`La base ${dbName} ya existe.`);
  } else {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base creada: ${dbName}`);
  }

  await client.end();
}

createDatabaseIfNeeded().catch((error) => {
  console.error('Error al crear/verificar la base:', error.message);
  process.exit(1);
});
