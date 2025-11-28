---
title: Neovim 0.12 adds vim.pack
tags: [neovim]
date: 28/11/2025
---

It's a pain having to use external plugin managers for vim. It's always
ircked me, and now I'm glad to see the neovim has added a builtin plugin
manager as of 0.12.

<!-- more -->

As of writing, 0.12 is the dev release. But I've been using it with no issues.

<magpie-trinket>This YouTube video explains the feature much better than Brian, [How to use vim.pack](https://www.youtube.com/watch?v=UE6XQTAxwE0)</magpie-trinket>

The new feature is called _vim.pack_ and it has a super simple api consisting of _add_, _update_, and _del_.
This allows you to use lua to manage your plugins with ease.

So now to add plugins, take the url and pass it to _vim.pack.add_ with all your other plugin urls.

```lua
vim.pack.add({
  'https://github.com/neovim/nvim-lspconfig',
  'https://github.com/nvim-treesitter/nvim-treesitter',
  'https://github.com/nvim-lua/plenary.nvim',
  'https://github.com/nvim-telescope/telescope.nvim',
  -- and so on
})
```
