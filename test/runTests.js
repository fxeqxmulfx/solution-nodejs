const chai = require("chai");
const chaiHttp = require("chai-http");
const {
  setupMigration,
  setupDbClient,
  releaseDbClient,
} = require("./context/db");
const { startServer, stopServer } = require("../src/server");
const { testBuildApp } = require("../src/app");

chai.use(chaiHttp);

function selectMethod(server, item) {
  const request = chai.request(server);
  if (item.method === "GET") {
    return request.get(item.path);
  }
  if (item.method === "POST") {
    return request.post(item.path);
  }
  if (item.method === "PUT") {
    return request.put(item.path);
  }
  if (item.method === "DELETE") {
    return request.delete(item.path);
  }
  throw new Error("Unsupported http method in test");
}

function setHeader(request, headers) {
  Object.entries(headers).forEach(([key, value]) => {
    request.set(key, value);
  });
}

function setBody(request, body) {
  request.send(body);
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function runTests(migration, cases) {
  describe("", () => {
    let dbClient;
    let testServer;
    let testApp;
    before(async () => {
      dbClient = await setupDbClient();
      testApp = testBuildApp(dbClient);
      testServer = startServer(testApp, randomIntFromInterval(1025, 65535));
      await setupMigration(dbClient, migration);
    });
    after(async () => {
      await stopServer(testApp, testServer);
      await releaseDbClient(dbClient);
    });
    cases.forEach((item) => {
      describe(`${item.method} ${item.path}`, () => {
        it(item.description, (done) => {
          try {
            const request = selectMethod(testServer, item);
            setHeader(request, item.headers);
            setBody(request, item.body);
            request.end((err, res) => {
              if (err != null) {
                done(err);
                return;
              }
              chai.expect(res.status).to.equal(item.status);
              chai.expect(res.body).to.deep.equal(item.result);
              done();
            });
          } catch (err) {
            done(err);
          }
        });
      });
    });
  });
}

module.exports = runTests;
