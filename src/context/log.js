const logger = require("koa-pino-logger");

const rawLogger = require("pino");

function setupLogger(app) {
  const level = process.env.LOG_LEVEL ?? "info";
  app.context.rawLogger = rawLogger({ level });
  app.use(logger({ level }));
}

module.exports = setupLogger;
