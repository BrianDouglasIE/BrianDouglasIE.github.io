---
title: Tower of Hanoi in Java
date: 25/03/2025
tags: [java]
---

The Tower of Hanoi is a commonly used coding interview question. The solution requires
the developer to write a recursive method.

<!-- more -->

<magpie-trinket>For a detailed explanation of the problem look at [wiki/Tower_of_Hanoi](https://en.wikipedia.org/wiki/Tower_of_Hanoi)</magpie-trinket>

Whilst it's not _that_ complex, it can be a tricky one to get your head around if you 
haven't seen it before, or are not familiar with recusive method calls. At an interview
recently I was asked to write an implementation of it using Java. Well I could use any
language, but I chose to use Java as the role was for a fullstack Spring dev. 

I was able to implement it successfully after struggling with parameter order for a couple
of minutes. I had the advantage of solving this problem before, thank you [exercism.io](https://exercism.org). 
So I had an idea of what needed to be done.

## Test Suite

Before I show you the implementation. I asked ChatGPT to generate a test suite using JUnit.
This is one of the great use cases for AI, they can write the boring code. I had to tune the
tests slightly to give the expected output. For example in my implementation I am writing out
the moves as Strings. Which was the interview requirement.

```java
package ie.briandouglas.tower_of_hanoi;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.util.List;

class TowerOfHanoiTest {

    @Test
    void testOneDisk() {
        TowerOfHanoi hanoi = new TowerOfHanoi();
        List<String> moves = hanoi.solve(1, 'A', 'C', 'B');
        assertEquals(1, moves.size());
        assertEquals("Move disk 1 from A to C", moves.get(0));
    }

    @Test
    void testTwoDisks() {
        TowerOfHanoi hanoi = new TowerOfHanoi();
        List<String> moves = hanoi.solve(2, 'A', 'C', 'B');
        assertEquals(3, moves.size());
        assertEquals("Move disk 1 from A to B", moves.get(0));
        assertEquals("Move disk 2 from A to C", moves.get(1));
        assertEquals("Move disk 1 from B to C", moves.get(2));
    }

    @Test
    void testThreeDisks() {
        TowerOfHanoi hanoi = new TowerOfHanoi();
        List<String> moves = hanoi.solve(3, 'A', 'C', 'B');
        assertEquals(7, moves.size());
        assertEquals("Move disk 1 from A to C", moves.get(0));
        assertEquals("Move disk 2 from A to B", moves.get(1));
        assertEquals("Move disk 1 from C to B", moves.get(2));
        assertEquals("Move disk 3 from A to C", moves.get(3));
        assertEquals("Move disk 1 from B to A", moves.get(4));
        assertEquals("Move disk 2 from B to C", moves.get(5));
        assertEquals("Move disk 1 from A to C", moves.get(6));
    }

    @Test
    void testZeroDisks() {
        TowerOfHanoi hanoi = new TowerOfHanoi();
        List<String> moves = hanoi.solve(0, 'A', 'C', 'B');
        assertTrue(moves.isEmpty());
    }

    @Test
    void testFiveDisks() {
        TowerOfHanoi hanoi = new TowerOfHanoi();
        List<String> moves = hanoi.solve(5, 'A', 'C', 'B');
        assertEquals(31, moves.size());
    }
}
```

## Implementation

The implementation here is pretty much the implementation you will see everywhere else.
The solve method recursively calls itself with `n - 1`, moving the nth largest disk, `from`,
to `to`. Then from `unused` to `to`. In this example `from` is the origin peg, `to` is the target,
and `unused` is the peg that is not involved.

I extracted the `constructMoveString` for readability, and created a method overload so that `solve`
could be called without instantiating an `ArrayList`.

```java
package ie.briandouglas.tower_of_hanoi;

import java.util.ArrayList;
import java.util.List;

public class TowerOfHanoi {

	public List<String> solve(int n, char from, char to, char unused, List<String> moves) {
		if (n > 0) {
			solve(n - 1, from, unused, to, moves);
			moves.add(constructMoveString(n, from, to));
			solve(n - 1, unused, to, from, moves);
		}
		return moves;
	}

	public List<String> solve(int n, char from, char to, char unused) {
		return solve(n, from, to, unused, new ArrayList<>());
	}

	private String constructMoveString(int disk, char from, char to) {
		return new StringBuilder().append("Move disk ").append(disk).append(" from ").append(from).append(" to ")
				.append(to).toString();
	}

}
```