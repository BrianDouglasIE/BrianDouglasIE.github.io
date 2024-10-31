---
title: Using the form attribute on buttons
tags: [html]
date: 31/10/2024
---

HTML buttons have a form attribute that can be used with buttons of `type="submit"`.
The form attribute is used to target a specific form.

<!-- more -->

By default a button of type submit will submit the form that it is a child of.
In some cases it may be necessary to submit a form that the button is not a child
of. This is where the `form` attribute comes in to use.

<magpie-trinket>
The MDN docs for the form attribute can be found at <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form">HTML/Element/button#form</a>
</magpie-trinket>

## Example usage

Let's say we have a confirmation modal that appears when a button is clicked. This
could be to confirm whether or not a user wants to commit changes to a resource. It
is likely that the HTML for the modal dialogue is not contained within the original
form. So when the _confirm_ button is clicked inside the modal it will not submit the
original form. Unless of course JavaScript is used to listen for the confirm event.

Adding a form attribute to the _confirm_ button specifying which form to submit is a
much nicer way to solve this. For example the `button` below will submit the `form`
with an `id="updateResource"`. Without requiring any extra JavaScript.

```html
<button form="updateResource" type="submit">Confirm</button>
```
