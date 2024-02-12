interface Variable {
  readonly _tag: "Variable";
  readonly name: string;
}

interface Functor {
  readonly _tag: "Functor";
  readonly name: string;
  readonly arguments: Term[];
}

interface Number {
  readonly _tag: "Number";
  readonly value: number;
}

// an atom is just a functor with no arguments

type Term = Variable | Functor | Number;

interface Rule {
  readonly _tag: "Rule";
  readonly head: Functor;
  readonly body: Functor;
}

// a fact is just a rule with one functor, the 'true' functor

interface KnowledgeBase {
  readonly _tag: "KnowledgeBase";
  readonly rules: Rule[];
}

interface Query {
  readonly _tag: "Query";
  readonly goal: Functor;
}

export type { Variable, Functor, Number, Term, Rule, KnowledgeBase, Query };
