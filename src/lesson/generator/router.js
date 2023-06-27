"use strict";
const Router = require("@koa/router");
const service = require("./service");

const router = new Router();

router.post("/lessons", async (ctx) => {
  ctx.body = await service.generateLessons(ctx);
});

module.exports = router;
