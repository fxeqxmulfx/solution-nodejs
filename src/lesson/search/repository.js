"use strict";
const { namedQuery } = require("../../context/db");
const dayjs = require("dayjs");

function generateWhereDate(filter) {
  if (filter.date?.firstDate != null && filter.date?.secondDate != null) {
    return "l.date >= :date_firstDate and l.date <= :date_secondDate";
  }
  if (filter.date?.firstDate != null) {
    return "l.date = :date_firstDate";
  }
  return "";
}

function generateWhereStatus(filter) {
  if (filter.status != null) {
    return "l.status = :status";
  }
  return "";
}

function generateWhereTeacherIds(filter) {
  if (filter.teacherIds != null) {
    return `
      l.id in (select l2.id
           from lessons l2
                    join lesson_teachers lt2 on l2.id = lt2.lesson_id
           where lt2.teacher_id = any(:teacherIds::int[]))
    `;
  }
  return "";
}

function generateWhereStudentCount(filter) {
  if (
    filter.studentsCount?.firstStudentCount != null &&
    filter.studentsCount?.secondStudentCount != null
  ) {
    return "where sq.visit_count >= :studentsCount_firstStudentCount and sq.visit_count <= :studentsCount_secondStudentCount";
  }
  if (filter.studentsCount?.firstStudentCount != null) {
    return "where sq.visit_count = :studentsCount_firstStudentCount";
  }
  return "";
}

function generateWhere(filter) {
  const filters = [
    generateWhereDate(filter),
    generateWhereStatus(filter),
    generateWhereTeacherIds(filter),
  ]
    .filter((value) => value !== "")
    .join(" and ");
  if (filters !== "") {
    return `where ${filters}`;
  }
  return "";
}

function generateLimit() {
  return `limit :lessonsPerPage`;
}

function generateOffset() {
  return `offset (:page - 1) * :lessonsPerPage`;
}

async function search(ctx, filter) {
  const db = ctx.state.db;
  return (
    await namedQuery(
      db,
      `
          select sq.*
          from (select l.id,
                       l.date,
                       l.title,
                       l.status,
                       count(distinct (select ls.student_id
                                       where ls.visit))::int4 as visit_count,
                       jsonb_agg(distinct sl)                 as students,
                       jsonb_agg(distinct tl)                 as teachers
                from lessons l
                         left join lesson_students ls on l.id = ls.lesson_id
                         left join students s on ls.student_id = s.id
                         left join lesson_teachers lt on l.id = lt.lesson_id
                         left join teachers t on t.id = lt.teacher_id,
                     lateral (select s.id, s.name, ls.visit order by s.id) as sl,
                     lateral (select t.id, t.name order by t.id) as tl
                    ${generateWhere(filter)}
                group by l.id) sq
              ${generateWhereStudentCount(filter)}
          order by sq.id ${generateLimit()} ${generateOffset()};
      `,
      filter
    )
  ).map((row) => {
    return {
      ...row,
      date: dayjs(row.date).format("YYYY-MM-DD"),
      students: row.students.filter((student) => student.id != null),
      teachers: row.teachers.filter((teacher) => teacher != null),
    };
  });
}

module.exports = { search };
