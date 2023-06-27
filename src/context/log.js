"use strict";
const logger = require("koa-pino-logger");

const rawLogger = require("pino");
const { getEnv } = require("../utils/env");

function setupLogger(app) {
  const level = getEnv("LOG_LEVEL", "info");
  app.context.rawLogger = rawLogger({ level });
  app.use(logger({ level }));
}

function setupTestLogger(app) {
  const level = getEnv("LOG_LEVEL_DEBUG", "silent");
  app.context.rawLogger = rawLogger({ level });
  app.use(logger({ level }));
}

module.exports = { setupLogger, setupTestLogger };
