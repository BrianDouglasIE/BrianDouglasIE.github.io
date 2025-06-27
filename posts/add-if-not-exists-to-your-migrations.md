---
title: Add IF NOT EXISTS to your migrations
date: 09/10/2024
tags: [ sql, postgresql ]
---

When working on a codebase with a number of other developers migrations can cause
database conflicts. One simple step to stop migrations failing when switching 
between development branches is to add `IF NOT EXISTS` when creating a table.

<!-- more -->

## The Problem

Let's say we have a migration like the following.

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,

    title VARCHAR(140) NOT NULL,
    content VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

This is perfectly fine. It creates the `tickets` table. But what if we are working on this
feature and then have to switch to another part way through? Well we checkout the other feature
branch and work away. Now it's time to come back to the `tickets` feature. Let's say we have
to build the application locally when working on it. Once we try to build the app the migrations
will fail. Why? because the `tickets` table already exists, from when we were previously working on
the feature and ran the migration.

## The Solution

Well that's annoying right? one solution would be to rollback the migration or delete the correct
row in our `migrations` table. But we can prevent this problem from ever happening in the first place
by adding `CREATE TABLE IF NOT EXISTS` to our migration. It now looks like this.

```sql
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,

    title VARCHAR(140) NOT NULL,
    content VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

It may seem like an obvious thing but I've been working on a codebase recently where the
teams have not been doing this. It leads to annoying failures when checking out different
branches. So make sure to apply this when writing SQL migrations.

Those lucky ones working on Laravel, Django, or Rails apps will never face this issue. This
is a burden of the enterprise Java developer.