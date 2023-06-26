const { startPostgres, stopPostgres } = require("./db");

exports.mochaGlobalSetup = async function () {
  await startPostgres();
};

exports.mochaGlobalTeardown = async function () {
  await stopPostgres();
};
