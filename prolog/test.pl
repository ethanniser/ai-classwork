male(albert). %a fact stating albert is a male
male(edward).
female(alice). %a fact stating alice is a female
female(victoria).
parent(albert,edward). %a fact: albert is parent of edward
parent(victoria,edward).
father(X,Y) :- %a rule: X is father of Y if X if a male parent of Y
parent(X,Y), male(X). %body of above rule, can be on same line.
mother(X,Y) :- parent(X,Y), female(X). %a similar rule for X being mother of Y
foo(bar).
baz(bar) :- foo(bar).