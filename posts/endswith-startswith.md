startswith and endswith
27/07/2025
c
---

Want to know if a file path ends with _.md_ or a message starts with _hello_? Well then I have
just the methods for you.

<!-- more -->

## endswith

Surely you can't start with endswith? Yes, I can and I will. Cause `endswith` is slightly easier in C.

Using some pointer arithmetic we take the needle length off the haystack plus haystack length to get the
end of the string. Then a quick `strcmp` finishes it off nicely.

```c
bool endswith(char *needle, char *haystack)
{
    size_t haystack_len = strlen(haystack);
    size_t needle_len = strlen(needle);
    if (needle_len > haystack_len || !needle_len || !haystack_len)
        return false;
    return !strcmp(haystack + haystack_len - needle_len, needle);
}

assert(endswith(".md", "hello.md"));
assert(!endswith(".md", "hello.txt"));
```

## startswith

`startswith` is slightly more involved as we must first create a `char[]` that is the length of the needle plus
one, think null terminator. We loop over the start of the haystack adding each char to you temp `char[]`, add
a quick null terminator and pass it to `strcmp`, boom!

```c
bool startswith(char *needle, char *haystack)
{
    size_t haystack_len = strlen(haystack);
    size_t needle_len = strlen(needle);
    if (needle_len > haystack_len || !needle_len || !haystack_len)
        return false;

    char start[needle_len + 1];
    for (size_t i = 0; i < needle_len; i++)
    {
        start[i] = haystack[i];
    }
    start[needle_len] = '\0';

    return !strcmp(start, needle);
}

assert(startswith("hello", "hello.md"));
assert(!startswith("hello", "yallohello.txt"));
```
