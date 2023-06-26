const { Pool } = require("pg");

function setupPostgres(app) {
  app.context.dbPool = new Pool();
  setupDbMiddleware(app);
}

async function stopPostgres(app) {
  await app.context.dbPool.end();
}

function testSetupPostgres(app, dbClient) {
  app.context.dbClient = dbClient;
  testSetupDbMiddleware(app);
}

function setupDbMiddleware(app) {
  app.use(async (ctx, next) => {
    try {
      ctx.state.db = await ctx.dbPool.connect();
      await next();
    } finally {
      ctx.state.db.release();
    }
  });
}

function testSetupDbMiddleware(app) {
  app.use(async (ctx, next) => {
    ctx.state.db = ctx.dbClient;
    await next();
  });
}

module.exports = { testSetupPostgres, setupPostgres, stopPostgres };
