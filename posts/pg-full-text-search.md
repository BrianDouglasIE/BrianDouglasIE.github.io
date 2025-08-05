---
title: PostgresSQL full text search
date: 31/07/2025
tags: [sql]
---

PostgresSQL provides a builtin full text search feature. Here is how I use it with examples.

<!-- more -->

<magpie-trinket>The database used in the below examples is the _netflix_ database from [neondatabase-labs/postgres-sample-dbs](https://github.com/neondatabase-labs/postgres-sample-dbs)</magpie-trinket>


## Search by title

Let's start off with a basic search. We are going to use the `@@` operator to search the `title` column for the text `'Python'`.

```sql
SELECT title, release_year 
FROM netflix_shows 
WHERE to_tsvector(title) @@ to_tsquery('Python') 
AND release_year < 2000 
ORDER BY release_year DESC;
```

```
                          title                           | release_year
----------------------------------------------------------+--------------
 Monty Python: Live at Aspen                              |         1998
 Parrot Sketch Not Included: Twenty Years of Monty Python |         1989
 Monty Python: Live at The Hollywood Bowl                 |         1982
 Monty Python's Life of Brian                             |         1979
 Monty Python and the Holy Grail                          |         1975
 Monty Python's Flying Circus                             |         1974
 Monty Python's Fliegender Zirkus                         |         1972
(7 rows)
```

## Search by title and release_year

Now let's say we want to find all titles including 'Python' released in 1972. To do this we add the `release_year` column. Note,
that it needs transformed to a text value in order to by processed.

```sql
SELECT title, release_year 
FROM netflix_shows 
WHERE 
	to_tsvector(title || ' ' || release_year::text) @@ 
	to_tsquery('Python & 1972') 
ORDER BY release_year DESC;
```

```
              title               | release_year
----------------------------------+--------------
 Monty Python's Fliegender Zirkus |         1972
(1 row)
```

## Search using a full sentence

You will notice the in the previous example that `&` was used to seperate the words in the query. Removing this would result in an error.
Likely when using this feature in the real world you will be passing a string from a user into the query. Each word must be seperated by an
ampersand. A quick way to ensure this is to use a `regexp_replace` to insert the `&` sumbol between each word.

```sql
SELECT title, release_year 
FROM netflix_shows 
WHERE 
	to_tsvector(title || ' ' || release_year::text) @@ 
	to_tsquery(regexp_replace('Monty Python 1972', '\s+', ' & ', 'g')) 
ORDER BY release_year DESC;
```

```
              title               | release_year
----------------------------------+--------------
 Monty Python's Fliegender Zirkus |         1972
(1 row)
```

## Adding an index for performance

Let's say it's regular for a user to search by a title and a year. For example _Monty Python 1972_. This search
corresponds to the `title` and `release_year` column. Adding an index for that search will increase the performance
of the query and can be done like so.

<chicken-asks>What's _fts_?</chicken-asks>
<magpie-replies>Full Text Search</magpie-replies>

```sql
CREATE INDEX idx_netflix_fts
ON netflix_shows
USING GIN (
	to_tsvector('english', title || ' ' || release_year::text)
);
```

The above index can be used as per the following example.

```sql
SELECT title, release_year
FROM netflix_shows
WHERE
	to_tsvector('english', title || ' ' || release_year::text) @@
	to_tsquery('english', regexp_replace('Monty Python 1972', '\s+', ' & ', 'g'))
ORDER BY release_year DESC;
```

This results in the following speed up when run with `EXPLAIN`.

```
Before Index: (cost=5057.67..5057.67 rows=1 width=22)
After Index:  (cost=30.20..34.48 rows=1 width=22)
```

The cost drops drastically from 5057 to ~30–34 units of work. Before it was likely a sequential scan, checking every row.
Now it's using a GIN index and skipping most rows, which is nearly 150 times faster.

## Adding an index on a `tsvector` column

As we stated above, searching based on _title_ and _release_year_ is a regular occurence. So this may justify adding
a generated _tsvector_ column. Let's alter the table to add an `fts` column that creates a `tsvector` based off the
_title_ and _release_year_.


```sql
ALTER TABLE netflix_shows 
ADD COLUMN fts tsvector GENERATED ALWAYS AS (
	to_tsvector('english', title || ' ' || release_year::text)
) STORED;
```

Then create the index.

```sql
CREATE INDEX idx_netflix_fts ON netflix_shows USING GIN (fts);
```

The `tsvector` column `fts` can now be used with the `@@` operator when searching.

```sql
SELECT title, release_year
FROM netflix_shows
WHERE fts @@ to_tsquery('english', regexp_replace('Monty Python 1972', '\s+', ' & ', 'g'))
ORDER BY release_year DESC;
```
