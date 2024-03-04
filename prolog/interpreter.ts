import * as AST from "./ast";
import { UnknownFunctorError } from "./error";

type NonEmptyArray<T> = [T, ...T[]];

type Bindings = Map<string, NonEmptyArray<AST.Term>>;

export type QueryResult =
  | {
      readonly _tag: "QueryResult";
      readonly success: true;
      readonly bindings?: Bindings;
    }
  | {
      readonly _tag: "QueryResult";
      readonly success: false;
    };

function QueryResult(success: true, bindings?: Bindings): QueryResult;
function QueryResult(success: false): QueryResult;
function QueryResult(success: boolean, bindings?: Bindings): QueryResult {
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
    bindings: Bindings
  ): QueryResult {
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
        bindings
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
    existingBindings: Bindings
  ): Bindings | null {
    if (term1.length !== term2.length) return null;
    const bindings = this.cloneBindings(existingBindings);
    for (let i = 0; i < term1.length; i++) {
      const t1 = term1[i]!;
      const t2 = term2[i]!;

      if (t1._tag === "Variable") {
        if (!bindings.has(t1.name)) {
          bindings.set(t1.name, [t2]);
        } else {
          const boundValue = bindings.get(t1.name)![0];
          if (!this.termsEqual(boundValue, t2)) {
            return null; // Failed to unify because the variable is already bound to a different value
          }
        }
      } else if (t2._tag === "Variable") {
        return this.unify([t2], [t1], bindings); // Reuse the logic by swapping the terms
      } else if (t1._tag === "Functor" && t2._tag === "Functor") {
        if (
          t1.name !== t2.name ||
          t1.arguments.length !== t2.arguments.length
        ) {
          return null; // Functor names or arity don't match
        }
        const functorBindings = this.unify(
          t1.arguments,
          t2.arguments,
          bindings
        );
        if (functorBindings === null) {
          return null; // Functor arguments failed to unify
        }
      } else if (t1 !== t2) {
        return null; // Constants don't match
      }
      // If t1 and t2 are identical constants, they naturally unify without any action needed.
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
          this.termsEqual(arg, term2.arguments[i]!)
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
