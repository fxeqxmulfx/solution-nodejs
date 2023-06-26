const { bodyParser } = require("@koa/bodyparser");

function setupBodyParser(app) {
  app.use(bodyParser());
}

module.exports = setupBodyParser;
