"use strict";
const runTests = require("../../runTests");
const readFile = require("../../context/readFile");

const migration = readFile("./test/lesson/search/migration.sql");
const data = readFile("./test/lesson/search/data.sql");

const cases = [
  {
    description: "Broken date",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { date: "abc" },
    status: 400,
    result: {
      error:
        "At path: date.firstDate -- Expected a valid `Date` object, but received: Invalid Date",
    },
  },
  {
    description: "Filter by date",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { date: "2019-09-01" },
    status: 200,
    result: [{ id: 1, date: "2019-09-01" }],
  },
  {
    description: "Check is correct response",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { date: "2019-09-01" },
    status: 200,
    result: [
      {
        id: 1,
        date: "2019-09-01",
        title: "Green Color",
        status: 1,
        visitCount: 2,
        students: [
          { id: 1, name: "Ivan", visit: true },
          { id: 2, name: "Sergey", visit: true },
          { id: 3, name: "Maxim", visit: false },
        ],
        teachers: [
          { id: 1, name: "Sveta" },
          { id: 3, name: "Angelina" },
        ],
      },
    ],
  },
  {
    description: "Broken lessonsPerPage",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { lessonsPerPage: "abc" },
    status: 400,
    result: {
      error:
        'At path: lessonsPerPage -- Expected a value of type `PositiveNumber`, but received: `"abc"`',
    },
  },
  {
    description: "Check is correct work lessonsPerPage = 2",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { lessonsPerPage: 2 },
    status: 200,
    result: [{ id: 1 }, { id: 2 }],
  },
  {
    description: "Check is correct work default lessonsPerPage = 5",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {},
    status: 200,
    result: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  },
  {
    description: "Broken page",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { page: "abc" },
    status: 400,
    result: {
      error:
        'At path: page -- Expected a value of type `PositiveNumber`, but received: `"abc"`',
    },
  },
  {
    description: "Check is correct work page = 2",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { page: 2 },
    status: 200,
    result: [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }],
  },
  {
    description: "Broken dates",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { date: "2019-05-10,abc" },
    status: 400,
    result: {
      error:
        "At path: date.secondDate -- Expected a valid `Date` object, but received: Invalid Date",
    },
  },
  {
    description: "Filter by dates",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { date: "2019-05-10,2019-06-17", lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 5, date: "2019-05-10" },
      { id: 6, date: "2019-05-15" },
      { id: 7, date: "2019-06-17" },
      { id: 8, date: "2019-06-17" },
    ],
  },
  {
    description: "Broken status",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { status: 2 },
    status: 400,
    result: {
      error:
        "At path: status -- Expected a value of type `ZeroOrOne`, but received: `2`",
    },
  },
  {
    description: "Filter by status = 0",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { status: 0, lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 2, status: 0 },
      { id: 5, status: 0 },
      { id: 7, status: 0 },
      { id: 10, status: 0 },
    ],
  },
  {
    description: "Filter by status = 1",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { status: 1, lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 1, status: 1 },
      { id: 3, status: 1 },
      { id: 4, status: 1 },
      { id: 6, status: 1 },
      { id: 8, status: 1 },
      { id: 9, status: 1 },
    ],
  },
  {
    description: "Broken teacherIds",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { teacherIds: "abc" },
    status: 400,
    result: {
      error:
        "At path: teacherIds.0 -- Expected a value of type `PositiveNumber`, but received: `NaN`",
    },
  },
  {
    description: "Filter by teacherIds",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { teacherIds: "1, 2", lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 1, teachers: [{ id: 1 }, { id: 3 }] },
      { id: 2, teachers: [{ id: 1 }, { id: 4 }] },
      { id: 7, teachers: [{ id: 1 }] },
      { id: 8, teachers: [{ id: 2 }, { id: 3 }, { id: 4 }] },
    ],
  },
  {
    description: "Broken studentsCount",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { studentsCount: "abc" },
    status: 400,
    result: {
      error:
        "At path: studentsCount.firstStudentCount -- Expected a value of type `ZeroOrPositiveNumber`, but received: `NaN`",
    },
  },
  {
    description: "Filter by studentsCount",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { studentsCount: "2", lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 1, visitCount: 2 },
      { id: 2, visitCount: 2 },
      { id: 7, visitCount: 2 },
      { id: 8, visitCount: 2 },
    ],
  },
  {
    description: "Broken studentsCounts",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { studentsCount: "0,abc" },
    status: 400,
    result: {
      error:
        "At path: studentsCount.secondStudentCount -- Expected a value of type `ZeroOrPositiveNumber`, but received: `NaN`",
    },
  },
  {
    description: "Filter by studentsCounts",
    path: "/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { studentsCount: "0,1", lessonsPerPage: 10 },
    status: 200,
    result: [
      { id: 3, visitCount: 0 },
      { id: 5, visitCount: 0 },
      { id: 6, visitCount: 0 },
      { id: 9, visitCount: 0 },
      { id: 10, visitCount: 1 },
    ],
  },
];

describe("Tests for module a lesson.search", () => {
  runTests(migration, data, cases);
});

module.exports = cases;
