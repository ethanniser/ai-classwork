# Prolog in TypeScript Quiz A

Write the TypeScript code to create a Prolog interpreter in TypeScript.

1. Variable: Secret
```ts
const secret = {
    _tag: "Variable",
    name: "Secret",
} as const;
```
2. Relation: unknown(Secret)
```ts
const unknown = {
    _tag: "Functor",
    name: "unknown",
    arguments: [secret],
} as const;
```
3. Clause: good(Secret) :- unknown(Secret).
```ts
const rule = {
    _tag: "Rule",
    head: {
        _tag: "Functor",
        name: "good",
        arguments: [secret],
    },
    body: {
        _tag: "Functor",
        name: "unknown",
        arguments: [secret],
    }
} as const;
```
4. Database with this information:
   good(X) :- unknown(X).
   unknown(Secret).

```ts
const database = {
    _tag: "KnowledgeBase",
    rules: [{

        _tag: "Rule",
        head: {
            _tag: "Functor",
            name: "good",
            arguments: [{
                _tag: "Variable",
                name: "X",
            }],
        },
        body: {
            _tag: "Functor",
            name: "unknown",
            arguments: [{
                _tag: "Variable",
                name: "X",
            }],
        }
    }, {

        _tag: "Rule",
        head: {
            _tag: "Functor",
            name: "good",
            arguments: [secret],
        },
        body: {
            _tag: "Functor",
            name: "true",
            arguments: [],
        }
    }],
} as const;
```

*the following aren't really applicable for typescript, but im gonna do them anyways*

5. Write the `__init__` method of the `Symbol` class.
```ts
function Symbol(name: string) {
    return {
        _tag: "Symbol",
        name,
    }
}
```
6. What is the purpose of having a seperate `Symbol` class?

Im not sure because I didn't use a seperate class for symbols. Instead I chose to represent them as a functor with no arguments. The reason for this is that in prolog `foo` and `foo()` are the same thing. So I chose to represent them the same way.

7. What is the difference in *intent* between `str(x)` and `repr(x)`?

`str` is for converting an object to a human readable string. `repr` is for representing an object in a string (often one that can be used to recreate the object).

8. Why do you need to write an `__eq__` method?

By default classes are compared by reference. But if we want two different instances of the same class (with the same internal values) to be considered equal when using `==`, we need to implement a custom `__eq__` method.

0. Write the `__eq__` method of the `Symbol` class.

```ts
function CompareSymbols(a: Symbol, b: Symbol) {
    return a.name === b.name;
}
```

10. What causes you to need to write an `__hash__` method?

Very similar to `__eq__`, by default classes are hashed by reference. But if we want two different instances of the same class (with the same internal values) to 'take up' the same place in a dictionary, we need to implement a custom `__hash__` method.