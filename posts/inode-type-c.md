Get inode type in C
10/07/2025
c
---

Here is a string representation of a path. But tell me, is it a directory? is it a file? maybe it's a symlink?
perhaps there is nothing there at all.

<!-- more -->

Well below is a helper method to find out exactly what it is.

<magpie-trinket>The below method is called `get_inode_type` and uses a struct called `inode_type`. `inode` stands for _Index Node_.
An _Index Node_ is used to store information about a file, directory, etc.. at a certain path.</magpie-trinket>

The `get_inode_type` method below will return a `struct inode_type` if the path points to an existing inode. If
not it will return `NULL`. As you will see in the test cases the `inode_type` struct describes whether or not
the path points to a directory, file, or symlink. It also tells you if the symlink points to a directory or
file. Which is good to know.

## Header

```c
#ifndef INODE_TYPE_H
#define INODE_TYPE_H

#include <stddef.h>
typedef const char *Path;

typedef struct {
    int is_file;
    int is_dir;
    int is_link;
} inode_type;

inode_type *get_inode_type(Path path);

#define INODE_TYPE_H
```

## Implementation

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include "inode_type.h"

inode_type *get_inode_type(Path path) {
    inode_type *type = malloc(sizeof(inode_type));
    if(type == NULL) {
        perror("malloc");
        return NULL;
    }

    struct stat link_stat;
    if(lstat(path, &link_stat) == -1) {
        perror("lstat");
        free(type);
        return NULL;
    }

    type->is_link = S_ISLNK(link_stat.st_mode);

    struct stat st;
    if(stat(path, &st) == -1) {
        perror("stat");
        free(type);
        return NULL;
    }

    type->is_dir = S_ISDIR(st.st_mode);
    type->is_file = S_ISREG(st.st_mode);

    return type;
}
```

## Usage

```c
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "inode_type.h"

int main() {
  inode_type *test_dir = get_inode_type("./example_files");
  inode_type *test_file = get_inode_type("./example_files/hello_world.txt");
  inode_type *test_link = get_inode_type("./example_files/slink");
  inode_type *test_empty = get_inode_type("/does/not/exist");

  assert(test_dir->is_dir == 1);
  assert(test_dir->is_file == 0);
  assert(test_dir->is_link == 0);

  assert(test_file->is_dir == 0);
  assert(test_file->is_file == 1);
  assert(test_file->is_link == 0);

  assert(test_link->is_dir == 0);
  assert(test_link->is_file == 1);
  assert(test_link->is_link == 1);

  assert(test_empty == NULL);

  free(test_dir);
  free(test_file);
  free(test_link);
  free(test_empty);

  return 0;
}
```
