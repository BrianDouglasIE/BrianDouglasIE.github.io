---
title: A year of experiments
tags: [rant]
date: 01/12/2025
---

2025 has been a strange year for me in regards to programming. Throughout
my career I have worked on many differents "stacks". I started off in dotnet
in 2012, then php at now defunct "digital agencies", then into java and C++ 
at the dreaded fintechs. My last role involved using python, to integrate
"ai" into an insurance company's website. So I'd like to think I have a broad
range of experience. Though admittedly it's mostly centered around the web.

<!-- more -->

2025 was different for me in that I have been seeking out something to specialise
in. All the languages mentioned have their strengths and faults, but none have
really captured me. I'm not a specialist in any of them, but I know enough to
work in them and be productive. But I'm not happy with this. I want to specialise
in something. I want to master a tool.

Around 8 or so years ago I felt like I was an expert in web development. I spoke at
meet ups, at my local university, and even in front of ~1000 people at company Town Hall.
But that was the Dunning Kruger effect in action, I didn't know enough to know how little
I did know (be wary of overly confident devs...). So right now even though I am an 
exponentially better programmer I feel more useless than ever. Becuase I understand 
how little I do know, and how vast the domain is. This is why I want to specialise in 
something. Master a niche, and be confident and knowledgeable in that niche. So this 
year I have tried out a lot of different programming languages. I chose programming 
languages rather than domains as I feel the language itself is what is more important 
in providing a state of zen. Language influences thought.

So in 2025 I tried out many different programming languages. Creating various projects
and experiments in each. In the hope of finding a niche to hide in. Here are my thoughts.

## PHP

I first used PHP in 2015 whilst working at a digital agency. Which laid me off after a client
refused to pay for a project (turns out lawnmower sales are hard...). They used magento
which was an ecommerce framework? I'm not really sure, but it was horrendous to work with.
I mostly hacked together vanilla php whilst trying to ignore the framework itself. Anyway,
fast forward to 2025 and PHP is dominated by Laravel.

Laravel is the Rails of PHP. It provides you with everything you could ever want when creating
web apps. It's written in PHP but when using it you end up writing a _nicer_ version of PHP.
Basically it's highly abstracted for a dev friendly api. Laravel's marketing is great and it
has an enthusiastic community. So I decided I would create a social platform using Laravel.
The idea was to make a platform where tradespeople could post their details, and get reviews
etc...

Laravel provided a great starting point. I got 80% of the way very quickly. But the more I got
into the project and had to do things that Laravel didn't provide me methods of doing, basically
the business logic. I felt constrained. I felt like Laravel was hindering me rather than helping
me. There was also so much to learn about the _Laravel_ way of doing things that I just became
overwhelmed and abandoned the project. To some it up, Laravel helps you to 80% but fights you for
the last 20%.

<chicken-asks>But what about PHP? he just talked about Laravel</chicken-asks>
<magpie-replies>Basically if you are writing PHP today you are writing Laravel. At it's core PHP is still the same as it was 10 years ago, with a little syntactic sugar.</magpie-replies>

## Java

After failing to complete the last 20% of the social platform for tradespeople with Laravel, I
thought _Hey, let's try Java and Spring_. The difference here is that I have worked professionally
for years with Java and Spring. So I knew what I was getting into. Java itself is a decent language,
but everything around it is soul destroying. For example you feel compelled to write methods called _getX_
and _setX_ which are public rather than just have a public field of _x_. Verbosity for the sake of it.

<magpie-trinket>People get around this nonsense by using the Lombok library which uses decorators to auto generate these methods. But really this is just another hoop to jump through.</magpie-trinket>

And that pretty much sums up Java. Writing laborious amounts of code for the sake of it. For example
if I wanted to display info from a database to a client (a simple select), I would find myself writing
5 or 6 classes, all in seperate files. _Entity_, _EntityRepository_, _EntityService_, _EntityController_,
_EntityDTO_, _EntityMapper_... I could go on. But christ, I'll give up the will to type.

Java is enterprise bullshit. Don't go there if you want to keep your sanity. Also the IDEs suck now, even JetBrains
lags like hell.

I never finished the social media project by the way. Note to future self. When you get 80% of the way, persevere.
After trying with Java and Spring, I realised Laravel ain't that bad at all.

## JavaScript

Javascript now also comes in a bullshit enterprise version called Typescript. Typescript allows css kids devs to
role play as Java devs. Rather than worry themselves with delivering a feature they can now spend their
time hacking at a type system, only to negate it all with the _any_ type when things get tricky.

That might be harsh, but in my opinion Typescript and the notion of types in Javascript has detracted
from the language. There was a time when Javascript was the ultimate scripting language. Simple and hackable,
you could get things working with ease. But then 2 concepts were introduced, those were transpilation, which
lead to the aforementioned Typescript, and syntactic-sugar, which has lead to a glut of incomprehensible syntax
for the sake of syntax. Back in the days before es6, you wrote functions, for loops, and understood prototypal
inheritance. In those days you could get things done with javascript. Now if you leave the language for a fortnight
you are forced to re-learn it from scratch next time you pick it up.

