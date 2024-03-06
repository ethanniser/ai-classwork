foo(bar).
foo(baz).
f(W) :- foo(W).

sibling(bob, paul).
sibling(bob, fred).
sibling(fred, bob).


parent(albert, bob).
parent(albert, betsy).
parent(albert, bill).

parent(alice, bob).
parent(alice, betsy).
parent(alice, bill).

parent(bob, carl).
parent(bob, charlie).

grandparent(C, M, D) :- parent(M, C), parent(D, C).
