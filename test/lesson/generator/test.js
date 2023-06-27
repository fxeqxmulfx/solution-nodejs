"use strict";
const runTests = require("../../runTests");
const readFile = require("../../context/readFile");

const migration = readFile("./deploy/V1__migration.sql");
const data = readFile("./test/lesson/generator/data.sql");

const cases = [
  {
    description: "Broken teacherIds",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: "abc",
      title: "Blue Ocean",
      days: [0, 1, 3, 6],
      firstDate: "2019-09-10",
      lessonsCount: 9,
    },
    status: 400,
    result: {
      error:
        'At path: teacherIds -- Expected an array value, but received: "abc"',
    },
  },
  {
    description: "Broken title",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: 123,
      days: [0, 1, 3, 6],
      firstDate: "2019-09-10",
      lessonsCount: 9,
    },
    status: 400,
    result: {
      error: "At path: title -- Expected a string, but received: 123",
    },
  },
  {
    description: "Broken days",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Blue Ocean",
      days: "abc",
      firstDate: "2019-09-10",
      lessonsCount: 9,
    },
    status: 400,
    result: {
      error: 'At path: days -- Expected an array value, but received: "abc"',
    },
  },
  {
    description: "Broken firstDate",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Blue Ocean",
      days: [0, 1, 3, 6],
      firstDate: "abc",
      lessonsCount: 9,
    },
    status: 400,
    result: {
      error:
        "At path: firstDate -- Expected a valid `Date` object, but received: Invalid Date",
    },
  },
  {
    description: "Broken lessonsCount",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Blue Ocean",
      days: [0, 1, 3, 6],
      firstDate: "2019-09-10",
      lessonsCount: "abc",
    },
    status: 400,
    result: {
      error:
        'At path: lessonsCount -- Expected a value of type `PositiveNumber`, but received: `"abc"`',
    },
  },
  {
    description: "Check conflict lessonsCount and lastDate",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Blue Ocean",
      days: [0, 1, 3, 6],
      firstDate: "2019-09-10",
      lessonsCount: 9,
      lastDate: "2019-12-31",
    },
    status: 400,
    result: {
      error: "Conflict lessonsCount and lastDate. There can only be one",
    },
  },
  {
    description: "Generate 3 lesson for 2 teachers by lessonsCount",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Blue Ocean",
      days: [0, 3, 6],
      firstDate: "2023-06-27",
      lessonsCount: 5,
    },
    status: 200,
    result: [1, 2, 3, 4, 5],
  },
  {
    description: "Select 3 lesson for 2 teachers",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {},
    status: 200,
    result: [
      {
        id: 1,
        date: "2023-06-28",
        title: "Blue Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 2,
        date: "2023-07-01",
        title: "Blue Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 3,
        date: "2023-07-02",
        title: "Blue Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 4,
        date: "2023-07-05",
        title: "Blue Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 5,
        date: "2023-07-08",
        title: "Blue Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
    ],
  },
];

const cases2 = [
  {
    description: "Generate 3 lesson for 2 teachers by lastDate",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Green Ocean",
      days: [0, 3, 6],
      firstDate: "2023-06-27",
      lastDate: "2023-07-08",
    },
    status: 200,
    result: [1, 2, 3, 4, 5],
  },
  {
    description: "Select 3 lesson for 2 teachers",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {},
    status: 200,
    result: [
      {
        id: 1,
        date: "2023-06-28",
        title: "Green Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 2,
        date: "2023-07-01",
        title: "Green Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 3,
        date: "2023-07-02",
        title: "Green Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 4,
        date: "2023-07-05",
        title: "Green Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 5,
        date: "2023-07-08",
        title: "Green Ocean",
        teachers: [{ id: 1 }, { id: 2 }],
      },
    ],
  },
];

const cases3 = [
  {
    description: "Generate only monday lesson for 2 teachers by lastDate",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Green Ocean",
      days: [1],
      firstDate: "2023-06-27",
      lastDate: "2026-07-08",
    },
    status: 200,
    resultLength: 52,
  },
  {
    description: "Select only monday lesson for 2 teachers by lastDate",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      lessonsPerPage: 200,
    },
    status: 200,
    resultLength: 52,
  },
];

const cases4 = [
  {
    description: "Generate lesson for 2 teachers by lastDate with limit",
    path: "/lessons",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      teacherIds: [1, 2],
      title: "Green Ocean",
      days: [0, 1, 2, 3, 4, 5, 6],
      firstDate: "2023-06-27",
      lastDate: "2026-07-08",
    },
    status: 200,
    resultLength: 300,
  },
  {
    description: "Select lesson for 2 teachers by lastDate with limit",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      lessonsPerPage: 400,
    },
    status: 200,
    resultLength: 300,
  },
];

describe("Tests for module a lesson.generator", () => {
  runTests(migration, data, cases);
  runTests(migration, data, cases2);
  runTests(migration, data, cases3);
  runTests(migration, data, cases4);
});
