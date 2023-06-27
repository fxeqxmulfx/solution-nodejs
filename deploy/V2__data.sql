insert into lessons(date, title, status)
values ('2019-09-01', 'Green Color', 1),
       ('2019-09-02', 'Red Color', 0),
       ('2019-09-03', 'Orange Color', 1),
       ('2019-09-04', 'Blue Color', 1),
       ('2019-05-10', 'Purple Color', 0),
       ('2019-05-15', 'Red Color', 1),
       ('2019-06-17', 'White Color', 0),
       ('2019-06-17', 'Black Color', 1),
       ('2019-06-20', 'Yellow Color', 1),
       ('2019-06-24', 'Brown Color', 0);

insert into teachers(name)
values ('Sveta'),
       ('Marina'),
       ('Angelina'),
       ('Masha');

insert into students(name)
values ('Ivan'),
       ('Sergey'),
       ('Maxim'),
       ('Slava');

insert into lesson_students(lesson_id, student_id, visit)
values (1, 1, true),
       (1, 2, true),
       (1, 3, false),
       (2, 2, true),
       (2, 3, true),
       (4, 1, true),
       (4, 2, true),
       (4, 3, true),
       (4, 4, true),
       (5, 4, false),
       (5, 2, false),
       (6, 1, false),
       (6, 3, false),
       (7, 2, true),
       (7, 1, true),
       (8, 1, false),
       (8, 4, true),
       (8, 2, true),
       (9, 2, false),
       (10, 1, false),
       (10, 3, true);

insert into lesson_teachers(lesson_id, teacher_id)
values (1, 1),
       (1, 3),
       (2, 1),
       (2, 4),
       (3, 3),
       (4, 4),
       (6, 3),
       (7, 1),
       (8, 4),
       (8, 3),
       (8, 2),
       (9, 3),
       (10, 3);