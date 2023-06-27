"use strict";
function setupErrorHandler(app) {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.log.error(err.message);
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        error: err.message,
      };
    }
  });
}

module.exports = setupErrorHandler;