Take this blog for example. It's a javascript file that converts markdown to html and places the output in a directory.
It's not complicated at all, the script is roughly 200 lines. I used node js to handle the filesystem interactions.
One day however it stopped working. Certain syntax was no longer correct. Some people in a meeting somewhere decided
to change how requireing a file worked, and my blog script broke. Then the libraries I used for converting markdown
to html needed updated. Then the syntax highlighter randomly changed it's api and broke the blog script. Why? no idea.

It's this churn and change that makes the JavaScript _ecosystem_ unmanageable. Javscript doesn't need every language
feature ever. Syntax does not help in the long run, it just adds bullshit to what was a great scripting language.

<magpie-replies>Don't get him started on client side js "apps"...</magpie-replies>
<chicken-asks>Why? what's wrong with rewriting an application's entire frontend every 2 years?</chicken-asks>

So to sum up javascript, if you are building something serious then avoid javascript.

## Python

As I mentioned at the top of the article I've been using Python at work this year. Integrating an LLM to provide
summaries of health insurance information, and use natural language processing to relate user queries to FAQs. And
do you know what? It's been great. Sure there is some bolted on nonsense that feels unnatural, similar to javascript. 
In Python these take the form of type hints and dataclasses.

I know from the general commentary online that there are some issues around Python environments and package managers.
But in my case I never had any of these issues, so I honestly can't complain. Speed is also a common gripe. _Python is
slow_. Well it may be, but the tool I implemented, which ran as an Azure function, was fast. The vast majority of the
time being spent calling a third party api.

So in general I'd give Python a thumbs up. I'd reach for it if I needed to write a quick script or automate a task.
Which feels like it's intended purpose.

## C

I've written a lot of C this year. My post on [writing a string buffer in C](/string-buffer-c/) generated a lot of
attention on hacker news. I even got emails about it, with others showing how it could be improved, which I was
very grateful for. C feels like a proper programming language. If you know your stuff you can literally implement
anything in C. I don't know my stuff, so I really found it hard to become confident and efficient with it. The lack
of the concept of string really befuddled me.

That being said, I'm going to persevere with C. I feel it taught me more than any other programming language, and if
I really want to progress off my current skill plateau, C is the way to go.

## C++

This is another language that I have used professionally. I worked on an internal document search engine written in C++.
This is a language that get's a lot of abuse online. People seem to dislike it greatly. They complain about templates,
compile time, and footguns. But similar to my Python experience, I don't really have any gripes with it. I found it to
be a perfectly adequate tool. The codebase I worked on was perfectly readable and manageable, maybe I got lucky. This
is also the programming language I've studied the most. I've read two of Stroustrop's books, and Scott Myers 
"Effective C++" cover to cover. So perhaps that grounded me in the language. I also don't have a complaint about the
many language features of C++. I know I complained about features for the sake of it in regards to javascript, but with
C++ I don't feel compelled to use every feature. I use what I need to get the job done.

C++ is a serious language, for getting things done. John Carmack even said on the Lex Fridman podcast that a team of
good C++ devs would be his top choice. He did say he writes _C flavoured_ C++. But that harks back to my point of using
the features you need.

So in future, if I ever want to write a serious bit of software, I'll reach for C++.

## Lua

I was first introduced to Lua when I followed Harvards CS50 game dev course. The lecturer used Lua and Love2d to implement
some retro 2d games. Lua is a great extension language. But it's really just barebones. There isn't much of a standard lib.
Which makes sense, as I guess if it had an extensive standard lib it would be much harder to bake into other applications.
As the standard lib would need constant re-implementation.

Lua is essentially what javascript should be. A basic embedded scripting language, no bullshit.

## Go

I'm currently writing an extension for the Caddy web server, which is written in Go. The extension allows for lua scripting
with in the caddy server. Go is great, if you want all your decisions made for you. The Go team provide you with pretty
much everything you need. As well as a whole heap of opinions about how you should write Go. The tooling is great, it just
works. The language itself if slightly annoying, I feel like I'm constantly writing code to handle imaginary errors.

Anyway, I'm on the fence about Go. I don't find it an enjoyable language. I'm not excited to write more Go. But that
said, I haven't yet developed a strong opinion on it, I may very well come to like it.

## Round Up

**TLDR;** Python for scripting, C or C++ for everything else. Enough said.

I still haven't found my _niche_. But I know I want to explore C more. I have a project in mind that is outside of
my current skill range. It will require me to grow my knowledge in a domain that I am not familiar with. I will use C.
And I will persevere. In 2025 I used many different langauges, and flip flopped from project to project. In 2026 I
will narrow my focus. Because ultimately it's the ability to persevere and hammer away at a problem that brings success.

Oh yea, and if I have to do any small task quickly I'll use Python.
