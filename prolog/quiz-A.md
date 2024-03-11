# Prolog in Python Quiz A

Write the Python code to create a Prolog interpreter in Python.

1. Variable: Secret
2. Relation: unknown(Secret)
3. Clause: good(Secret) :- unknown(Secret).
4. Database with this information:
   good(X) :- unknown(X).
   unknown(Secret).
5. Write the `__init__` method of the `Symbol` class.
6. What is the purpose of having a seperate `Symbol` class?
7. What is the difference in *intent* between `str(x)` and `repr(x)`?
8. Why do you need to write an `__eq__` method?
0. Write the `__eq__` method of the `Symbol` class.
10. What causes you to need to write an `__hash__` method?