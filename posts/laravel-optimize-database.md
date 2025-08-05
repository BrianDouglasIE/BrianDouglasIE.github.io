---
title: Optimise SQLite for Laravel apps
date: 17/02/2025
tags: [sqlite, laravel, sql]
---

I love using SQLite, but it requires a bit of configuration to get optimal results.

<!-- more -->

This is where Nuno Maduro's [nunomaduro/laravel-optimize-database](https://github.com/nunomaduro/laravel-optimize-database)
package comes in. This packages sets up your Laravel app's sqlite database to work in a performant manner.

It does this by setting the following PRAGMA options on your sqlite database.

```
 ┌───────────────────────────┬─────────────┬───────────┐
 │ Setting                   │ Value       │ Via       │
 ├───────────────────────────┼─────────────┼───────────┤
 │ PRAGMA auto_vacuum        │ incremental │ Migration │
 │ PRAGMA journal_mode       │ WAL         │ Migration │
 │ PRAGMA page_size          │ 32768       │ Migration │
 │ PRAGMA busy_timeout       │ 5000        │ Runtime   │
 │ PRAGMA cache_size         │ -20000      │ Runtime   │
 │ PRAGMA foreign_keys       │ ON          │ Runtime   │
 │ PRAGMA incremental_vacuum │ (enabled)   │ Runtime   │
 │ PRAGMA mmap_size          │ 2147483648  │ Runtime   │
 │ PRAGMA temp_store         │ MEMORY      │ Runtime   │
 │ PRAGMA synchronous        │ NORMAL      │ Runtime   │
 └───────────────────────────┴─────────────┴───────────┘
 ```

<magpie-trinket>Brian wrote a post detailing some of these PRAGMAs. He called it "[Sensible SQLite defaults](/sqlite-defaults)", it's his most popular post to date.</magpie-trinket>

## Usage

Nuno always makes things easy. You can install and integrate the package with these three commands.

```
composer require nunomaduro/laravel-optimize-database
```

```
php artisan db:optimize
```

```
php artisan migrate
```

After that you SQLite db is ready to use.