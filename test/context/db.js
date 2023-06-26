const { PostgreSqlContainer } = require("testcontainers");
const { Pool } = require("pg");

let postgres;
let db;

async function startPostgres() {
  postgres = await new PostgreSqlContainer("postgres:15.3").start();
  process.env.PGHOST = postgres.getHost();
  process.env.PGPORT = postgres.getPort().toString();
  process.env.PGDATABASE = postgres.getDatabase();
  process.env.PGUSER = postgres.getUsername();
  process.env.PGPASSWORD = postgres.getPassword();
  db = new Pool();
}

async function stopPostgres() {
  process.env.PGHOST = undefined;
  process.env.PGPORT = undefined;
  process.env.PGDATABASE = undefined;
  process.env.PGUSER = undefined;
  process.env.PGPASSWORD = undefined;
  await db.end();
  await postgres.stop();
}

async function setupMigration(dbClient, migration) {
  await dbClient.query(migration);
}

async function setupDbClient() {
  const dbClient = await db.connect();
  dbClient.query("BEGIN");
  return dbClient;
}

async function releaseClientDb(dbClient) {
  await dbClient.query("ROLLBACK");
  dbClient.release();
}

module.exports = {
  startPostgres,
  stopPostgres,
  setupMigration,
  setupDbClient,
  releaseDbClient: releaseClientDb,
};
