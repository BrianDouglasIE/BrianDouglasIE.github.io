Feature flags db schema
05/08/2025
sql
---

Feature flags are simple _on_ / _off_ flags that can be used to toggle application features without needing a production release.

<!-- more -->

My implementation allows for flags that are domain specific. Each flag can have a different status based on the current env.
For example the flag `enable_dark_mode` on the domain `example.com` may be `on` in `staging` and `off` in `production`. I have kept it
simple and have excluded adding any extra metadata to the feature flags. For example some implementations give the flag a value as well
as a status. So that the flag can be used to change the logic of a program. For example a flag called `has_session_timeout` may hold an
integer value that sets the session length. I believe that this is convoluted and may add unwanted _side effects_ to what should be a
straight forward on / off switch.

<magpie-trinket>The implementation in question is part of a schema collection, which can be found at [BrianDouglasIE/ExampleDatabasesSchemas](https://github.com/BrianDouglasIE/ExampleDatabasesSchemas)</magpie-trinket>

## Set Up

Full source code can be found at [ExampleDatabasesSchemas/feature_flags](https://github.com/BrianDouglasIE/ExampleDatabasesSchemas/tree/master/feature_flags).
This includes the schema and a `data.sql` file to quickly load some example data.

```sql
createdb feature_flags
psql -d feature_flags -f feature_flags.schema.sql
psql -d feature_flags -f feature_flags.data.sql
```

## Example Queries

### Get a specific flag on staging for a given domain

```sql
SELECT
  d.hostname,
  f.name AS flag,
  df.status,
  df.env,
  f.updated_at
FROM flags f
JOIN domain_flags df ON f.id = df.flag_id
JOIN domains d ON d.id = df.domain_id
WHERE d.hostname = 'example.com'
  AND df.env = 'staging'
  AND f.name = 'enable_dark_mode';
```

```
  hostname   |       flag       | status | env         |          updated_at
-------------+------------------+--------+-------------+-------------------------------
 example.com | enable_dark_mode | on     | staging     | 2025-08-05 08:10:01.471816+00
(1 row)
```

### Get all active flags on prod for a given domain

```sql
SELECT
  d.hostname,
  f.name AS flag,
  df.status,
  f.updated_at
FROM flags f
JOIN domain_flags df ON f.id = df.flag_id
JOIN domains d ON d.id = df.domain_id
WHERE d.hostname = 'example.com'
  AND df.env = 'prod'
  AND df.status = 'on';
```

```
  hostname   |    flag     | status |          updated_at
-------------+-------------+--------+-------------------------------
 example.com | require_2fa | on     | 2025-08-05 08:10:01.471816+00
(1 row)
```

### Get status of all flags on all envs for a given domain

```sql
SELECT
  f.name AS flag,
  df.status,
  df.env
FROM flags f
JOIN domain_flags df ON f.id = df.flag_id
JOIN domains d ON d.id = df.domain_id
WHERE d.hostname = 'example.com';
```

```
       flag       | status | env
------------------+--------+-------------
 enable_dark_mode | on     | dev
 enable_dark_mode | on     | staging
 enable_dark_mode | off    | prod
 new_ui           | on     | dev
 new_ui           | off    | staging
 new_ui           | off    | prod
 require_2fa      | off    | dev
 require_2fa      | off    | staging
 require_2fa      | on     | prod
(9 rows)
```
