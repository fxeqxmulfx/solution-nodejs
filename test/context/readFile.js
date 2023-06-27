"use strict";
const fs = require("fs");

function readFile(path) {
  return fs.readFileSync(path).toString();
}

module.exports = readFile;
