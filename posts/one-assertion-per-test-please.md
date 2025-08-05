---
title: One assertion per test please
date: 17/08/2024
tags: [js, testing]
---

Please! when you are writing tests try to limit each test case to one `expect`.
Let's refactor the monstrosity below to understand why fewer expects and more 
tests are better.

<!-- more -->

<magpie-trinket>
Try your best to write test cases as if they were telling a story.
Stick to one assertion per test, and split out any shared logic into
hooks, like <code>beforeEach</code> and <code>beforeAll</code>.
</magpie-trinket>

## The Monstrosity

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import MyComponent from './MyComponent';

test('User Name Submit Form', () => {
  const mockApiData = { user: 'John Doe' };
  const apiFetchMock = vi.fn(() => Promise.resolve(mockApiData));

  render(<MyComponent fetchData={apiFetchMock} />);

  const header = screen.getByText(/My Dashboard/i);
  expect(header).toBeInTheDocument();

  const button = screen.getByRole('button', { name: /Submit/i });
  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();

  const input = screen.getByPlaceholderText('Enter your name');
  expect(input).toBeInTheDocument();
  expect(input.value).toBe('');

  fireEvent.change(input, { target: { value: 'John Doe' } });
  expect(input.value).toBe('John Doe');

  expect(button).not.toBeDisabled();

  fireEvent.click(button);

  const successMessage = screen.getByText(/Success!/i);
  expect(successMessage).toBeInTheDocument();
});
```

Now you wouldn't know it at first glance but the above test case is used to validate
a form where the user can submit their name. The test technically works, but it does
not communicate it's intent.

I see code like this all the time. Especially when working with UI frameworks like
React, Angular, and Vue. Developers pile assertion upon assertion into one large 
test case. And when a new requirement comes along? they just add in yet another
assertion.

Why? because the set-up is _done_, and bulky, and they don't want to have to rewrite
or duplicate the work.

<chicken-asks>
So how do we fix this?
</chicken-asks>

<magpie-replies>
We break out each assertion into its own test.
</magpie-replies>

## The Refactor

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
import MyComponent from './MyComponent';

describe('User Name Submit Form', () => {
    let apiFetchMock;

    beforeEach(() => {
        const mockApiData = { user: 'John Doe' };
        apiFetchMock = vi.fn(() => Promise.resolve(mockApiData));

        render(<MyComponent fetchData={apiFetchMock} />);
    });

    test('renders header', () => {
        const header = screen.getByText(/My Dashboard/i);
        expect(header).toBeInTheDocument();
    });

    test('renders input field', () => {
        const input = screen.getByPlaceholderText('Enter your name');
        expect(input).toBeInTheDocument();
    });

    test('initial input field is empty', () => {
        const input = screen.getByPlaceholderText('Enter your name');
        expect(input.value).toBe('');
    });

    test('changes input value on user input', () => {
        const input = screen.getByPlaceholderText('Enter your name');
        fireEvent.change(input, { target: { value: 'John Doe' } });
        expect(input.value).toBe('John Doe');
    });

    test('renders submit button', () => {
        const button = screen.getByRole('button', { name: /Submit/i });
        expect(button).toBeInTheDocument();
    });

    test('submit button is disabled initially', () => {
        const button = screen.getByRole('button', { name: /Submit/i });
        expect(button).toBeDisabled();
    });

    test('submit button is enabled after input change', () => {
        const input = screen.getByPlaceholderText('Enter your name');
        fireEvent.change(input, { target: { value: 'John Doe' } });
        const button = screen.getByRole('button', { name: /Submit/i });
        expect(button).not.toBeDisabled();
    });
});

```

In the above refactor any shared test set up is broken out into a `beforeEach` hook
and each assertion is given its own test case.

The advantage of doing this becomes immediately clear. The tests now read like a 
story. We know exactly what the intent of each test case is, and  we only have to
read a small amount of code to understand the test's logic. To accentuate my point
about read ability. If we were to take the name of each test case and list it out
we would have the following verse.

```
User Name Submit Form
    renders header
    renders input field
    initial input field is empty
    changes input value on user input
    renders submit button
    submit button is disabled initially
    submit button is enabled after input change
```

This reads like a list of requirements. Which is essentially what UI tests are.
Compare this with the story the initial test gave us.

```
User Name Submit Form
```

Yea, not as descriptive. Who knows what that test does. Not me.

So in summary, try your best to write your test cases as if they were telling a 
story. Try to stick to one assertion per test, and split out any shared logic into
hooks, like `beforeEach` and `beforeAll`.