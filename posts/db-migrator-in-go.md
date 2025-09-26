Writing a DB migrator in Go
30/09/2024
go
---

A database migrator applies database migrations. These are usually SQL scripts that
update the version of a database. They can be applied and reverted. Allowing for db
versions to be rolled back and pushed forward.

<!-- more -->

I feel that these should be simple tools, with simple commands. Migrate up a version,
migrate down a version, migrate to version x, migrate all pending migrations, and also
a reset command to remove all migrations. This is all I want. So I decided to make my
own, no bloat, no complexity, just simple useful commands.

Convert the above requirements to CLI commands and we get.

```
  -all
        Apply all pending migrations
  -down int
        Migrate down a certain number of versions
  -reset
        Revert all migrations
  -to int
        Migrate to a specific version
  -up int
        Migrate up a certain number of versions
```

<magpie-trinket>
He highlights some interesting bit's of code below. Well at least the parts he found interesting. If you want the full source code it
is available at <a href="https://github.com/BrianDouglasIE/go-lang-db-migrator">BrianDouglasIE/go-lang-db-migrator</a>.
</magpie-trinket>

## Assumptions

Let's assume the code in the sections below is part of a package called `migrator`, and that we will be
running the code from that package as a command line application. Let's also assume that the program has
recieved details about how to connect to the database, and uses the go `sql` package to connect.

## Command line options

This is intended to be a command line tool. Luckily Go's `flags` package makes this trivial.
I start by defining an `Options` struct in the `migrator` package.

```go
type Options struct {
	To    int
	Up    int
	Down  int
	All   bool
	Reset bool
}
```

Then inside `main.go` I can set the `Options` values like so. Notice the default values and description text.
All this info will be displayed when passing the `--help` flag.

```go
var opts migrator.Options
flag.BoolVar(&opts.All, "all", false, "Apply all pending migrations")
flag.BoolVar(&opts.Reset, "reset", false, "Revert all migrations")
flag.IntVar(&opts.To, "to", 0, "Migrate to a specific version")
flag.IntVar(&opts.Up, "up", 0, "Migrate up a certain number of versions")
flag.IntVar(&opts.Down, "down", 0, "Migrate down a certain number of versions")
flag.Parse()
```

A pointer to this struct will then be passed into the `migrator.Migrate` function.

## Structuring a migration

Typically a migration has an `up` and a `down` action. I've opted to use sql files for migrations
rather than an orm. I've done this to avoid complexity. The complexity being, having to learn the
nuances of an orm, when I already know what I want to achieve with sql.

The migrations will be stored in a `migrations` directory and each migration will have a `.up.sql`
and `.down.sql` file. The file naming convention will look like this `[version]-[name].[direction].sql`.
So, for example, our first migration will look as follows. **Note**: this migration will always need to
be first as it creates the table where our migration info will be stored.

```sql
-- 001-create-migrations-table.up.sql
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    version INTEGER NOT NULL,
    name TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 001-create-migrations-table.down.sql
DROP TABLE IF EXISTS migrations;
```

Our migrator program will read the `migrations` directory and gather the migration files into the
following `struct`.

```go
type Migration struct {
	Version  int
	Name     string
	UpFile   string
	DownFile string
}
```

This can then be used to sort migrations by version. Getting the latest migration from our `migrations`
table will tell us our current DB version. When running the `up` or `down` commands we need only concern
ourselves with the migrations that have a version that is higher or lower than the current db version
respectively. If a migration should be applied then execute the `UpFile` if it should be reverted then
execute the `DownFile`.

## Using transactions with context

Transactions in go can be used to commit or rollback multiple grouped sql queries.
The go docs at [database/execute-transactions](https://go.dev/doc/database/execute-transactions) sum up
transactions like so.

> A database transaction groups multiple operations as part of a larger goal.

The migrator program is doing just that. It takes a bunch of sql statements and runs them to create a
new database state. Should one of the migrations fail, we can use the go transaction to rollback the
state of the database to how it was before the migrator ran. Alternatively we can also commit the transaction
if all migrations run successfully.

We'll use the transaction along with a context. Using a Go `context.Context` with a database transaction helps
manage timeouts, cancellations, and ensures that long-running database operations are cleaned up with the context.
If the context is canceled any ongoing database transactions can be rolled back. This prevents partial data writes
or inconsistencies.

Using a transaction along with a context is trivial.

```go
// create context
ctx := context.Background()

// pass our context to the transaction
tx, err := db.BeginTx(ctx, nil)
if err != nil {
    return fail(err)
}

// defer rollback, will be called if `tx.Commit` is not
defer tx.Rollback()
```

This transaction can then be passed around out migrator program. Once all the migrations
have been handled, and assuming no errors have occured, the transaction can be committed
be calling `tx.Commit`. Any call to the trnasaction after it is commited will result in
an error. Commiting ends the transaction.

## Final thoughts

A db migrator should not be a complex program and it should not have a complex API. I looked
at some widely used libraries for managing migrations and I was struck by their complexity
and learning curve. Due to this I decided it better to create a simple package to achieve the
same end. It took around 90 minutes and helped me to better understand how migrations work. I
also now have my own tool to manage migrations, that I can bend to my liking.

Feel free to look through the entire source code at [BrianDouglasIE/go-lang-db-migrator](https://github.com/BrianDouglasIE/go-lang-db-migrator).
