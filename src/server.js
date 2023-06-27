"use strict";
const { buildApp } = require("./app");
const { stopPostgres } = require("./context/db");

function startServer(app, port) {
  const serverPort = port ?? process.env.PORT ?? 3000;
  app.context.rawLogger.info(`Server is running on port: ${serverPort}`);
  return app.listen(serverPort);
}

async function stopServer(app, server) {
  server.close();
  app.context.rawLogger.info("Server is stopping");
}

let globalApp;
let globalServer;

function startGlobalServer() {
  globalApp = buildApp();
  globalServer = startServer(globalApp);
}

async function stopGlobalServer() {
  await stopPostgres(globalApp);
  await stopServer(globalApp, globalServer);
}

process.on("SIGINT", stopGlobalServer);
process.on("SIGTERM", stopGlobalServer);

module.exports = { startServer, stopServer, startGlobalServer };
