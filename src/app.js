"use strict";
require("dotenv").config();
const Koa = require("koa");
const setupRouter = require("./context/router");
const lessonSearchRouter = require("./lesson/search/router");
const lessonGeneratorRouter = require("./lesson/generator/router");
const healthCheckRouter = require("./healthcheck/router");
const { setupLogger, setupTestLogger } = require("./context/log");
const setupBodyParser = require("./context/requestBody");
const { setupPostgres, setupTestPostgres } = require("./context/db");
const setupErrorHandler = require("./middleware/errorHandler");

function buildApp() {
  const app = new Koa();
  setupLogger(app);
  setupErrorHandler(app);
  setupPostgres(app);
  setupBodyParser(app);
  setupRouter(app, healthCheckRouter);
  setupRouter(app, lessonSearchRouter);
  setupRouter(app, lessonGeneratorRouter);
  return app;
}

function testBuildApp(dbClient) {
  const app = new Koa();
  setupTestLogger(app);
  setupErrorHandler(app);
  setupTestPostgres(app, dbClient);
  setupBodyParser(app);
  setupRouter(app, healthCheckRouter);
  setupRouter(app, lessonSearchRouter);
  setupRouter(app, lessonGeneratorRouter);
  return app;
}

module.exports = { buildApp, testBuildApp };
