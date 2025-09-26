Slurp - A Java task runner
09/04/2025
java
---

Introducing Slurp 1.0. Slurp is a task runner for Java. It allows tasks, aka `Runnable` instances to be executed.

<!-- more -->

Slurp was created to be a super simple task runner. It has a lean feature set. Allowing you to register, execute,
and run a sequence of tasks.

<magpie-trinket>You can view the Slurp javadocs at [ie.briandouglas/slurp/](https://javadoc.io/doc/ie.briandouglas/slurp/latest/index.html)</magpie-trinket>

## Usage

### Create a SlurpTask

`SlurpTask`s are Java records. They have a `name` and a `runnable` property. Neither the `name` nor `runnable` property may be null.
You can create a `SlurpTask` like so.

```java
SlurpTask printHelloWorld = new SlurpTask("HelloWorld", () -> System.out.println("Hello World!"));
```

### Register and Execute a SlurpTask

Inorder to register a `SlurpTask` for excution a `Slurp` instance is needed. The `Slurp` instance allows for tasks to be registered and
executed.

```java
Slurp slurp = new Slurp();
SlurpTask printHelloWorld = new SlurpTask("HelloWorld", () -> System.out.println("Hello World!"));

slurp.registerTask(printHelloWorld);
slurp.executeTask(printHelloWorld);
```

Task names must be unique, if a duplicate task name is registered a `DuplicateTaskException` will be thrown. If an attempt is made to execute
an unknown task a `TaskNotFoundException` will be thrown.

### Executing a sequence of tasks

`Slurp` can be used to execute a sequence of tasks. Internally it uses a single threaded executor, and waits for each task to finish before
executing the next.

```java
String[] sendMarketingEmail = new String[] {
  "prepareClientList",
  "generateEmailHTML",
  "sendSpamMarketingEmail"
};

slurp.executeTaskSequence(sendMarketingEmail); // may also take a SlurpTask[]
```

## Source code

The source code for the `Slurp` task runner is available on github at [BrianDouglasIE/slurp](https://github.com/BrianDouglasIE/slurp).
