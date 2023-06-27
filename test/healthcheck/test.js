"use strict";
const runTests = require("../runTests");

const cases = [
  {
    description: "Checking a healthcheck",
    path: "/healthcheck",
    method: "GET",
    status: 200,
    result: { health: true },
  },
];

describe("Tests for module a healthcheck", () => {
  runTests("", "", cases);
});
