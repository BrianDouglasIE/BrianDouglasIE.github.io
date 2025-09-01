---
title: Generate SQLite table types for Typescript
date: 01/09/2025
tags: [js]
---

Bun has an sqlite interface built in. It make for some great dev-ex. One thing that ircks me when dealing with
sql and Typescript however, is that when I run queries I often have to model the db table that I am querying in
Typescript. This usually involves a manual effort, but not anymore. I have written a short script to auto 
generate Typescript types for table definitions.

<!-- more -->

<chicken-asks>Why not _just use an ORM_?</chicken-asks>
<magpie-replies>SQL is the best way to interface with a DB. ORMs add too many complex abstractions.</magpie-replies>

## Implementation

The goal here is not to have to write types that model db tables. So the end goal is to run a query like so,
where `projects_table` is a type that has been generated from the db schema.

```typescript
const project = db.query<projects_table, []>('SELECT * FROM projects WHERE id = 1').get()
```

In order to generate the table definition types I use the below scripts. Which I call on each db migration.
This means that the generated types stay up to date with my database.

The below only generates types for table definitions, but I am sure views and function return types could
also be modelled.

```typescript
import { writeFileSync } from "node:fs";
import { db } from "./db/db";
import { join } from "node:path";
import { mapSqliteTypeToTs } from "./sqlite-types"

export function generateSqliteTableDefinitions() {
    let content = '/* GENERATED FILE CONTENT DO NOT EDIT */\n\n'
    const tables = db.query<{ name: string }, []>(`SELECT name FROM sqlite_master WHERE type='table';`).all()

    for (const table of tables) {
        const stmt = db.prepare<{ name: string, type: string, }, []>(`PRAGMA table_info(${table.name})`);
        const columns = stmt.all();
        content += `export type ${table.name}_table = { \n${columns.map(it => `  ${it.name}: ${mapSqliteTypeToTs(it.type)}`).join(';\n')}\n}\n\n`
    }

    writeFileSync(join(process.cwd(), 'sqlite-table-defs.ts'), content, 'utf8')
}
```

And the type mapper:

```typescript
// sqlite-types.ts
const sqliteToTsType: Record<string, string> = {
    // numeric
    "INT": "number",
    "INTEGER": "number",
    "TINYINT": "number",
    "SMALLINT": "number",
    "MEDIUMINT": "number",
    "BIGINT": "number",
    "UNSIGNED BIG INT": "number",
    "INT2": "number",
    "INT8": "number",

    // real
    "REAL": "number",
    "DOUBLE": "number",
    "DOUBLE PRECISION": "number",
    "FLOAT": "number",
    "NUMERIC": "number",
    "DECIMAL": "number",

    // text
    "TEXT": "string",
    "CHARACTER": "string",
    "VARCHAR": "string",
    "VARYING CHARACTER": "string",
    "NCHAR": "string",
    "NATIVE CHARACTER": "string",
    "NVARCHAR": "string",
    "CLOB": "string",

    // date/time
    "DATE": "string",
    "DATETIME": "string",

    // blob
    "BLOB": "Buffer",

    // null
    "NULL": "null",
};

export function mapSqliteTypeToTs(type: string): string {
    const normalized = type.trim().toUpperCase();
    for (const key in sqliteToTsType) {
        if (normalized.includes(key)) {
            return sqliteToTsType[key] ?? 'any';
        }
    }
    return "any";
}
```

## Generated Types

The generated output is as follows:

```typescript
/* GENERATED FILE CONTENT DO NOT EDIT */

export type migrations_table = { 
  id: number;
  name: string;
  created_at: string
}

export type sqlite_sequence_table = { 
  name: any;
  seq: any
}

export type users_table = { 
  id: number;
  email: string;
  password: string;
  created_at: string
}

export type projects_table = { 
  id: number;
  name: string;
  created_at: string
}

export type project_users_table = { 
  project_id: number;
  user_id: number;
  role: string;
  created_at: string
}

export type questions_table = { 
  id: number;
  text: string;
  project_id: number;
  user_id: number;
  created_at: string
}

export type answers_table = { 
  id: number;
  text: string;
  question_id: number;
  user_id: number;
  created_at: string
}
```