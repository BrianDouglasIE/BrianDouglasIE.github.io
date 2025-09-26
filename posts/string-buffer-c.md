Making a StringBuffer in C
15/07/2025
c
---

I've been writing a lot of C. Whilst doing so I have been questioning my sanity.
Am I an awful programmer? You know what, I think I might be.

Kudos to all those devs that created monumental feats with C. Because it is not
an easy tool to use. That said, I do enjoy writing C, just as long as I don't
have a deadline or any business critical software to deliver. But when I say enjoy, I mean
enjoyment in the sense of using a sycthe to cut a lawn, whilst my lawnmower watches on.
It's lovely using the sycthe, but at the end of the day when I am exhausted and cut
only a quarter of the grass that I could have cut with a mower in half the time, I do feel
a great sense of achievement. I'm exhausted and broken, but happy.

<!-- more -->

## StringBuffer

Anyway here is a string buffer implementation that I extracted from my project. You can see
the up to date source code at [BrianDouglasIE/c_string_buffer](https://github.com/BrianDouglasIE/c_string_buffer).

The replace and remove were particularly tricky to implement. My brain was on fire trying to figure out
how to juggle the memory about correctly.

### Header

```c
#ifndef STRING_BUFFER_H
#define STRING_BUFFER_H

#include <stddef.h>

/// @brief A dynamic string buffer that supports common string operations.
typedef struct {
  size_t size;     ///< The current size (length) of the string.
  size_t capacity; ///< The total allocated capacity of the buffer.
  char *data;      ///< Pointer to the character data.
} StringBuffer;

/// @brief Represents all positions where a match was found.
typedef struct {
  size_t *positions; ///< Array of match positions.
  size_t count;      ///< Number of matches found.
} MatchResult;

/// @brief Represents the result of splitting a string.
typedef struct {
  char **parts; ///< Array of substrings resulting from the split.
  size_t count; ///< Number of parts.
} SplitResult;

// Lifecycle

/// @brief Initializes a new, empty StringBuffer.
/// @return A pointer to the newly allocated StringBuffer.
StringBuffer *StringBuffer_init();

/// @brief Frees memory used by the given StringBuffer.
/// @param buf Pointer to the StringBuffer to be freed.
void StringBuffer_free(StringBuffer *buf);

/// @brief Clears the contents of the StringBuffer without freeing the object.
/// @param buf Pointer to the StringBuffer to be cleared.
void StringBuffer_clear(StringBuffer *buf);

// Operations

/// @brief Prints the contents of the StringBuffer to stdout.
/// @param buf Pointer to the StringBuffer to be printed.
void StringBuffer_print(const StringBuffer *buf);

/// @brief Appends text to the end of the StringBuffer.
/// @param buf Pointer to the StringBuffer.
/// @param text Null-terminated string to append.
void StringBuffer_append(StringBuffer *buf, const char *text);

/// @brief Prepends text to the beginning of the StringBuffer.
/// @param buf Pointer to the StringBuffer.
/// @param text Null-terminated string to prepend.
void StringBuffer_prepend(StringBuffer *buf, const char *text);

/// @brief Removes the first occurrence of text from the buffer starting from a given index.
/// @param buf Pointer to the StringBuffer.
/// @param text Null-terminated string to remove.
/// @param from Index to start the search from.
void StringBuffer_remove(StringBuffer *buf, const char *text, size_t from);

/// @brief Replaces the first occurrence of a substring with another string, starting from a given index.
/// @param buf Pointer to the StringBuffer.
/// @param original Substring to be replaced.
/// @param update Replacement string.
/// @param from Index to start the search from.
void StringBuffer_replace(StringBuffer *buf, const char *original,
                          const char *update, size_t from);

// Search & Split

/// @brief Finds the index of the first occurrence of text starting from a given index.
/// @param buf Pointer to the StringBuffer.
/// @param text Substring to search for.
/// @param from Index to start the search from.
/// @return The index of the first occurrence, or -1 if not found.
int StringBuffer_index_of(const StringBuffer *buf, const char *text,
                          size_t from);

/// @brief Finds all occurrences of a substring starting from a given index.
/// @param buf Pointer to the StringBuffer.
/// @param text Substring to match.
/// @param from Index to start the search from.
/// @return A pointer to a MatchResult containing all match positions.
MatchResult *StringBuffer_match_all(const StringBuffer *buf, const char *text,
                                    size_t from);

/// @brief Splits the buffer into parts using the given delimiter.
/// @param buf Pointer to the StringBuffer.
/// @param delimiter String delimiter to split by.
/// @return A pointer to a SplitResult containing the parts.
SplitResult *StringBuffer_split(const StringBuffer *buf, const char *delimiter);

// Cleanup

/// @brief Frees the memory used by a MatchResult.
/// @param matches Pointer to the MatchResult to free.
void MatchResult_free(MatchResult *matches);

/// @brief Frees the memory used by a SplitResult.
/// @param split Pointer to the SplitResult to free.
void SplitResult_free(SplitResult *split);

#endif
```

## Implementation

```c
#include "string_buffer.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INITIAL_CAPACITY 16

static int ensure_capacity(StringBuffer *buf, size_t required) {
  if (required <= buf->capacity)
    return 1;

  size_t new_capacity = buf->capacity ? buf->capacity : INITIAL_CAPACITY;
  while (new_capacity < required) {
    new_capacity *= 2;
  }

  char *new_data = realloc(buf->data, new_capacity);
  if (!new_data) {
    perror("realloc");
    return 0;
  }

  buf->data = new_data;
  buf->capacity = new_capacity;
  return 1;
}

StringBuffer *StringBuffer_init() {
  StringBuffer *buf = malloc(sizeof(StringBuffer));
  if (!buf) {
    perror("malloc");
    return NULL;
  }

  buf->size = 0;
  buf->capacity = 0;
  buf->data = NULL;
  return buf;
}

void StringBuffer_free(StringBuffer *buf) {
  if (!buf)
    return;
  free(buf->data);
  free(buf);
}

void StringBuffer_clear(StringBuffer *buf) {
  if (!buf || !buf->data)
    return;
  buf->data[0] = '\0';
  buf->size = 0;
}

void StringBuffer_print(const StringBuffer *buf) {
  if (!buf || !buf->data)
    return;
  printf("size: %zu\n", buf->size);
  printf("data: %s\n", buf->data);
}

void StringBuffer_append(StringBuffer *buf, const char *text) {
  if (!buf || !text)
    return;

  size_t text_len = strlen(text);
  if (!ensure_capacity(buf, buf->size + text_len + 1))
    return;

  memcpy(buf->data + buf->size, text, text_len + 1);
  buf->size += text_len;
}

void StringBuffer_prepend(StringBuffer *buf, const char *text) {
  if (!buf || !text)
    return;

  size_t text_len = strlen(text);
  if (!ensure_capacity(buf, buf->size + text_len + 1))
    return;

  memmove(buf->data + text_len, buf->data,
          buf->size + 1);
  memcpy(buf->data, text, text_len);
  buf->size += text_len;
}

int StringBuffer_index_of(const StringBuffer *buf, const char *text,
                          size_t from) {
  if (!buf || !text || !buf->data || from >= buf->size)
    return -1;

  char *match = strstr(buf->data + from, text);
  return match ? (int)(match - buf->data) : -1;
}

MatchResult *StringBuffer_match_all(const StringBuffer *buf, const char *text,
                                    size_t from) {
  if (!buf || !text || !buf->data || from >= buf->size)
    return NULL;

  MatchResult *matches = malloc(sizeof(MatchResult));
  if (!matches)
    return NULL;
  matches->positions = NULL;
  matches->count = 0;

  int index = StringBuffer_index_of(buf, text, from);
  while (index != -1) {
    size_t *new_positions =
        realloc(matches->positions, sizeof(size_t) * (matches->count + 1));
    if (!new_positions) {
      MatchResult_free(matches);
      return NULL;
    }

    matches->positions = new_positions;
    matches->positions[matches->count++] = index;
    index = StringBuffer_index_of(buf, text, index + 1);
  }

  return matches;
}

void StringBuffer_remove(StringBuffer *buf, const char *text, size_t from) {
  if (!buf || !text || !buf->data || from >= buf->size)
    return;

  size_t text_len = strlen(text);
  int index = StringBuffer_index_of(buf, text, from);

  while (index != -1) {
    size_t tail_len = buf->size - (index + text_len);
    memmove(buf->data + index, buf->data + index + text_len, tail_len + 1);
    buf->size -= text_len;
    index = StringBuffer_index_of(buf, text, index);
  }
}

void StringBuffer_replace(StringBuffer *buf, const char *original,
                          const char *update, size_t from) {
  if (!buf || !original || !update || !buf->data || from >= buf->size)
    return;

  size_t original_len = strlen(original);
  size_t update_len = strlen(update);
  if (original_len == 0 || update_len == (size_t)-1)
    return;

  int index = StringBuffer_index_of(buf, original, from);

  while (index != -1) {
    if (update_len > original_len) {
      if (!ensure_capacity(buf, buf->size + (update_len - original_len) + 1))
        return;
    }

    size_t tail_len = buf->size - (index + original_len);
    memmove(buf->data + index + update_len, buf->data + index + original_len,
            tail_len + 1);
    memcpy(buf->data + index, update, update_len);
    buf->size = buf->size - original_len + update_len;

    index = StringBuffer_index_of(buf, original, index + update_len);
  }
}

SplitResult *StringBuffer_split(const StringBuffer *buf,
                                const char *delimiter) {
  if (!buf || !delimiter || !buf->data)
    return NULL;

  char *copy = strdup(buf->data);
  if (!copy)
    return NULL;

  SplitResult *result = malloc(sizeof(SplitResult));
  if (!result) {
    free(copy);
    return NULL;
  }

  result->parts = NULL;
  result->count = 0;

  char *token = strtok(copy, delimiter);
  while (token) {
    char **tmp = realloc(result->parts, sizeof(char *) * (result->count + 1));
    if (!tmp) {
      SplitResult_free(result);
      free(copy);
      return NULL;
    }
    result->parts = tmp;
    result->parts[result->count] = strdup(token);
    if (!result->parts[result->count]) {
      SplitResult_free(result);
      free(copy);
      return NULL;
    }
    result->count++;
    token = strtok(NULL, delimiter);
  }

  free(copy);
  return result;
}

void MatchResult_free(MatchResult *matches) {
  if (!matches)
    return;
  free(matches->positions);
  free(matches);
}

void SplitResult_free(SplitResult *split) {
  if (!split)
    return;
  for (size_t i = 0; i < split->count; i++) {
    free(split->parts[i]);
  }
  free(split->parts);
  free(split);
}
```

## Tests

```c
#include "string_buffer.h"

#include <assert.h>
#include <string.h>

int main(void) {
  StringBuffer *buf = StringBuffer_init();
  assert(buf != NULL);

  StringBuffer_append(buf, "hello");
  assert(buf->size == 5);
  assert(strcmp(buf->data, "hello") == 0);

  StringBuffer_append(buf, " world");
  assert(buf->size == 11);
  assert(strcmp(buf->data, "hello world") == 0);

  assert(StringBuffer_index_of(buf, "hello", 0) == 0);
  assert(StringBuffer_index_of(buf, "world", 0) == 6);
  assert(StringBuffer_index_of(buf, "mars", 0) == -1);
  assert(StringBuffer_index_of(buf, "llo", 2) == 2);
  assert(StringBuffer_index_of(buf, "hello", 99) == -1);
  assert(StringBuffer_index_of(buf, "hello", buf->size) == -1);
  assert(StringBuffer_index_of(buf, "d", buf->size - 1) ==
         (int)(buf->size - 1));
  assert(StringBuffer_index_of(buf, "h", 1) == -1);

  MatchResult *mr = StringBuffer_match_all(buf, "l", 0);
  if (!mr) {
    return -1;
  }
  assert(mr->count == 3);
  assert(mr->positions[0] == 2);
  assert(mr->positions[1] == 3);
  assert(mr->positions[2] == 9);
  MatchResult_free(mr);

  SplitResult *sr = StringBuffer_split(buf, " ");
  assert(sr->count == 2);
  assert(strcmp(sr->parts[0], "hello") == 0);
  assert(strcmp(sr->parts[1], "world") == 0);
  SplitResult_free(sr);

  StringBuffer_prepend(buf, "hello ");
  assert(buf->size == 17);
  assert(strcmp("hello hello world", buf->data) == 0);

  StringBuffer_remove(buf, " ", 0);
  assert(buf->size == 15);
  assert(strcmp("hellohelloworld", buf->data) == 0);

  StringBuffer *remove_overlap_test = StringBuffer_init();
  StringBuffer_append(remove_overlap_test, "lalalalala");
  StringBuffer_remove(remove_overlap_test, "ala", 0);
  assert(strcmp(remove_overlap_test->data, "llla") == 0);
  assert(remove_overlap_test->size == 4);
  StringBuffer_free(remove_overlap_test);

  StringBuffer_replace(buf, "hellohello", "hello ", 0);
  assert(buf->size == 11);
  assert(strcmp("hello world", buf->data) == 0);

  StringBuffer *replace_overlap_test = StringBuffer_init();
  StringBuffer_append(replace_overlap_test, "lalalalala");
  StringBuffer_replace(replace_overlap_test, "ala", "", 0);
  assert(strcmp(replace_overlap_test->data, "llla") == 0);
  assert(replace_overlap_test->size == 4);
  StringBuffer_free(replace_overlap_test);

  StringBuffer_clear(buf);
  assert(buf->size == 0);
  assert(strlen(buf->data) == 0);

  StringBuffer_free(buf);
  return 0;
}
```
