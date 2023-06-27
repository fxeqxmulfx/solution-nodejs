"use strict";
const { PostgreSqlContainer } = require("testcontainers");
const { Pool } = require("pg");

async function startPostgres() {
  globalThis.postgres = await new PostgreSqlContainer("postgres:15.3").start();
  process.env.PGHOST = globalThis.postgres.getHost();
  process.env.PGPORT = globalThis.postgres.getPort().toString();
  process.env.PGDATABASE = globalThis.postgres.getDatabase();
  process.env.PGUSER = globalThis.postgres.getUsername();
  process.env.PGPASSWORD = globalThis.postgres.getPassword();
  globalThis.db = new Pool();
}

async function stopPostgres() {
  process.env.PGHOST = undefined;
  process.env.PGPORT = undefined;
  process.env.PGDATABASE = undefined;
  process.env.PGUSER = undefined;
  process.env.PGPASSWORD = undefined;
  await globalThis.db.end();
  await globalThis.postgres.stop();
}

async function setupMigration(dbClient, migration) {
  await dbClient.query(migration);
}

async function setupDbClient() {
  const dbClient = await globalThis.db.connect();
  dbClient.query("begin;");
  return dbClient;
}

async function releaseDbClient(dbClient) {
  await dbClient.query("rollback;");
  dbClient.release();
}

module.exports = {
  startPostgres,
  stopPostgres,
  setupMigration,
  setupDbClient,
  releaseDbClient,
};
