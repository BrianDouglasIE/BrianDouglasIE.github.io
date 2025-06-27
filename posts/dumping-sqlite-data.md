---
title: Creating a database dump with SQLite
date: 17/02/2025
tags: [sqlite]
---

For one reason or another you may want to _dump_ your sqlite data into an sql file.

<!-- more -->

A database dump can be used to import and export sql data. As with most things it
is a trivial task with SQLite.

## Exporting data

```
sqlite3 database.db .dump > database_dump_$(date +%Y%m%d_%H%M%S).sql
```

The above command dumps the database to a new _.sql_ file that is timestamped. I like to use the
following timestamp format `YYYYMMDD_HHMMSS`.

## Importing data

An exported sql file can then be imported into a sqlite database like so.

```
sqlite3 database.db < database_dump_20250216_100802.sql
```