"use strict";
const repository = require("./repository");
const parseFilter = require("./parseFilter");

async function search(ctx) {
  let filter;
  try {
    filter = parseFilter(ctx.request.body);
  } catch (err) {
    ctx.throw(400, err.message);
  }
  return await repository.search(ctx, filter);
}

module.exports = { search };
