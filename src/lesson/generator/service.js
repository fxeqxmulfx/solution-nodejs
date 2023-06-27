"use strict";
const parseBody = require("./parseBody");
const dayjs = require("dayjs");
const { transaction } = require("../../context/db");
const { insertLessons, insertLessonTeachers } = require("./repository");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

function parse(ctx) {
  try {
    return parseBody(ctx.request.body);
  } catch (err) {
    ctx.throw(400, err.message);
  }
}

function generateDatesByParams(firstDate, lastDate, limit, days) {
  let tempDate = firstDate;
  const dates = [];
  while (dayjs(tempDate).isSameOrBefore(dayjs(lastDate))) {
    if (days.includes(dayjs(tempDate).day())) {
      dates.push(tempDate);
    }
    if (dates.length === limit) {
      break;
    }
    tempDate = dayjs(tempDate).add(1, "day").toDate();
  }
  return dates;
}

function plusYearToDate(date) {
  return dayjs(date).add(1, "year").toDate();
}

function getLastDateByLimit(firstDate, lastDate) {
  if (dayjs(lastDate).diff(dayjs(firstDate), "year") >= 1) {
    return plusYearToDate(firstDate);
  }
  return lastDate;
}

function generateDatesByLastDate(firstDate, lastDate, days) {
  return generateDatesByParams(
    firstDate,
    getLastDateByLimit(firstDate, lastDate),
    300,
    days
  );
}

function generateDatesByLessonsCount(firstDate, lessonsCount, days) {
  return generateDatesByParams(
    firstDate,
    plusYearToDate(firstDate),
    Math.min(300, lessonsCount),
    days
  );
}

function generateDates(body) {
  if (body.lastDate != null) {
    return generateDatesByLastDate(body.firstDate, body.lastDate, body.days);
  }
  return generateDatesByLessonsCount(
    body.firstDate,
    body.lessonsCount,
    body.days
  );
}

function generateLessonByDates(body, dates) {
  return dates.map((date) => {
    return {
      date: date,
      title: body.title,
    };
  });
}

function generateLessonTeachers(body, lessonsIds) {
  return lessonsIds.flatMap((lessonId) => {
    return body.teacherIds.map((teacherId) => {
      return { lessonId, teacherId };
    });
  });
}

async function generateLessons(ctx) {
  const body = parse(ctx);
  const dates = generateDates(body);
  const lessons = generateLessonByDates(body, dates);
  return await transaction(ctx, async () => {
    const lessonsIds = await insertLessons(ctx, lessons);
    const lessonTeachers = generateLessonTeachers(body, lessonsIds);
    await insertLessonTeachers(ctx, lessonTeachers);
    return lessonsIds;
  });
}

module.exports = { generateLessons };
