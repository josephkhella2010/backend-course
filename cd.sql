-- 1. Retrieve everything from a table

SELECT *
FROM public.facilities;


-- 2. Retrieve specific columns from a table

SELECT name, membercost
FROM public.facilities;


-- 3. Control which rows are retrieved

SELECT *
FROM public.facilities
WHERE membercost > 0;


-- 4. Control which rows are retrieved – part 2

SELECT *
FROM public.facilities
WHERE membercost > 0
  AND membercost < monthlymaintenance;


-- 5. Basic string searches

SELECT *
FROM public.facilities
WHERE name LIKE '%Swimming Pool%';


-- 6. Matching against multiple possible values

SELECT *
FROM public.facilities
WHERE facid IN (1, 3);


-- 7. Classify results into buckets

SELECT name,
       CASE
           WHEN membercost > 0
                AND membercost <= 3
           THEN 'cheap'
           ELSE 'expensive'
       END AS cost
FROM public.facilities;


-- 8. Working with dates

SELECT memid, firstname, surname, joindate
FROM public.members
WHERE joindate >= '2026-03-20';


-- 9. Removing duplicates, and ordering results

SELECT DISTINCT surname, firstname
FROM public.members
ORDER BY surname, firstname;


-- 10. Combining results from multiple queries

SELECT firstname AS name
FROM public.members

UNION

SELECT name
FROM public.facilities;


-- 11. Simple aggregation

SELECT COUNT(*)
FROM public.facilities
WHERE membercost > 0;


-- 12. More aggregation

SELECT MAX(recommendedby)
FROM public.members;

-- tables 
CREATE TABLE bookings (
    bookid integer NOT NULL,
    facid integer NOT NULL,
    memid integer NOT NULL,
    starttime timestamp without time zone NOT NULL,
    slots integer NOT NULL
);


--
-- TOC entry 169 (class 1259 OID 32770)
-- Name: facilities; Type: TABLE; Schema: cd; Owner: -; Tablespace:
--

CREATE TABLE facilities (
    facid integer NOT NULL,
    name character varying(100) NOT NULL,
    membercost numeric NOT NULL,
    guestcost numeric NOT NULL,
    initialoutlay numeric NOT NULL,
    monthlymaintenance numeric NOT NULL
);


--
-- TOC entry 170 (class 1259 OID 32800)
-- Name: members; Type: TABLE; Schema: cd; Owner: -; Tablespace:
--

CREATE TABLE members (
    memid integer NOT NULL,
    surname character varying(200) NOT NULL,
    firstname character varying(200) NOT NULL,
    address character varying(300) NOT NULL,
    zipcode integer NOT NULL,
    telephone character varying(20) NOT NULL,
    recommendedby integer,
    joindate timestamp without time zone NOT NULL
);