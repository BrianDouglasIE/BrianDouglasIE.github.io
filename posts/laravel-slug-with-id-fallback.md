---
title: Slugs with an ID fallback in Laravel
date: 12/06/2024
tags: [laravel]
---

Slugs make a URL look legit. No one wants to click on a link that reads like `https://mysite.com/blog/1`. I'd definitely get hacked if I clicked that. But what if it read `https://mysite.com/blog/1/some-awesome-content`. Now that looks trustworthy. I'm definitely gonna see some awesome content if I click that link.

<!-- more -->

## Naive Way

So how do we implement it? Well we could use the `blog` resource's title. Laravel provides a `Str::slug` helper which takes a string and _sluggifies_ it. Meaning `My Awesome Blog Post` becomes `my-awesome-blog-post`. This seems like a great idea. Let's update our `Blog` model so that when it is saved it sets a `slug` value based on the title.

```php
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }
}
```

Now we can implement the resource's `show` route like so:

```php
public function show(string $slug)
{
    return Blog::withSlug($slug)->first();
}
```

Awesome. What a completely foolproof implementation.

> But what if we update the title?!?


If the title is updated the `slug` may no longer match the content.

> Or worse, the `slug` might update too!

Then the previous url will return a 404, which may break embedded content.

## The Smart Way

Yes, so not foolproof after all. The `title` of the blog may change. So it's not something we want to base our urls off, because we don't want our urls to change.

So what shouldn't change about our blog? it's id. At the start of this article we showed an ugly url `https://mysite.com/blog/1`. The good thing about this _ugly_ url is it shouldn't change. By visiting it you will always view the blog with id 1. The downside is it's not descriptive. So let's combine the unique identifier of the id with the slug based of the blog's title. By doing this we get a url like so, `https://mysite.com/blog/1/my-awesome-content`. The trick here is that the slug part of the url is just for aesthetics. It gives the user an idea of what the blog with id 1 might be about. Let's implement this in Laravel so that the url works but uses the id solely to get the blog and redirects to the updated slug if the title changes.

### The Code

We can achieve the above scenario like so. Firstly, in our routes file we will specify the following show route.

```php
Route::get('blog/{blog}/{slug?}', [BlogController::class, 'show'])->name('blog.show');
```

Now we'll update our `Blog` model to contain a helper method, that constructs the new show route.

```php
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    public function showRoute(array $parameters = [])
    {
        return route('blog.show', [$this, Str::slug($this->title), ...$parameters]);
    }
}
```

Finally, in the `show` method of our `BlogController` we will add the following.

```php
public function show(Request $request, Blog $blog)
{
    if (! Str::contains($blog->showRoute(), $request->path())) {
        return redirect($blog->showRoute($request->query()), status: 301);
    }

    return view('blog.show', compact('blog'));
}
```

In the above `show` method, Laravel's route model binding is used to find the correct blog based on the id supplied. We then add an extra check to make sure the `$request->path()` matches the `showRoute()`. If it does not we redirect to the correct `showRoute()` with a status of `301 Moved Permanently` to let the browser know the slug has updated.