Sensible SQLite defaults
17/10/2024
sql
---

SQLite is cool now. DHH uses it, Laravel defaults to it. Here is a list of
_sensible defaults_ when using sqlite.


<!-- more -->

## The whys?

```sql
PRAGMA journal_mode = WAL;
```

**Why?**: Allows concurrent reads and writes, making it more suitable for web applications with multiple users accessing the database simultaneously.

```sql
PRAGMA synchronous = NORMAL;
```

**Why?**: Balances performance and data safety by ensuring that data is written to disk in a reasonable time frame without slowing down writes as much as `FULL` mode.

```sql
PRAGMA busy_timeout = 5000;
```
**Why?**: Prevents "database is locked" errors by giving SQLite 5 seconds to wait for a locked resource before returning an error, useful for handling multiple concurrent accesses.

```sql
PRAGMA cache_size = -20000;
```
**Why?**: Sets the cache size to 20MB, allowing more data to be cached in memory, improving query performance by reducing the number of disk reads.

```sql
PRAGMA foreign_keys = ON;
```
**Why?**: Ensures referential integrity by enforcing foreign key constraints, critical for maintaining consistent relationships between tables (e.g., users, posts, and comments).

```sql
PRAGMA auto_vacuum = INCREMENTAL;
```
**Why?**: Reclaims disk space gradually as rows are deleted, instead of performing a full vacuum, reducing performance impact during database operations.

```sql
PRAGMA temp_store = MEMORY;
```
**Why?**: Stores temporary tables and other temporary data in memory, improving the performance of operations like sorting and indexing that are common in web applications.

```sql
PRAGMA mmap_size = 2147483648;
```
**Why?**: Uses memory-mapped I/O with a size of 2GB, which can speed up database access by reducing disk I/O, especially beneficial for large databases with frequent reads and writes.

```sql
PRAGMA page_size = 8192;
```
**Why?**: Sets a page size of 8KB, which provides a balance between memory usage and disk I/O performance for a forum database that handles many reads and writes.

## Copy paste

For your convenience.

```sql
-- Set the journal mode to Write-Ahead Logging for concurrency
PRAGMA journal_mode = WAL;

-- Set synchronous mode to NORMAL for performance and data safety balance
PRAGMA synchronous = NORMAL;

-- Set busy timeout to 5 seconds to avoid "database is locked" errors
PRAGMA busy_timeout = 5000;

-- Set cache size to 20MB for faster data access
PRAGMA cache_size = -20000;

-- Enable foreign key constraint enforcement
PRAGMA foreign_keys = ON;

-- Enable auto vacuuming and set it to incremental mode for gradual space reclaiming
PRAGMA auto_vacuum = INCREMENTAL;

-- Store temporary tables and data in memory for better performance
PRAGMA temp_store = MEMORY;

-- Set the mmap_size to 2GB for faster read/write access using memory-mapped I/O
PRAGMA mmap_size = 2147483648;

-- Set the page size to 8KB for balanced memory usage and performance
PRAGMA page_size = 8192;
```
