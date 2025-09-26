Object field validators in Typescript
08/08/2025
js
---

Before you pull in the next hot new validation library. Ask yourself this question. Do I need it?
The answer is no, field validation is quite easy. Let me show you how to create an extensible
object field validator.

<!-- more -->

## Whats an object field validator?

Ok, so let's work with the following scenario. You have a user registration form. It's represented
in your code as the following type.

```typescript
type UserForm = { email: string, password: string }
```

Typescript will ensure that you get an error message when you try to assign a `number` instead of
a `string` for the email field. But this object represents form data, aka user input. So it could
be anything. We should validate that it matches our criteria. For example the email should be of a
valid email format, and the password should be no less that 8 characters in length.

This where an _object field validator_ comes into play. It takes an object and applies the given
validators to the object fields. Telling us that, _yes this user form contains a valid email address_
etc...

## Usage

Let's start by defining how we want to use it. I'd like to make a composable validator. This would be
a function that takes a generic type and produces a validator for that type. The type in question is
the above `UserForm`. The method used to compose the validator should take an object that contains a
list of field validators for each of the `UserForm` fields. These _field validators_ should themselves
be composable methods.

When the composed validator is called with our `UserForm` instance, it should return an object representing
any errors that were found.

The end result should be a clean api for creating _object field validators_. To me the below example is perfect.

```typescript
type UserForm = { email: string, password: string }

const userFormValidator = createFieldValidator<UserForm>({
  email: [stringValidators.email((email: string) => `${email} is not a valid email address`)],
  password: [
    stringValidators.min(8, () => `Password must be greater than 8 characters in length`),
    stringValidators.max(250, () => `Password must be less than 8 characters in length`),
  ]
})

const validated = userFormValidator({ email: 'not an email', password: '2 short' })
```

The `validated` variable above will hold the following value.

```
{
  input: {
    email: "not an email",
    password: "2 short",
  },
  errors: {
    email: [ "'not an email' is not a valid email address" ],
    password: [ "Password must be at least 8 characters long" ],
  },
  hasErrors: true,
}
```

This makes it easy to check if there are errors present, using the `hasErrors` field, and then access a list
of error messages for each field.

## Implementation

I'd like to believe that you are a top programmer and just want to see the code, without me trying to clumsly explain it.
The code doesn't tell lies, I do. So here is the code.

<chicken-asks>Why did he need to add `<T extends Object>`?</chicken-asks>
<magpie-replies>Well `Object.entries` needs to take an `Object` or an `ArrayLike` entity. So it was just to tell the type checker that `T` is some sort of `Object`.</magpie-replies>

```typescript
type ErrorMap = { [key: string]: string[] }
type ErrorMessageCallback = (input: string) => string
type ValidatorMap = { [key: string]: Function[] }
type Validated<T> = { input: T, errors: ErrorMap, hasErrors: boolean }

export const createFieldValidator = <T extends Object>(validators: ValidatorMap) => (input: T): Validated<T> => {
  const errors: ErrorMap = {}
  let hasErrors = false
  for (const [key, value] of Object.entries(input)) {
    if (validators[key]) {
      for (const validator of validators[key]) {
        const error = validator(value)
        if (error) {
          hasErrors = true
          if (errors[key]) {
            errors[key].push(error)
          } else {
            errors[key] = [error]
          }
        }
      }
    }
  }

  return { input, errors, hasErrors }
}

export const stringValidators = {
  isString: (msg?: ErrorMessageCallback) => (input: string) => {
    if (!(typeof input == 'string')) return msg ? msg(input) : 'Not a string'
  },
  min: (n: number, msg?: ErrorMessageCallback) => (input: string) => {
    if (input.length < n) return msg ? msg(input) : `Must be greater than ${n} characters in length`
  },
  max: (n: number, msg?: ErrorMessageCallback) => (input: string) => {
    if (input.length > n) return msg ? msg(input) : `Must be less than ${n} characters in length`
  },
  email: (msg?: ErrorMessageCallback) => (input: string) => {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRe.test(input.toLowerCase())) return msg ? msg(input) : 'Not a valid email address'
  }
}
```
