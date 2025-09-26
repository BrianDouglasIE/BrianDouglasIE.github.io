Template strings as a view engine
17/08/2025
js
---

Template strings in JS can be used to create a view engine without adding any extra libraries.
So if you are creating a server side js app, think before you reach for handlebars, ejs, or
god forbid pug. Not becuase those are bad, pug is, but becuase it's so easy to leverage template
strings as a view engine.

<!-- more -->

I'm not evening going to bother with a proposed usage or a detailed explantation of what is going,
because it's so straight forward that it would be a waste of time. Get your eyeballs on the code
below, and see for yourself.

<magpie-trinket>Notice that he used `new Function` instead of `eval`. This means only the function body will be evaluated. It also allows for a clean way to pass vars to the view.</magpie-trinket>

```javascript
const layoutFile = Bun.file('./app.layout.html')
const bodyFile = Bun.file('./template.html')

function compileTemplate(template, vars) {
    return new Function(...vars, `return \`${template}\``)
}

const body = compileTemplate(await bodyFile.text(), ['name', 'hobbies'])
const layout = compileTemplate(await layoutFile.text(), ['data'])

const rendereredHTML = layout({
    title:'my page',
    body: body('brian', ['a', 'b', 'c'])
})
```

```html
<!-- template.html -->
<h1>Hello ${name}</h1>
<ul>${hobbies.map(hobby => `<li>${hobby}</li>`).join('')}</ul>
```

```html
<!-- app.layout.html -->
<html>
    <head>
        <title>${ data.title ?? 'default title'}</title>
    </head>
    <body>
        ${data.body}
    </body>
</html>
```
