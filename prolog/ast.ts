interface Atom {
  readonly _tag: "Atom";
  readonly value: string;
}

interface Variable {
  readonly _tag: "Variable";
  readonly value: string;
}

interface Functor {
  readonly _tag: "Functor";
  readonly name: Atom;
  readonly arguments: Term[];
}

type Term = Atom | Variable | Functor;

interface Fact {
  readonly _tag: "Fact";
  readonly head: Functor;
}

interface Rule {
  readonly _tag: "Rule";
  readonly head: Functor;
  readonly body: Functor[];
}

export type { Atom, Variable, Functor, Term, Fact, Rule };
