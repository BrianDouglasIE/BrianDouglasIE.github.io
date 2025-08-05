---
title: Using a PostgreSQL enum for state
date: 06/10/2024
tags: [ sql ]
---

There are lot's of occasions where I see SQL table definitions that contain
various boolean properties to communicate state. Often in these instances it
would be much more optimal to use an `enum`.

<!-- more -->

## Using an Enum for State

Let's look at the migration for a `tickets` table. In this example we can think
of a `ticket` as an item of work that may go through various states. Let's 
start by naively adding a `boolean` property for each state that the ticket
might go through.

```sql
CREATE TABLE IF NOT EXISTS tickets {
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    is_in_progress BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_on_hold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
}
```

We can tell from the above migration that a ticket has four known states `open`, 
`completed`, `in_progress`, and `on_hold`. I say _known_ states as in the future
another state may appear, for example `pending_approval`. Using the above pattern
this would require yet another property to be added. But really all these properties
are communicating is the current `state` of a ticket. This is where an `enum`
would add value.

By using an `enum` all the properties used to communicate state can be combined
into one `state` property. This will also remove any logic needed to ensure that
a ticket is only in one state at any given time, which would be needed in the 
previous example.

An `enum` can be added as follows.

```sql
CREATE TYPE ticket_state AS ENUM ('open', 'completed', 'in_progress', 'on_hold')

CREATE TABLE IF NOT EXISTS tickets {
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state ticket_state DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
}
```

Notice that as well as reducing the number of properties needed. The state `enum`
can also default to `'open'`.

## Altering an Enum in PostgreSQL

<chicken-asks>
So what if in the future that `pending_approval` state is finally needed?
</chicken-asks>

<magpie-replies>
PostgreSQL makes updating enums easy. Just look at the example he put below.
</magpie-replies>

So let's say it's now six months down the line and having recieved some client
feedback it looks like a ticket should be _approved_ before it is sent to `complete`.

This will require a new database migration. Using PostgreSQL it would look like this.

```sql
ALTER TYPE ticket_state ADD VALUE 'pending_approval';
```

PostgreSQL also allows for the new value to be added above or below an existing value
like so.

```sql
ALTER TYPE ticket_state ADD VALUE 'pending_approval' BEFORE 'completed';
ALTER TYPE ticket_state ADD VALUE 'pending_approval' AFTER 'in_progress';
```

