"use strict";
const Router = require("@koa/router");
const service = require("./service");

const router = new Router();

router.post("/", async (ctx) => {
  ctx.body = await service.search(ctx);
});

module.exports = router;
