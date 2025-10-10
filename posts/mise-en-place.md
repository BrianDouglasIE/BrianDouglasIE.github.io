---
title: mise-en-place
date: 10/10/2025
tags: [tools]
---

Everything should be rewritten in rust. Or so I'm told by all the vibe coders.
`mise` is a _dev tool manager_ that is super handy. I currently use it to manage
my dev projects. So the context of this article is my wsl ubuntu 24.04 instance.

<!-- more -->

<magpie-trinket>Give the `mise` project a like on github: [jdx/mise](https://github.com/jdx/mise)</magpie-trinket>

Need a certain node version?

```
mise install node@20.0.0
mise use node
```

Handy. But also you'll notice that the directory you ran that in now has a `mise.toml` file.
This is because mise installs but does not load the package. Meaning, only the current folder
and it's sub dirs have access to the node version you specified. Which is way handier than global
installs.

It can also manage env vars and define tasks, which again is super handy. So my advice to you is
to take 10-15 minutes out of your day and learn about this tool of tools. It will save you some time.
That is before the ai overlords remove your ability to _brain code_, or _brian code_ as I call it.

The only downside of this tool is I keep typing `mist`. So I'll probably have to vibe code a rewrite
in zig...