import * as AST from "./ast";
import { UnknownFunctorError } from "./error";

type Bindings = Map<string, AST.Term>;

export type QueryResult =
  | {
      readonly _tag: "QueryResult";
      readonly success: true;
      readonly bindings?: Bindings[];
    }
  | {
      readonly _tag: "QueryResult";
      readonly success: false;
    };

function QueryResult(success: true, bindings?: Bindings[]): QueryResult;
function QueryResult(success: false): QueryResult;
function QueryResult(success: boolean, bindings?: Bindings[]): QueryResult {
  return success
    ? { _tag: "QueryResult", success, ...(bindings ? { bindings } : {}) }
    : { _tag: "QueryResult", success };
}

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}

class InterpreterImpl implements Interpreter {
  private rules: AST.Rule[];

  constructor(knowledgeBase: AST.KnowledgeBase) {
    this.rules = knowledgeBase.rules;
  }

  public query(query: AST.Query): QueryResult {
    return this.evaluateFunctor(query.goal, new Map());
  }

  private evaluateFunctor(
    functor: AST.Functor,
    bindings: Bindings,
  ): QueryResult {
    console.log("evaluate functor", functor.name, bindings);
    const builtIn = this.handleBuiltIn(functor);
    if (builtIn) {
      return builtIn;
    }

    const rules = this.rules.filter((rule) => rule.head.name === functor.name);

    if (rules.length === 0) {
      throw new UnknownFunctorError(functor);
    }

    for (const rule of rules) {
      const newBindings = this.unify(
        rule.head.arguments,
        functor.arguments,
        bindings,
      );
      if (newBindings) {
        const result = this.evaluateFunctor(rule.body, newBindings);
        return result;
      }
    }
    return QueryResult(false);
  }

  private handleBuiltIn(functor: AST.Functor): QueryResult | null {
    switch (functor.name) {
      case "true": {
        if (functor.arguments.length !== 0) {
          return null;
        }
        return QueryResult(true);
      }
    }
    return null;
  }

  // always returns a new bindings object
  private unify(
    term1: AST.Term[],
    term2: AST.Term[],
    existingBindings: Bindings,
  ): Bindings | null {
    // if the terms do not have the same length, it is not possible to unify them
    if (term1.length !== term2.length) return null;

    const bindings = this.cloneBindings(existingBindings);

    // iterate over pairs of terms, to recursively unify them
    for (let i = 0; i < term1.length; i++) {
      const t1 = term1[i]!;
      const t2 = term2[i]!;

      // Case 1: Both terms are variables
      if (t1._tag === "Variable" && t2._tag === "Variable") {
        // if both variables have the same name throw bc we cant handle that right now
        // TODO: handle variables with the same name being used multiple times
        if (t1.name === t2.name)
          throw new Error("unable to handle reused variable name");
      }
    }
    return bindings;
  }

  private termsEqual(term1: AST.Term, term2: AST.Term): boolean {
    if (term1._tag === "Variable" && term2._tag === "Variable") {
      return term1.name === term2.name;
    } else if (term1._tag === "Functor" && term2._tag === "Functor") {
      return (
        term1.name === term2.name &&
        term1.arguments.length === term2.arguments.length &&
        term1.arguments.every((arg, i) =>
          this.termsEqual(arg, term2.arguments[i]!),
        )
      );
    } else {
      return term1 === term2;
    }
  }

  private cloneBindings(bindings: Bindings): Bindings {
    return new Map(bindings);
  }
}
