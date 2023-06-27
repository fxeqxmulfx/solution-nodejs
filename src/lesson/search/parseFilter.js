"use strict";
const s = require("superstruct");
const { ToDate, ToPositiveInt, PositiveNumber } = require("../../utils/parser");

const Dates = s.object({
  firstDate: ToDate,
  secondDate: s.optional(ToDate),
});

function splitAndTrim(value) {
  return value.split(",").map((val) => val.trim());
}

const ToDates = s.coerce(Dates, s.string(), (value) => {
  const [firstDate, secondDate] = splitAndTrim(value);
  return {
    firstDate,
    secondDate,
  };
});

const ZeroOrPositiveNumber = () =>
  s.define("ZeroOrPositiveNumber", (value) => {
    if (typeof value !== "number") {
      return false;
    }
    return value >= 0;
  });

const ToZeroOrPositiveInt = s.coerce(
  ZeroOrPositiveNumber(),
  s.string(),
  (value) => Number.parseInt(value)
);

const StudentCounts = s.object({
  firstStudentCount: ToZeroOrPositiveInt,
  secondStudentCount: s.optional(ToZeroOrPositiveInt),
});

const ToStudentCounts = s.coerce(StudentCounts, s.string(), (value) => {
  const [firstStudentCount, secondStudentCount] = splitAndTrim(value);
  return {
    firstStudentCount,
    secondStudentCount,
  };
});

const ZeroOrOne = () =>
  s.define("ZeroOrOne", (value) => {
    if (typeof value !== "number") {
      return false;
    }
    return value === 0 || value === 1;
  });

const ToTeacherIds = s.coerce(s.array(ToPositiveInt), s.string(), (value) =>
  splitAndTrim(value)
);

const ParseFilter = s.object({
  date: s.optional(ToDates),
  status: s.optional(ZeroOrOne()),
  teacherIds: s.optional(ToTeacherIds),
  studentsCount: s.optional(ToStudentCounts),
  page: s.defaulted(PositiveNumber(), 1),
  lessonsPerPage: s.defaulted(PositiveNumber(), 5),
});

function parseFilter(value) {
  return s.create(value, ParseFilter);
}

module.exports = parseFilter;
