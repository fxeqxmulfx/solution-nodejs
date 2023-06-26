const runTests = require("../../runTests");
const readFile = require("../../context/readFile");

const migration = readFile("./test/lesson/search/migration.sql");

const cases = [
  {
    description: "Temporary test",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { message: "ok" },
    status: 200,
    result: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
];

describe("Tests for module a lesson.search", () => {
  runTests(migration, cases);
});

module.exports = cases;
