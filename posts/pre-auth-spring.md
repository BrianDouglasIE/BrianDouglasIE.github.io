---
title: "Checking ownership in Spring"
date: 12/05/2025
tags: [spring, java]
---

Say a forum user creates a post. Only that user, the owner, should be allowed to alter said post.

<!-- more -->

This means that in our application code a check should happen. Such a check might assert that the
`user_id` of the post in question is that of the currently authenticated user. To facilitate this
we might add a `PostSecurity` component with an `isOwner` method. This class will be something like
the one below.

```java
@Component
@AllArgsConstructor
public class PostSecurity {
    private final PostRepository postRepository;

    public boolean isOwner(Long id, String userEmail) {
        return postRepository.findById(id)
                .map(Post::getUser)
                .map(AppUser::getEmail)
                .map(it -> it.equals(userEmail))
                .orElse(false);
    }
}

```

This method finds the post with an id matching `postId`, gets the user attached to that post, then 
asserts whether the post's user's email matches the currently authenticated user. If the
`Optional<Post>` from `findById` is empty, then `false` is returned.

But now the question is, where should this method be called? Certainly it's not the 
`PostController` and calling it inside other `PostService` methods will lead to repetition and the
passing around of arguments unnecessarily.

Luckily the team at Spring Security have thought about writing clean code and have provided the
`PreAuthorize` annotation for such scenarios. This annotation is used to restrict access to methods
before they are invoked. This means that we can create the below `PostService` method to check auth
when accessing a `Post`.

<magpie-trinket>Remember to add the `@EnableMethodSecurity(prePostEnabled = true)` annotation to your `SecurityConfig` class.
This is a requirement for the `@PreAuthorize` annotation to work.</magpie-trinket>

```java
@PreAuthorize("@postSecurity.isOwner(#postId, authentication.name)")
public Post getOwnedPost(Long postId) {
    return postRepository.findById(postId)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));
}
```

This can then be called in the `PostController`.

```java
@GetMapping("/edit/{id}")
public String editPost(@PathVariable Long postId, Model model) {
    var post = postService.getOwnedPost(postId); // will throw when user is not the post's owner
    model.addAttribute("post", post);
    return "post/edit";
}
```

By keeping the ownership logic in the `PostService` it can be reused in other controllers and methods.
It also ensures that accessing a `Post` is done in a consistent and safe manner. The handling of the
ownership check has been delegated to the `PostSecurity` component which allows for a separation of
concerns.