Partial function implementation
25/11/2024
js
---

Partial function implementation is a functional programming technique that
can be used to create many functions from one, by binding fixed arguments.

<!-- more -->

<magpie-trinket>
Another name for this is <i>currying</i>. You can read more about it at
<a href="https://en.wikipedia.org/wiki/Currying">wiki/currying</a>.
</magpie-trinket>

## Example

The common way of explaining this is by using the following math example.
Say we have a function called `add(a: number, b: number)`. We could use this
to create a function called `addOne` by binding one as the first argument
like so:

```typescript
const add = (a: number, b: number) => a + b
const addOne = partial(add, 1)

addOne(2) // 3
```

The above is a naive example, but I'm sure that you can see how this would
be of benefit in more complex examples. Perhaps it could be use to build
up config methods in your application or to create methods that work on a
certain instance of an object, where you cannot modify the source code.

## Implementation

Implementing a method that can partially apply arguments to other methods is
somewhat trivial thanks to ECMAScript's syntactic sugar.

Below is a Typed and untyped example.

```typescript
// Untyped
const partial = (fn, ...fixedArgs) => (...args) => fn(...fixedArgs, ...args)

// Typed... and ugly
function partial<T, U extends any[], V extends any[]>(
  fn: (...args: [...U, ...V]) => any,
  ...fixedargs: U
): (...args: V) => any {
  return (...args: V) => fn(...fixedargs, ...args);
}
```

There is possibly a nicer way to type this, that does not use `any`. However I don't
feel like wrestling with the type system. Mainly because the use of `partial` implementation
lends itself better to loosely typed programming.
