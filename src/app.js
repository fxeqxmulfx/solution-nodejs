require("dotenv").config();
const Koa = require("koa");
const setupRouter = require("./context/router");
const lessonSearchRouter = require("./lesson/search/router");
const setupLogger = require("./context/log");
const setupBodyParser = require("./context/requestBody");
const { setupPostgres, testSetupPostgres } = require("./context/db");

function buildApp() {
  const app = new Koa();
  setupLogger(app);
  setupPostgres(app);
  setupBodyParser(app);
  setupRouter(app, lessonSearchRouter);
  return app;
}

function testBuildApp(dbClient) {
  const app = new Koa();
  setupLogger(app);
  testSetupPostgres(app, dbClient);
  setupBodyParser(app);
  setupRouter(app, lessonSearchRouter);
  return app;
}

module.exports = { buildApp, testBuildApp };
