"use strict";
const s = require("superstruct");
const { PositiveNumber, ToDate } = require("../../utils/parser");

const DayOfWeek = () =>
  s.define("DayOfWeek", (value) => {
    if (typeof value !== "number") {
      return false;
    }
    return value >= 0 && value <= 6;
  });

const ParseBody = s.object({
  teacherIds: s.array(PositiveNumber()),
  title: s.string(),
  days: s.array(DayOfWeek()),
  firstDate: ToDate,
  lessonsCount: s.optional(PositiveNumber()),
  lastDate: s.optional(ToDate),
});

function parseBody(value) {
  const body = s.create(value, ParseBody);
  if (body.lessonsCount != null && body.lastDate != null) {
    throw new Error(
      "Conflict lessonsCount and lastDate. There can only be one"
    );
  }
  return body;
}

module.exports = parseBody;
