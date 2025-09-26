Setting up PostgreSQL and Lua in Docker
31/12/2024
lua,docker,sql
---

I did a quick exploration into Lua after seeing is used in the CS50 game dev course.

<!-- more -->

<magpie-trinket>
The environment used for this tutorial is Ubuntu running inside WSL.
</magpie-trinket>

## Creating the PostgreSQL container

```
docker run --name postgres-1 -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:alpine
```

This command creates an instance of the `postgres:alpine` container. The `--name` flag is used to assign a name to the container.
The `-e` flag passes in the required environment variables. In this case a `POSTGRES_PASSWORD` is required. This will be used to
authenticate the `postgres` user. `-d` tells docker to run the command as a background process. Finally `-p` is used to expose
the port that postgres is running on. The default is `5432`, so we map the container's `5432` to `localhost:5432`.

## Create a database and add some content

### Access the PostgreSQL instance running inside the Docker container

```
docker exec -it postgres-1 psql -h localhost -p 5432 -U postgres
```

This command can be broken into two parts. The first part `docker exec -it postgres-1`, tells docker the execute the following
command inside our previously created container. The `-it` flag is a combination of `--interactive` and`--tty`. This tells
docker to take you straight inside the container.

The second part of the command `psql -h localhost -p 5432 -U postgres` takes us inside the postgres server. The `-h` flag
specifies the the host, `-p` specifies the port, and `-U` the user we want to login as.

Once the initial command is run you should see the postgres prompt. We can now create a database and populate it with some information.

### Create and modify database

Once inside the postgres instance we can use the following commands to create a database, add a table to
that database, and finally insert data into the table.

```
create database test;
```

The above command creates a database named "test". We can then connect to that database using the following command.

```
\c test;
```

Once connected we can run the following to add the `messages` table to the test database.

```
create table if not exists messages();
alter table messages add column id uuid not null primary key;
alter table messages add column content varchar(255);
insert into messages (id, content) values (uuid_generate_v4(), 'Hi, from postgres');
```

> Install the `uuid-ossp` extension with the following command `create extension if not exists "uuid-ossp";`

After successfully running the above our `test` database will now have some content which we will fetch with lua.

## Querying the database with Lua

### Installing luasql via LuaRocks

In order to connect to our postgres database with Lua, we will use the `luasql.postgres` rock.
To install this rock run the following command `luarocks install luasql-postgres`.

#### Fixing the `libpq-fe.h` install error on Ubuntu

If you are using Ubuntu to follow this tutorial, you may see the following error when running `luarocks install luasql-postgres`.

```
Error: Could not find header file for PGSQL
  No file libpq-fe.h in /usr/local/include
  No file libpq-fe.h in /usr/include
  No file libpq-fe.h in /include
You may have to install PGSQL in your system and/or pass PGSQL_DIR or PGSQL_INCDIR to the luarocks command.
```

This can be solved by passing the `PGSQL_INCDIR` property to the progam. Commonly the required value is
`/usr/include/postgresql/`. As that is the directory containing the `libpg-fe.h`.

Run the command as follows to successfully install `luasql-postgres`.

```
luarocks install luasql-postgres PGSQL_INCDIR=/usr/include/postgresql
```

### Writing a lua script to print the messages

Once `luasql-postgres` has successfully been installed, we can then write a Lua program to fetch records
from the database we created earlier.

Create a `main.lua` file and add the following.

```lua
-- load driver
local driver = require "luasql.postgres"
-- create environment object
env = assert (driver.postgres())
-- connect to data source
con = assert (env:connect("test"))
-- reset our table
cur = con:execute"SELECT * FROM messages;"
row = cur:fetch ({}, "a")
while row do
  print(string.format("MESSAGE: %s", row.content))
  -- reusing the table of results
  row = cur:fetch (row, "a")
end
-- close everything
cur:close() -- already closed because all the result set was consumed
con:close()
env:close()
```

### Run the script with the correct env variables

The script written inside our `main.lua` file expects that we supply some postgres variables when running it.
These are `PGUSER`, the user we want to connect to our database with. `PGPASSWORD`, the password set for the
user. `PGHOST`, the host we will use to access the server. And finally, `PGPORT`, the port number at which we
can access the postgres server.

```
PGUSER=postgres PGPASSWORD=password PGDATABASE=lua_messages PGHOST=localhost PGPORT=5432 lua main.lua
```

Running the above script should print out the content of the messages we added to our postgres database.
