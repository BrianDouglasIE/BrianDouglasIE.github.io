---
title: Handle Spring form errors with JTE
date: 17/06/2025
tags: [ java, spring ]
---

I've been working with JTE (Java Template Engine) templates in my latest Spring app. They are a joy to work with and
feel like a more _modern_ alternative to Thymeleaf templates. With Spring however there are some integrations that a
Thymeleaf user would expect, that are missing when using JTE. Automatic form error association being one. So I have
documented how to pass form errors to your jte templates below.

<!-- more -->

## The problem

Let's say we have a `RegistrationForm` class, that has various validator annotations. When one of these validators fails
we expect the `RegistrationController` to return the registration form view with the errors present, such as the below
example.

```java
@Controller
@AllArgsConstructor
@RequestMapping("/register")
public class RegistrationController {

    private static final String FORM_VIEW = "auth/register";
    private static final String ATTR_PAGE = "page";

    @GetMapping
    public String showRegisterForm(Model model) {
        model.addAttribute(ATTR_PAGE, new Page("Register"));
        model.addAttribute(ATTR_REGISTRATION_FORM, new RegistrationForm());
        return FORM_VIEW;
    }

    @PostMapping
    public String processRegisterForm(@ModelAttribute @Validated RegistrationForm registrationForm,
                                      BindingResult result,
                                      Model model) {

        model.addAttribute(ATTR_PAGE, new Page("Register"));
        model.addAttribute(ATTR_REGISTRATION_FORM, registrationForm);

        if (result.hasErrors()) {
            return FORM_VIEW;
        }

        // ...
    }
}
```

In the above example, when the `BindingResult` has errors the user is taken back to the registration form page. If we
were using Thymeleaf, the validation errors would be auto attached to the view and can be rendered with special syntax.

<magpie-trinket>You can read more about how Thymeleaf handles form errors
at [spring-thymeleaf-error-messages](https://www.baeldung.com/spring-thymeleaf-error-messages)</magpie-trinket>

Jte does not support this type of integration. This is a good thing, as it allows the developer to handle the form field
validation how they see fit. Before I go into how I bind the form errors via the controller, here is the
`RegistrationForm` class.

```java
@Getter
@Setter
public class RegistrationForm {
    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 250, message = "Password must be a minimum of 8 characters in length")
    private String password;
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "First name is required")
    @Size(min = 1, message = "First name must be between 1 and 50 characters in length")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 3, message = "Last name must be between 3 and 50 characters in length")
    private String lastName;
}
```

From this you can guess that when there is an email format issue we want to show the appropriate message to our user on
the frontend. Naturally this is the case for all the other fields also. Here is how I render the error message in the
jte template.

```html
@param ValidationHelper validation
@param RegistrationForm registrationForm

@if(validation.hasErrors())
    <div class="form-error">Please correct the following errors to proceed.</div>
@endif

<label>Email Address
    <input name="email" type="email" value="${registrationForm.getEmail()}" required>
    @if(validation.hasError("email"))
        <small class="error-text">${validation.getError("email").getDefaultMessage()}</small>
    @endif
</label>
```

<chicken-asks>But wait! where is the `ValidationHelper` coming from?</chicken-asks>
<magpie-replies>Eagle eyed again, he shows us how to add it below</magpie-replies>

You'll notice that I have added a `ValidationHelper` param. I will show you how this is implemented below. But as you
can see, we are going to use this to render our form errors. The api should be self-explanatory `hasErrors`, tells us
if there are any errors present, `hasError` tells us if a specific error is present, and `getError` give us the details
of the specific error.

## ValidationHelper

The `ValidationHelper` class itself is just a wrapper around the `BindingResult` which we will pass in via the
controller. I've added the `@NoArgsConstructor` so that is can be instantiated without a `BindingResult`. The null
checks mean that this is safe to use when a `BindingResult` is not present.

```java
@NoArgsConstructor
@AllArgsConstructor
public class ValidationHelper {
    private BindingResult bindingResult;

    public boolean hasErrors() {
        return bindingResult != null && bindingResult.hasErrors();
    }

    public boolean hasError(String name) {
        return bindingResult != null && bindingResult.hasFieldErrors(name);
    }

    public List<FieldError> getErrors() {
        if (bindingResult == null) {
            return Collections.emptyList();
        } else {
            return bindingResult.getFieldErrors();
        }
    }

    public FieldError getError(String fieldName) {
        if (bindingResult == null) {
            return null;
        } else {
            return bindingResult.getFieldError(fieldName);
        }
    }
}
```

The updated `RegistrationController` is below. The example registration form jte template does not need to be updated.

```java
@Controller
@AllArgsConstructor
@RequestMapping("/register")
public class RegistrationController {

    private static final String FORM_VIEW = "auth/register";
    private static final String ATTR_PAGE = "page";
    private static final String ATTR_VALIDATION = "validation";

    @GetMapping
    public String showRegisterForm(Model model) {
        model.addAttribute(ATTR_PAGE, new Page("Register"));
        model.addAttribute(ATTR_REGISTRATION_FORM, new RegistrationForm());
        model.addAttribute(ATTR_VALIDATION, new ValidationHelper());
        return FORM_VIEW;
    }

    @PostMapping
    public String processRegisterForm(@ModelAttribute @Validated RegistrationForm registrationForm,
                                      BindingResult result,
                                      Model model) {

        model.addAttribute(ATTR_PAGE, new Page("Register"));
        model.addAttribute(ATTR_REGISTRATION_FORM, registrationForm);
        model.addAttribute(ATTR_VALIDATION, new ValidationHelper(result));

        if (result.hasErrors()) {
            return FORM_VIEW;
        }

        // ...
    }
}
```
