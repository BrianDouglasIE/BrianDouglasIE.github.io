Using astyle to format C code
18/02/2025
c
---

I've been writing C with a bare bones neovim install. But I miss code formatting.

<!-- more -->

A quick google pointed me in the direction of two different C code formatters,
_indent_ by gnu and _astyle_ by someone else. I'm currently working on windows
so I ran a `choco search indent`. When it did not return anything that looked
like the package I wanted I searched instead for `astyle`. It was there, so my
decision was made.

A quick look at the docs and I see predefined format styles. I really like the
[_allman_](https://astyle.sourceforge.net/astyle.html#_style=allman) style. Broken
braces are the thinking man's braces. So now I format my C source code with this
neat command:

```
astyle --style=allman --recursive src/*.c
```

Everything looks nice and tidy. Still no need for a complicated IDE.
