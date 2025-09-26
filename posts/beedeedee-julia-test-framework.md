I wrote a test framework in Julia
21/10/2024
julia
---

I didn't set out to write a test framework in Julia. But I ended up
going down the rabbit hole, and learning a lot about the language
on the way.

<!-- more -->

<chicken-asks>
Hold up! He wrote a test framework in Julia?
</chicken-asks>

<magpie-replies>
Yea, he must think he's a polyglot or something.
</magpie-replies>

## Why Julia?

Well that is a straight forward one to answer. I was watching a Formula 1
race and noticed that JuliaHub is a sponsor of the Williams F1 team. So
naturally I thought I better try out the language and so I set about writing
some programs in Julia.

Julia is mainly used in the academic and scientific realms. But at it's core
it is quite a nice general purpose language.

It is similar to Python, but it does not support OOP. Instead it uses pattern
matching with method overloads to handle different data types. For example let's
say we have a greeter function that can greet students and teachers. In Julia
that might look like this.

```julia
function greet(person::Teacher)
  return "Hello Teacher"
end

function greet(person::Student)
  return "Hello Student"
end
```

The correct variant of greet get's called based on the type of `struct` that is
passed to the method. A `struct` being the way to define a custom data type.
This takes a little bit of getting used to. But once I got my head around the fact
that Julia operators were methods it started to make sense. This clicked when
it came to writing comparators for [BeeDeeDee.jl](https://github.com/BrianDouglasIE/BeeDeeDee.jl/tree/main) the test framework I ended up writing.

But __why__ did I end up writing a test framework? I hear you ask. Well because the built
in Julia test framework lacked features that I wanted and would expect every test
framework to have. For example hooks, like `before_each` and `after_all`, as well
as human readable methods. The latter being something that the Julia community
seem to readily reject. Opting to use mathematic operators where they can. Which
is no surprise when Julia's scientific background is taken into account.

So I set off into the unknown and started writing a test framework. I had a clear
idea in mind of what I wanted to achieve. That being an api that looked like the following.

```julia
describe("User Age Tests") do
  it("should have an age greater than or equal 18 and less than 100") do
    expect(user.age) |>
      to_be_greater_than_or_equal(18) |> and |> to_be_less_than(100)
  end
end
```

## The implementation

Starting off with the code I wanted to achieve was a great help. I knew that I wanted to
make use of method chaining using Julia's pipe operator `|>`. The reason for this being
that it allows for clear an readable code. It also allows for a data structure to
be passed through and transformed by multiple methods. This would be necessary for assertions.

In BeeDeeDee the `expect` method takes a value and creates an `Expectation` struct based off of
that value. The _comparators_, which are methods that are called against the assertion, then
take the value of the assertion and apply their own logic. These are essentially methods which
check for the correct `boolean` value when comparing their own value with the assertion. I say
_correct_ `boolean` value as an `Expectation` may be negated using the `not` comparator. Which
essentially reverses the expected `boolean` value from `True` to `False`.

The `Expectation` struct itself holds it's own value as well as it's comparator function and
result of that comparator function, once it has been applied on it's value. This is necessary
as more than one expectation may be called per test. The code for the `Expectation` struct is
minimal as shown below. You'll notice that a `Vector{String}` data type is also present. This
is used to store the logs from the Expectation's comparator methods. Which are used for cli
reporting.

```julia
struct Expectation
    value::Any
    comparator::Function
    result::Bool
    logs::Vector{String}
end
```

The test framework allows for tests to be grouped and hooks to be applied to those groups.
Implementing this was difficult and my solution was not ideal. In order to keep track of
what the current test suite was I used a global variable that stored the current test suite's
id. The id belonged to a `Suite` struct that was created when either `testgroup` or `describe`
was called. This struct would then be used to hold information such as the tests which were
run inside the suite, the results of those tests, as well as the hooks that should be run before
and after each test. The definition of these structs are below.

```julia
Base.@kwdef mutable struct Hooks
    before_all_called::Bool = false
    after_all_called::Bool = false
    before_all::Vector{Union{Nothing,Function}} = []
    after_all::Vector{Union{Nothing,Function}} = []
    before_each::Vector{Union{Nothing,Function}} = []
    after_each::Vector{Union{Nothing,Function}} = []
end

Base.@kwdef mutable struct TestResult
    description::String = ""
    status::Symbol = :Pending
    f::Union{Task,Function} = () -> nothing
    expectations::Vector{Expectation} = []
    stacktrace::Any = []
end

Base.@kwdef mutable struct Suite
    tests::Vector{TestResult} = []
    child_suites::Vector{Suite} = []
    f::Union{Task,Function} = () -> nothing
    status::Symbol = :Pending
    hooks::Hooks = Hooks()
    description::String = ""
    id::Int64 = 0
end
```

I mentioned that this was not a _good_ solution. This is because it would not allow for concurrent
test files to be run. Because a global variable is used to store the current suite, the tests
must be executed in order. Otherwise their results could end up in the wrong `Suite` struct.
I'm still not entirely sure how this could be solved. I would have to take a look at other
frameworks for some inspiration.

The final noteworthy part of the implementation was the use of Julia's built in operators to create
comparators. I was able to leverage the fact that Julia's builtin operators are methods themselves,
to create concise comparators. For example I wrote a helper method called `construct_comparator` that
took an operator as an argument and then used it as a callback method to compare the expected value
with the actual value. I have left out the code for `construct_comparator` as it contains reporting
logic which makes the code hard to understand without some domain knowledge. What is easy to understand
however is it's use. For example here is how the `to_be` comparator is defined.

```julia
to_be = construct_comparator(===, "to be")
```

<magpie-trinket>
Why not look through the source code of BeeDeeDee.jl yourself. It's a small codebase which can be view at
<a href="https://github.com/BrianDouglasIE/BeeDeeDee.jl/tree/main">BrianDouglasIE/BeeDeeDee.jl</a>
</magpie-trinket>

## My thoughts on Julia

Writing a test framework in an unknown programming language is quite a feat. But it allowed me to
really dig down deep into Julia in quite a short period of time. I was impressed by the syntax of
Julia. There are some real opportunities to write beautiful code. The use of the `do` keyword and
pipe operator allow for concise and readable code. Even if it took me a while to understand the
argument order required for the `do` keyword.

It's a shame however that the _beautiful_ and readable syntax which Julia can offer is contrasted
with some awkward syntax such as how default arguments are assigned in a struct. For example, the
`Suite` struct in BeeDeeDee.jl.

```julia
Base.@kwdef mutable struct Suite
    tests::Vector{TestResult} = []
    child_suites::Vector{Suite} = []
    f::Union{Task,Function} = () -> nothing
    status::Symbol = :Pending
    hooks::Hooks = Hooks()
    description::String = ""
    id::Int64 = 0
end
```

Experienced users of Julia might look past this. But to me it reeks of complexity. To understand this
a developer must understand why the `mutable` keyword is there, and what `Base.@kwdef` is, as well
as why a `macro` is needed. A `macro` being a language feature that allows for certain meta programming
techniques. They are used frequently, but I've only ever found them to add complexity.

Another example of Julia being awkward is in it's use of `modules` and `exports`. I still don't
fully understand how `modules` work. One might think of them sort of like a `class` in OOP. They act
like a container for code, which can export certain members. Unfortunately though Julia forces
the developer to export each method individually. Leading to some verbose code. Below is the
comparators export for BeeDeeDee. A `public` keyword on the method definition would be much nicer.

```julia
export to_be,
to_be_true,
to_be_false,
to_be_greater_than,
to_be_less_than,
to_be_greater_than_or_equal,
to_be_less_than_or_equal,
to_be_in,
to_be_nothing,
to_be_typeof,
to_be_empty,
to_have_key,
to_be_subset,
to_be_setequal,
to_be_disjoint,
to_match,
to_be_valid_email,
to_throw
```

Imports are equally awkward. Every time a module is imported it is imported fresh. Meaning that
if A.jl and B.jl are in the same application and import C.jl. There will be a conflict and an error
with Julia complaining that C.jl is already imported. To get around this Julia developers import
modules into a common parent and access them using a path like syntax. With `using ..C` meaning
import the C.jl module that was required in my parent's scope... yikes.

### Will Julia become a mainstream language?

In data science and academia, yes. Maybe third or fourth for popularity at it's height. But only
because there seems to be a lot of money behind it. Well at least I assume there must be if
Formula 1 cars are being sponsored by JuliaHub.

In anything else, no. I was not convinced that Julia would help me solve any problems on the web or
in game dev. It did introduce me to some novel concepts. But ultimately there was nothing there to
convert me into a Julia developer. The main annoyances being around how modules work. I could never
imagine building a large complicated system in a language that has such confusing code interop.
