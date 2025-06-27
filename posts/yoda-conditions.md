---
title: Yoda Conditions
date: 01/04/2025
tags: [c, programming]
---

When I write a comparison statement I nearly always write it variable first, value second.

<!-- more -->

But this is a silly habit to have. It should be value first, variable second. This is often
refered to as a _Yoda condition_. Due to the little green jedi's peculiar way of talking.

<magpie-trinket>[wiki/Yoda_conditions](https://en.wikipedia.org/wiki/Yoda_conditions) does a better job of explaining this than him.</magpie-trinket>

Here is a quick example of how Yoda condtions work. Given the following statement:

```c
if(age < 18) { /* you can't drink here */ }
```

The Yoda condition equivalent would be:

```c
if(18 > age) { /* you can't drink here */ }
```

<chicken-asks>That looks odd to me, what is the advantage?</chicken-asks>
<magpie-replies>Mostly it will catch an unwanted assignment.</magpie-replies>

## Why bother?

Well look at this code:

```c
if(animal = "dog") { /* wag tail */ }
```

This checks if the animal is a dog, and then does something. 

Oh actually, no it doesn't. It assigns the value of animal to be "dog". Which is not what
I wanted. But it's a mistake that wouldn't be imediately obvious to me either.

It's this sort of thing that Yoda conditions prevent. If I was to make that mistake using
Yoda conditons. Then the following code would throw an error.

```c
if("dog" = animal) { /* wag tail */ }
```

The error:

```
.\animal.c:12:10: error: assignment to expression with array type
   12 | if("dog" = animal) {
      |          ^
```

Now I don't have to debug my code and pull my hair out. The issue is clear, thanks Yoda.
