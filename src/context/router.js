"use strict";

function setupRouter(app, router) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = setupRouter;
