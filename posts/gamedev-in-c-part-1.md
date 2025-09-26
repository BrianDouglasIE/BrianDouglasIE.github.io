GameDev in C Part 1: Hello World
21/01/2025
c,raylib,gamedev
---

This is the start of a new blog series. I will be documenting
my journey into building a game in C using [Raylib](https://www.raylib.com/).

This post details installing a C compiler and running a simple
program.

<!-- more -->

## I'll be upfront

For brevity I have given the post the subtitle _Hello World_.
The unabreviated title is _why the fuck is this so hard_.

Basically it took me waaay to long to install a C compiler, compile
a file using make, and then run that file to print "Hello World".
It gave me flash backs to my first year at uni trying to do the same
thing. It wasn't easy then either. But now, 12 years of professional
software engineering later, it's still a pain. A pain which I have
documented below. In the hope that it will help someone on their
journey to run and compile a basic C program. Realistically it will
only ever  help future Brian.

## How do I install gcc?

<magpie-trinket>
Note: Windows 11 is the operating system used. The shell is PowerShell.
</magpie-trinket>

I'm on Windows and I use [chocolatey](https://chocolatey.org/) as a package
manager. So the first step is get chocolatey installed. Then run PowerShell
as an admin. As an ADMIN, remember that, or like me you'll have to search in
windows for the terminal and then right click the icon and select "run as admin".
There is no sudo here.

Now I bet you are thinking I just run `choco  install gcc`. Well you would be wrong.
In windows `gcc` is made available through [MingW](https://www.mingw-w64.org/). So
the command we run to  install `gcc` is:

```
choco install mingw
```

## make build

It's entirely possible to compile and run a simple program using `gcc` alone. But I
want some sort of build system. So let's install make:

```
choco install make
```

The first program I want to run is as follows.

```c
// main.c
#include <stdio.h>

int main() {
   printf("Hello, World!");
   return 0;
}
```

Now it's here I make a time costing mistake. I use the following command to compile
the program.

```
gcc main.c -o build.exe
```

A seasoned C programmer will see the problem straight away. Not me. The command generates
`build.exe`. Now I run it with `./build.exe`. I should see "Hello, World!" printed to the
console. Instead I see the following.

```
Program 'build.exe' failed to run: The specified executable is not a valid application for this OS platform.At line:1
char:1
+ .\build.exe
+ ~~~~~~~~~~~.
At line:1 char:1
+ .\build.exe
+ ~~~~~~~~~~~
    + CategoryInfo          : ResourceUnavailable: (:) [], ApplicationFailedException
    + FullyQualifiedErrorId : NativeCommandFailed
```

Ok, so the error is telling me that the specified executable is not correct for the OS.
So do I add `-m64` and make the command `gcc -m64 -c main.c -o build.exe`? Nope same
error. So fast forward 2 hours, and I figure it out.

```
-c                       Compile and assemble, but do not link.
```

The `-c` flag is not needed. So I run:

```
gcc -c main.c -o build.exe
```

And voila `build.exe` prints "Hello, World!" to the console. Now I add the following
content to my make file.

```
build : main.o
	gcc -o build.exe main.o

main.o : main.c
	gcc -c main.c

clean :
	powershell Remove-Item *.exe, *.o
```

This allows me to run useful commands like `make clean`, and `make build`.

And that's a wrap for part 1. Tomorrow I will look at adding raylib to the project.
