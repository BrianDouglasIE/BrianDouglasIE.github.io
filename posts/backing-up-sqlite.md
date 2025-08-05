---
title: Backing up an SQLite database
date: 16/02/2025
tags: [sqlite, sql]
---

SQLite is a file based database. This makes common tasks like back-ups trivial.

<!-- more -->

A database backup is essentially a snapshot of the database's current state. This 
is a useful thing to have, just in case you need to restore a database to an old state.
Depending on the activity on your app you may want to back it up frequently.

## Backing up

Backing up an SQLite database is as simple as copying the file. On a linux box you do this
with the `cp` command.

```
cp database.db backup_database_$(date +%Y%m%d_%H%M%S).db
```

The above command copies the database to a new file that is timestamped. I like to use the
following timestamp format `YYYYMMDD_HHMMSS`.

## Restoring from a back up

To restore an sqlite database from a back up. We just need to _copy the copy_ to the original
location.

<chicken-asks>Copy the copy?</chicken-asks>
<magpie-replies>He has a way with words.</magpie-replies>

This is basically the reverse of the backup command.

```
cp backup_database_20250116_091422.db database.db
```

This replaces the current database with the backup, maintaining the backup for future use.