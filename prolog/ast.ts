interface Atom {
  readonly _tag: "Atom";
  readonly value: string;
}

interface Number {
  readonly _tag: "Number";
  readonly value: number;
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

type Term = Atom | Number | Variable | Functor;

const listSymbol = Symbol("ListFunctorIdentifier");
const stringSymbol = Symbol("StringFunctorIdentifier");

interface Fact {
  readonly _tag: "Fact";
  readonly head: Functor;
}

interface Rule {
  readonly _tag: "Rule";
  readonly head: Functor;
  readonly body: Functor[];
}

export type { Atom, Number, Variable, Functor, Term, Fact, Rule };

export { listSymbol, stringSymbol };
