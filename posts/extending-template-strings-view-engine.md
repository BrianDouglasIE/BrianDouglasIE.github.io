---
title: Template strings as a view engine - Part 2
tags: [js]
date: 20/08/2025
---

I been thinking some more about using template strings as a view engine. This blog for
example now uses the template engine shown below. It's quite simple to implement and it's
usage in html files is super intuitive. You just need to remember that the html you are
writing will be intepretted as a template string, and you already know how to use template
strings, so there is no overhead.

<!-- more -->

I've expanded on my last post to make it a more full featured engine. The below code adds
helper methods that can be called inside a template. For example, to include one template
in another you can use the `helper.include()` method. Which essentially allows you to use
partials and layouts.

It's possible to pass in any var name to use in the template. But I have settled on `data`
as a single object to hold all the relevant view _data_. This reduces cognitive load, as I
know each template has access to `data` and `helpers`.

The implementation below reads all the html files inside the _viewDir_ folder and registers
them as _views_. The same is true for all the html files in the _includesDir_ folder. This
Means that the `helpers.include()` method can pull in any template from the includes dir.
Likewise `view` will render any file from the `viewDir`.

Implementation and example usage below.

## Usage

```html
<!-- index.html -->
<html>
    <head>
        <title>${ data.title ?? 'default title'}</title>
    </head>
    <body>
        <h2>Post List</h2>
        ${helpers.include('post-list', { posts })}
    </body>
</html>
```

```html
<!-- includes/post-list.html -->
<ul>
    ${data.posts.map(post => `
        <li>${post.title}</li>
    `).join('')}
</ul>
```

## Implementation

```javascript
import {readFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {join} from 'node:path'

const outDir = './docs'
const viewDir = './views'
const includeDir = join(viewDir, './includes')

/*
 * View engine
 */

const views = {}
const includes = {}

const templateHelpers = {
    include: (name, data) => includes[name](data),
    // add methods here to make them available in templates
}

function compileTemplate(template, ...varNames) {
    const fn = new Function('helpers', ...varNames, `return \`${template}\``)
    return (...args) => fn(templateHelpers, ...args)
}

for (const entry of await readdir(includeDir)) {
    if (!entry.endsWith('.html')) continue

    includes[entry.replace('.html', '')] = compileTemplate(await readFile(join(includeDir, entry)), 'data')
}

for (const entry of await readdir(viewDir)) {
    if (!entry.endsWith('.html')) continue

    views[entry.replace('.html', '')] = compileTemplate(await readFile(join(viewDir, entry), 'utf8'), 'data')
}

function view(name, data) {
    return views[name](data)
}
```
