create table if not exists lessons
(
    id     integer primary key generated always as identity,
    date   date not null,
    title  varchar(100),
    status integer default 0
);

create table if not exists teachers
(
    id   integer primary key generated always as identity,
    name varchar(10)
);

create table if not exists students
(
    id   integer primary key generated always as identity,
    name varchar(10)
);

create table if not exists lesson_students
(
    lesson_id  integer references lessons,
    student_id integer references students,
    visit      boolean default false
);

create table if not exists lesson_teachers
(
    lesson_id  integer references lessons,
    teacher_id integer references teachers
);