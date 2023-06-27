"use strict";
const { Pool } = require("pg");
const _ = require("lodash");
const randomIntFromInterval = require("../utils/randomIntFromInterval");
const { getEnv, getEnvInt } = require("../utils/env");
const named = require("yesql").pg;

function setupPostgres(app) {
  app.context.dbPool = new Pool({
    host: getEnv("PGHOST", "localhost"),
    port: getEnvInt("PGPORT", 5432),
    database: getEnv("PGDATABASE", "postgres"),
    user: getEnv("PGUSER", "postgres"),
    password: getEnv("PGPASSWORD", "postgres"),
  });
  setupDbMiddleware(app);
}

async function stopPostgres(app) {
  await app.context.dbPool.end();
}

function setupTestPostgres(app, dbClient) {
  app.context.dbClient = dbClient;
  setupTestDbMiddleware(app);
}

function setupDbMiddleware(app) {
  app.use(async (ctx, next) => {
    try {
      ctx.state.db = await ctx.dbPool.connect();
      await ctx.state.db.query("begin;");
      await next();
      await ctx.state.db.query("commit;");
    } catch (err) {
      await ctx.state.db.query("rollback;");
      throw err;
    } finally {
      ctx.state.db.release();
    }
  });
}

function setupTestDbMiddleware(app) {
  app.use(async (ctx, next) => {
    ctx.state.db = ctx.dbClient;
    await next();
  });
}

function flattenObject(object) {
  function recur(object, parent = undefined, res = {}) {
    Object.keys(object).forEach((key) => {
      const propName = parent ? parent + "_" + key : key;
      if (
        typeof object[key] === "object" &&
        !(object[key] instanceof Array) &&
        !(object[key] instanceof Date)
      ) {
        recur(object[key], propName, res);
      } else {
        res[propName] = object[key];
      }
    });
    return res;
  }

  return recur(object);
}

function toCamelCase(value) {
  return _.mapKeys(value, (val, key) => _.camelCase(key));
}

async function namedQuery(dbClient, sql, params) {
  return (await dbClient.query(named(sql)(flattenObject(params)))).rows.map(
    (value) => toCamelCase(value)
  );
}

async function transaction(ctx, fun) {
  const db = ctx.state.db;
  const savepoint = randomIntFromInterval(1, 100_000);
  try {
    await db.query(`savepoint sp${savepoint};`);
    const result = await fun();
    await db.query(`release savepoint sp${savepoint};`);
    return result;
  } catch (err) {
    await db.query(`rollback to savepoint sp${savepoint};`);
    await db.query(`release savepoint sp${savepoint};`);
    throw err;
  }
}

module.exports = {
  setupTestPostgres,
  setupPostgres,
  stopPostgres,
  namedQuery,
  transaction,
};
