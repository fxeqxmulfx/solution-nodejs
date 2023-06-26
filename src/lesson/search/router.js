const Router = require("@koa/router");

const router = new Router();

router.post("/", async (ctx) => {
  ctx.body = (await ctx.state.db.query("select * from a")).rows;
});

module.exports = router;
