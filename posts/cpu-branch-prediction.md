---
title: Using CPU branch prediction in Java
tags: [java]
date: 03/04/2025
---

CPU branch prediction is when the CPU tries to guess the outcome of a conditional
operation, eg: an `if` statement, before it is executed. If it guesses correct then
the CPU can continue executing instructions without interuption.

<!-- more -->

When applied to Java this can be used to get a performance benefit. In particular
when looping through a large array that runs some condtional operation on each value.

<chicken-asks>So how do you make loop conditionals predictable?</chicken-asks>
<magpie-replies>Well we could sort the array before processing it</magpie-replies>

Sorting the values of an array before processing it will help with CPU branch prediction.
It may also help with cpu cache optimisation. CPU cache optimisation being the accessing
of data that from the CPU cache. This is memory located close to the CPU cores, data accessed
from here is often processed much quicker than from the main memory. This can be done in Java
by accessing data from a sorted array. The idea being that sorted data may be held closer together
in memory, and therefore can be accessed more quickly, providing a performance benefit.

## Example Usage

Let's see this in action with some example code. Given the following program, the sorted array will be
processed roughly 4 times faster than the unsorted array.

```java
import java.util.Random;

public class Main {

    public static void main(String[] args) {
        int arraySize = 10_000_000;

        int[] sortedArray = new int[arraySize];
        for (int i = 0; i < arraySize; i++) {
            sortedArray[i] = i;
        }

        long startTime = System.nanoTime();
        long sortedSum = evenNumberSum(sortedArray);
        long sortedTime = System.nanoTime() - startTime;

        int[] shuffledArray = shuffle(sortedArray);
        startTime = System.nanoTime();
        long unsortedSum = evenNumberSum(shuffledArray);
        long unsortedTime = System.nanoTime() - startTime;

        if (unsortedSum != sortedSum) {
            throw new Error("sortedSum and unsortedSum should match");
        }

        System.out.println("Sorted array processing time:   " + sortedTime + " ns");
        System.out.println("Unsorted array processing time: " + unsortedTime + " ns");
        System.out.println("Times faster: " + Math.floorDiv(unsortedTime, sortedTime));
    }

    /**
     * Returns a clone of the array with it's values shuffled.
     *
     * @param srcArray
     * @return
     */
    private static int[] shuffle(int[] srcArray) {
        Random rand = new Random();
        int[] array = srcArray.clone();

        for (int i = array.length - 1; i > 0; i--) {
            int randIndex = rand.nextInt(i + 1);
            int randIndexValue = array[randIndex];
            array[randIndex] = array[i];
            array[i] = randIndexValue;
        }

        return array;
    }

    /**
     * Returns the sum of all the even numbers in the array.
     *
     * @param array
     * @return
     */
    private static long evenNumberSum(int[] array) {
        long sum = 0;
        for (int value : array) {
            if (isEven(value)) {
                sum += value;
            }
        }
        return sum;
    }

    /**
     * Returns true if n is even and false if not.
     *
     * @param n
     * @return
     */
    private static boolean isEven(int n) {
        return n % 2 == 0;
    }
}
```

The above program creates an array of 10 million ints, sorted. It then iterates through that array to get
the sum of all the even ints, measuring the execution time. It then does the same thing with a shuffled
version of the initial sorted array. Running the program you should see that the sorted array is processed
much quicker than the unsorted array. Demonstrating the advantage of CPU branch prediction and cache optimisation.
Below is the result I get when running it locally.

```
Sorted array processing time:   8745547 ns
Unsorted array processing time: 37145149 ns
Times faster: 4
```

## Drawbacks

While I can't think of a drawback, other than the time spent sorting the array before processing it. There is
a caveat. It may not always give a benefit.

For example, if when processing the array, you ran something that wasn't easily predictable, eg: testing if a
number is a prime, you may not see much difference. While the sorted array would still be more _predictable_,
in practice the benefit of the prediction would be less significant as the majority of the numbers are likely
non prime and the check would fail early. So there will likely be use cases where you see a great benefit from
processing a sorted array, and some cases there you don't really see any benefit.

## Summary

Sorted arrays in Java benefit from CPU branch prediction and cache optimisation due to predictable
patterns and memory location.

In contrast, unsorted arrays suffer from the lack of predictability and random
memory access patterns.
