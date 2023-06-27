"use strict";
const Router = require("@koa/router");

const router = new Router();

router.post("/healthcheck", async (ctx) => {
  ctx.body = (await ctx.state.db.query("select true as health")).rows[0];
});

module.exports = router;
