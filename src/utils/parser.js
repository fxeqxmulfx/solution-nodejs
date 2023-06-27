"use strict";
const dayjs = require("dayjs");
const s = require("superstruct");

const ToDate = s.coerce(s.date(), s.string(), (value) => dayjs(value).toDate());

const PositiveNumber = () =>
  s.define("PositiveNumber", (value) => {
    if (typeof value !== "number") {
      return false;
    }
    return value >= 1;
  });

const ToPositiveInt = s.coerce(PositiveNumber(), s.string(), (value) =>
  Number.parseInt(value)
);

module.exports = { ToDate, PositiveNumber, ToPositiveInt };
