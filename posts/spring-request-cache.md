---
title: "Request cache in Spring"
date: 19/05/2025
tags: [ spring, java ]
---

Let's say we have a request that fetches a post stored in the database. That request may need
to alter the fetched post in some way. Before the post is altered various checks may need to
happen, such as an ownership check. But we want to avoid each check fetching the same post
from the database. This is when a cache that is scoped to a request's life cycle comes in handy.

<!-- more -->

In a [previous post](/pre-auth-spring) I introduced a method for carrying out ownership checks
using Spring Security's `@PreAuthorize` annotation. Whilst the approach was clean and maintainable
it did introduce a performance issue. This is because `@PreAuthorize` executes before the method body. 
The post is fetched during the security check, and then again inside the method. This leads to duplicate 
fetches from the database. Once in the `isOwner` call and then again in the `findOwnedPost` call. You 
can see for yourself in the below code example.

```java
@Component
@AllArgsConstructor
public class PostSecurity {
    private final PostRepository postRepository;

    public boolean isOwner(Long id, String userEmail) {
        return postRepository.findById(id) // first fetch
                .map(Post::getUser)
                .map(AppUser::getEmail)
                .map(it -> it.equals(userEmail))
                .orElse(false);
    }
}
```

```java
@PreAuthorize("@postSecurity.isOwner(#postId, authentication.name)")
public Post getOwnedPost(Long postId) {
    return postRepository.findById(postId) // second fetch
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));
}
```

One simple way to avoid this would be to do the ownership check inside the `getOwnedPost` method.
This may seem straightforward, but it would lead to code that is harder to maintain. For example
the authenticated `UserDetails` would need to be passed around, and a checked exceptions would need
added to each caller... yuck.

A nice solution would be to cache the owned post instance for the lifecycle of the request. This would
mean that the `isOwner` method would cache the post on look up. The post could then be retrieved from
the cache inside the `getOwnedPost` method. Meaning that there is only one post look up. We would then
add a request filter to clear the cache after each request.

## Using a request based cache

Each Spring request uses it's own thread. This means that we can cache values for the current request's
thread, without affecting any other request. To do this we'll use a plain old java object to model our
`RequestCache`. I want to use this solution for different entity types, so I'll make it generic by making 
it a generic class, so it can hold any type of entity.

```java
public class RequestCache<T> {
    private final ThreadLocal<Optional<T>> holder = new ThreadLocal<>();

    public void set(T value) {
        holder.set(Optional.ofNullable(value));
    }

    public Optional<T> get() {
        return holder.get();
    }

    public void clear() {
        holder.remove();
    }
}
```

<magpie-trinket>In some contexts like asynchronous processing, you may need `InheritableThreadLocal` or a 
more advanced request-scoped solution like Spring’s `@RequestScope`. But for typical synchronous requests, 
`ThreadLocal` works well.</magpie-trinket>

Now let's create a `RequestCacheRegistry`. This will be a `@Component` to allow it to be injected into
the various services that will use it. You will be able to see at this stage how this approach can be
extended to work with various entities, by adding a unique `RequestCache` property for each cached item.

```java
@Getter
@Component
public class RequestCacheRegistry {
    public final RequestCache<Post> ownedPost = new RequestCache<>();

    public void clearAll() {
        ownedPost.clear();
    }
}
```

Now that our `RequestCacheRegistry` has been set up, we can use it within our `PostService`. First we'll
need to modify the `PostSecurity` component to cache the post that is returned from the `PostRepository`.
As the `PostRepository` returns an `Optional<Post>` the cache can be updated in a chained `map` call.

```java
@Component
@AllArgsConstructor
public class PostSecurity {
    private final PostRepository postRepository;
    private final RequestCacheRegistry requestCacheRegistry;

    public boolean isOwner(Long id, String userEmail) {
        return postRepository.findById(id)
                .filter(it -> it.getUser().getEmail().equals(userEmail))
                .map(it -> {
                    requestCacheRegistry.getOwnedPost().set(it); // cache post
                    return true;
                })
                .orElse(false);
    }
}
```

Now that the `requestCacheRegisty.ownedPost` is set. It can be access inside the `getOwnedPost` method that
has the `PreAuthorize` annotation.

```java
@PreAuthorize("@postSecurity.isOwner(#postId, authentication.name)")
public Post getOwnedPost(Long postId) {
    return requestCacheRegistry.getOwnedPost().get().orElseGet(() -> findById(postId));
}
```

With all this in place there is now only one database call to fetch the required post. We have also implemented
a pattern that will allow for other entities to be cached in the same way, using the `RequestCacheRegistry`.

## Clearing the cache

It is important that we clear the request cache after each request completes. This will help prevent any thread
leaks from occurring. A clean way of doing this is to implement a request filter. The following request filter
will be called automatically on each request. Once the filter chain completes, this custom filter will call
the `cacheRegistry.clearAll` method. Ensuring the cache registry is safely cleared after each request.

```java
@Component
@RequiredArgsConstructor
public class RequestCacheCleanUpFilter extends OncePerRequestFilter {

    private final RequestCacheRegistry cacheRegistry;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } finally {
            cacheRegistry.clearAll();
        }
    }

}
```
