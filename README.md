# solution-nodejs

## Run tests

```bash
npm run test
```

## Run backend on localhost:3000

```bash
docker compose up
```

## API

```
path: "/"
method: "POST"
headers: { "Content-Type": "application/json" }
body: {               // all fields are optional
  date: "2019-09-01", // by date
  status: 1,          // by status 0 or 1
  teacherIds: "1,3",  // in teachersIds
  studentsCount: "2", // by studentsCount
  page: 1,            // page number
  lessonsPerPage: 10, // number of lessons per page
}
status: 200
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
]
```

```
path: "/"
method: "POST"
headers: { "Content-Type": "application/json" }
body: {                          // all fields are optional
  date: "2019-09-01,2019-09-01", // in between date
  status: 1,                     // by status 0 or 1
  teacherIds: "1,3",             // in teachersIds
  studentsCount: "2,2",          // in between studentsCount
  page: 1,                       // page number
  lessonsPerPage: 10,            // number of lessons per page
}
status: 200
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
]
```

```
path: "/lessons",
method: "POST",
headers: { "Content-Type": "application/json" },
body: {
  teacherIds: [1, 2],      // list of teachers
  title: "Blue Ocean",     // lesson topic
  days: [0, 3, 6],         // days of the week for which lessons will be generated
  firstDate: "2023-06-27", // from date
  lastDate: "2023-07-08",  // by date, conflicts with lessonsCount
  lessonsCount: 5,         // number of lessons, conflicts with lastDate
},
status: 200,
result: [1, 2, 3, 4, 5],
```
