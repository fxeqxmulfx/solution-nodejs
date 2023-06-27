"use strict";
const { namedQuery } = require("../../context/db");

async function insertLessons(ctx, lessons) {
  const db = ctx.state.db;
  return await Promise.all(
    lessons.map(
      async (lesson) =>
        (
          await namedQuery(
            db,
            "insert into lessons(date, title) values (:date, :title) returning id;",
            lesson
          )
        )[0].id
    )
  );
}

async function insertLessonTeachers(ctx, lessonTeachers) {
  const db = ctx.state.db;
  await Promise.all(
    lessonTeachers.map(
      async (lesson) =>
        await namedQuery(
          db,
          "insert into lesson_teachers(lesson_id, teacher_id) values (:lessonId, :teacherId);",
          lesson
        )
    )
  );
}

module.exports = { insertLessons, insertLessonTeachers };
