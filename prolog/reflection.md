# Name: Ethan Niser

## 1. How far did you get in this project?

Quite far. I have a working repl, lexer, parser, and interpreter. The interpreter can do moderately complex queries, including resolving variables (in some cases).

## 2. Give an example of at least one frustrating / interesting bug that you fixed, including how you fixed it.

## 3. What known bugs does your code have? 

It doesn't actually check whether statements end with a period, instead just ignores them and goes by line. It also can't handle multiple variables with the same name anywhere in the resolution of a query. It also struggles with complex/nested variable resolution.


## 4. Hopefully you learned something about creating a larger program. Write at least one paragraph of reflection (probably one for each question) - 
    a. What did you do well? 

I think I did a good job of seperating each component of the program (lexer, parser, interpreter, repl). Each part has a consistent interface with a swappable implementation. Because of this I was able to test each part in isolation which was very helpful.
I also think I succeeded with my encoding of the AST. I diverted from the rest of the class, but I think it resulted in something clearer and easier to understand.

### b. What would you do differently next time? 

Probably use classes for the AST types, do I didn't have to write `_tag` a bunch. I also would also use a immutable data structure for the bindings in the interpreter, instead of the current mutable Map.

### c. What was the most helpful thing we did in class? (= What worked well to help you learn?) (=What should we do more of?)

The lectures going over how prolog worked, and the basics of unification.

### d. What should we do less of? Explain why.

No response.

## 5. Last page of google doc: copy and paste the PyTest run showing what test cases you pass. (Follow my example - monospace font, shrink font size until it looks decent.)

see: https://github.com/ethanniser/ai-classwork/tree/main/prolog/tests