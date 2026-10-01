-- One-to-one JOIN
SELECT
    users.name,
    users.email,
    profiles.bio
FROM users
JOIN profiles
    ON users.id = profiles.user_id;

-- One-to-many JOIN
SELECT
    authors.name AS author,
    books.title AS book
FROM authors
JOIN books
    ON authors.id = books.author_id;


-- Many-to-many JOIN

SELECT
    students.name AS student,
    courses.name AS course
FROM students
JOIN student_courses
    ON students.id = student_courses.student_id
JOIN courses
    ON courses.id = student_courses.course_id;


-- ============================================
--  Skill 2: Map the Country Club Relationships
-- ============================================

-- 1. Which columns in cd.bookings are foreign keys, and which tables do they point to?
-- memid is a foreign key that points to cd.members(memid).
-- facid is a foreign key that points to cd.facilities(facid).

-- 2. What kind of relationship is there between members and facilities?
-- There is a many-to-many relationship between members and facilities.

-- 3. Which table plays the role of student_courses in the video?
-- cd.bookings plays the role of the student_courses junction table.

-- 4. The recommendedby column in cd.members points back to cd.members itself.
-- What kind of relationship is that?
-- It is a self-referencing relationship.


-- ============================================
-- Skill 3: Joins and Subqueries Exercises
-- ============================================


-- 1. Retrieve the start times of members' bookings

SELECT bks.starttime
FROM cd.bookings bks
JOIN cd.members mems
    ON mems.memid = bks.memid
WHERE mems.firstname = 'David'
AND mems.surname = 'Farrell';


-- 2. Work out the start times of bookings for tennis courts

SELECT bks.starttime
FROM cd.bookings bks
JOIN cd.facilities facs
    ON bks.facid = facs.facid
WHERE facs.name LIKE 'Tennis Court%';


-- 3. Produce a list of all members who have recommended another member

SELECT mems.firstname, mems.surname
FROM cd.members mems
JOIN cd.members recs
    ON recs.recommendedby = mems.memid;


-- 4. Produce a list of all members, along with their recommender

SELECT mems.firstname, mems.surname,
       recs.firstname AS recommender_firstname,
       recs.surname AS recommender_surname
FROM cd.members mems
LEFT JOIN cd.members recs
    ON mems.recommendedby = recs.memid;


-- 5. Produce a list of all members who have used a tennis court

SELECT DISTINCT mems.firstname, mems.surname
FROM cd.members mems
JOIN cd.bookings bks
    ON mems.memid = bks.memid
JOIN cd.facilities facs
    ON bks.facid = facs.facid
WHERE facs.name LIKE 'Tennis Court%';


-- 6. Produce a list of costly bookings

SELECT mems.firstname, mems.surname,
       facs.name,
       CASE
           WHEN bks.memid = 0
           THEN bks.slots * facs.guestcost
           ELSE bks.slots * facs.membercost
       END AS cost
FROM cd.members mems
JOIN cd.bookings bks
    ON mems.memid = bks.memid
JOIN cd.facilities facs
    ON bks.facid = facs.facid
WHERE
    CASE
        WHEN bks.memid = 0
        THEN bks.slots * facs.guestcost
        ELSE bks.slots * facs.membercost
    END > 30;


-- 7. Produce a list of all members, along with their recommender,
--    using no joins

SELECT mems.firstname,
       mems.surname,
       (
           SELECT recs.firstname
           FROM cd.members recs
           WHERE recs.memid = mems.recommendedby
       ) AS recommender_firstname,
       (
           SELECT recs.surname
           FROM cd.members recs
           WHERE recs.memid = mems.recommendedby
       ) AS recommender_surname
FROM cd.members mems;


-- 8. Produce a list of costly bookings, using a subquery

SELECT firstname, surname, name, cost
FROM (
    SELECT mems.firstname,
           mems.surname,
           facs.name,
           CASE
               WHEN bks.memid = 0
               THEN bks.slots * facs.guestcost
               ELSE bks.slots * facs.membercost
           END AS cost
    FROM cd.members mems
    JOIN cd.bookings bks
        ON mems.memid = bks.memid
    JOIN cd.facilities facs
        ON bks.facid = facs.facid
) AS bookings
WHERE cost > 30;

