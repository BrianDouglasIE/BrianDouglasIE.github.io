Linting is procrastination.
31/01/2025
rant
---

Imagine this scenario. A developer has an opinion. They feel that it is vitally important that code
adhere to an arbitrary style guide.

<!-- more -->

The rules of the style guide do not in anyway impact the function of the code. They do not benefit the
end user in any way. But our imaginary developer feels that these rules, and the enforcement there of,
are top priority. The product that they are working on may require new features or performance improvements.
The company that owns the product may have tight deadlines and financial incentives. These are simply not
important to our developer. Our developer cannot deliver any new features, or even think about the needs of
the employer or end user, when they fear that a styleguide rule may not be enforced.

So they make this their priority. They spend time, and time is money, on adding a tool like eslint to the
project. This will flag any style guide violations to other devs. BUT that is not enough. These rules
cannot simply be enforced locally. They must be added to the CI/CD pipeline. Not added as warnings, but
added as errors. That will cause the 32 minute pipeline to fail because some perfectly valid code does not
adhere to the developer's precious opinion. So now not only have they spent 2 weeks of their own time
enforcing a style guide and adding linters, and tweaking those linters. They now cost other developers
time. Because a javascript string used the incorrect, BUT PERFECTLY VALID, quotation mark.

Then to waste even more time, enforcement of rules and style guides are brought up in scrum meetings.
Where countless hours are lost arguing about opinions that do not benefit the end user in any way.
Countless hours wasted, countless money wasted, no features delivered.

Procrastination is "the action of delaying or postponing something". In this case the concept of style guides
and linters are delaying the delivery of features. Developers are postponing actual work, in favour of
arguing about arbitrary opinions.

So to end my rant, Linting is procrastination, EXPENSIVE procrastination.
