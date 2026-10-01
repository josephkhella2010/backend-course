


-- ============================================
-- 1. ONE-TO-ONE RELATIONSHIP
-- users -> profiles
-- ============================================
-- create table for users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

-- create table for profiles with relation with userid

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Insert users
INSERT INTO users (name, email)
VALUES
    ('Harvey', 'harvey@example.com'),
    ('Marco', 'marco@example.com');


-- Insert profiles
INSERT INTO profiles (user_id, bio)
VALUES
    (1, 'Harvey profile'),
    (2, 'Marco profile');


-- JOIN users with their profiles
SELECT
    users.name,
    users.email,
    profiles.bio
FROM users
JOIN profiles
    ON users.id = profiles.user_id;


-- ============================================
-- 2. ONE-TO-MANY RELATIONSHIP
-- authors -> books
-- ============================================

-- create table for authors

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert authors
INSERT INTO authors (name)
VALUES
    ('George Orwell'),
    ('J.K. Rowling');

-- create table for books relation with author_id

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- Insert books

INSERT INTO books (title, author_id)
VALUES
    ('1984', 1),
    ('Animal Farm', 1),
    ('Harry Potter and the Philosopher''s Stone', 2);


-- JOIN authors with their books
SELECT
    authors.name AS author,
    books.title AS book
FROM authors
JOIN books
    ON authors.id = books.author_id;

-- ============================================
-- 3. MANY-TO-MANY RELATIONSHIP
-- students <-> courses
-- ============================================

-- create table for students 

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert students

INSERT INTO students (name)
VALUES
    ('Harvey'),
    ('Marco'),
    ('John');

-- create table for courses

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert courses

INSERT INTO courses (name)
VALUES
    ('Math'),
    ('Biology'),
    ('English');

-- create table for relation between students and courses

CREATE TABLE student_courses (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- insert student_courses
INSERT INTO student_courses (student_id, course_id)
VALUES
    (1, 1), 
    (1, 2),
    (2, 1), 
    (2, 3), 
    (3, 2); 

-- JOIN students with their courses

SELECT
    students.name AS student,
    courses.name AS course
FROM students
JOIN student_courses
    ON students.id = student_courses.student_id
JOIN courses
    ON courses.id = student_courses.course_id;

-- ============================================
-- TRY TO BREAK IT
-- ============================================

-- Invalid author_id:
-- Inserting author_id 999 fails because there is no
-- author with id 999. The foreign key prevents books
-- from referencing a non-existing author.

-- Duplicate student-course:
-- Inserting (student_id, course_id) = (1, 1) again fails
-- because student_id and course_id together form the
-- primary key. The same student cannot be enrolled
-- in the same course twice.