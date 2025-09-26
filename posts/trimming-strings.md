Trimming strings in c
18/07/2025
c
---

Strings in C. They are wonderfully intuitive and easy to work with *cough*.

No, strings in C are a nightmare. Doing simple things such as trimming the
whitespace off the start or end of a string is complicated. Because a string
is not a string it's a `char *`. Which means that if you want to do interesting
things you are going to have to get used to managing memory. Which means thinking,
and if there is one thing modern programmers hate, it's thinking.

Anyway, below I have added `ltrim_string`, `rtrim_string`, and `trim_string` methods.
I've made the code as readable as I can, and documented it with tests.

<!-- more -->

## Code

The trim methods below will return an pointer to a new `char *`. So the result of
these methods will need freeing. I've opted to return a `nullptr` when the supplied
`char *` is null, or if memory allocation fails. If the string only contains whitespace,
I return an empty string.

<magpie-trinket>
<span><strong>ltrim_string</strong>: removes whitespace from the start of the string.</span><br>
<span><strong>rtrim_string</strong>: removes whitespace from the end of the string.</span><br>
<span><strong>trim_string</strong>: removes whitespace from the start and end of the string.</span>
</magpie-trinket>

```c
#include <string.h>
#include <ctype.h>
#include <stdlib.h>
#include <assert.h>

char *empty_string()
{
  char *str = malloc(1);
  if(!str) return nullptr;
  str[0] = '\0';
  return str;
}

char *ltrim_string(char *str)
{
  if(!str) return nullptr;

  size_t len = strlen(str);
  if(!len) return empty_string();

  size_t start = 0;
  while(start < len && isspace(str[start])) start++;

  if(start >= len) return empty_string();

  size_t new_size = len - start;
  char *result = malloc(new_size);
  if (!result) return nullptr;

  memcpy(result, str + start, new_size);
  result[new_size] = '\0';

  return result;
}

char *rtrim_string(char *str)
{
  if(!str) return nullptr;

  size_t len = strlen(str);
  if(!len) return empty_string();

  size_t end = len - 1;
  while(end && isspace(str[end])) end--;

  if(0 >= end) return empty_string();

  size_t new_size = end + 1;
  char *result = malloc(new_size);
  if (!result) return nullptr;

  memcpy(result, str, new_size);
  result[new_size] = '\0';

  return result;
}

char *trim_string(char *str)
{
  if (!str) return nullptr;

  size_t len = strlen(str);
  if(!len) return empty_string();

  size_t start = 0;
  while(isspace(str[start])) start++;

  size_t end = len - 1;
  if(start >= end) return empty_string();
  while(end && isspace(str[end])) end--;

  size_t new_size = end - start + 1;
  char *result = malloc(new_size + 1);
  if(!result) return nullptr;

  memcpy(result, str + start, new_size);
  result[new_size] = '\0';

  return result;
}

int main(void)
{
  // ltrim
  char *test_str = ltrim_string("   hello   ");
  assert(test_str && 0 == strcmp("hello   ", test_str));
  free(test_str);

  test_str = ltrim_string("\r\nhello\n");
  assert(test_str && 0 == strcmp("hello\n", test_str));
  free(test_str);

  // rtrim
  test_str = rtrim_string("   hello   ");
  assert(test_str && 0 == strcmp("   hello", test_str));
  free(test_str);

  test_str = rtrim_string("\r\nhello\n");
  assert(test_str && 0 == strcmp("\r\nhello", test_str));
  free(test_str);

  // trim
  test_str = trim_string("   hello   ");
  assert(test_str && 0 == strcmp("hello", test_str));
  free(test_str);

  test_str = trim_string("\r\nhello\n");
  assert(test_str && 0 == strcmp("hello", test_str));
  free(test_str);

  // empty strings
  test_str = ltrim_string("    ");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  test_str = ltrim_string("");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  test_str = rtrim_string("    ");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  test_str = rtrim_string("");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  test_str = trim_string("    ");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  test_str = trim_string("");
  assert(test_str && 0 == strcmp("", test_str));
  free(test_str);

  assert(trim_string(nullptr) == nullptr);

  return 0;
}
 ```
