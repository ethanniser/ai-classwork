import * as AST from "./ast";
import { UnknownFunctorError } from "./error";

type Bindings = Map<string, AST.Term>;

export type QueryResult =
  | {
      readonly _tag: "QueryResult";
      readonly success: true;
      readonly bindings: Bindings[];
    }
  | {
      readonly _tag: "QueryResult";
      readonly success: false;
    };

function QueryResult(success: true, bindings?: Bindings[]): QueryResult;
function QueryResult(success: false): QueryResult;
function QueryResult(success: boolean, bindings: Bindings[] = []): QueryResult {
  return success
    ? { _tag: "QueryResult", success, bindings: bindings }
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
    const allVariables = this.getAllVariablesInTerm(query.goal);
    const result = this.evaluateFunctor(query.goal, new Map());
    console.log(result);
    if (result.success) {
      const unusedVariables = result.bindings
        .flatMap((binding) => [...binding.keys()])
        .filter((k) => !allVariables.includes(k));
      for (const unusedVariable of unusedVariables) {
        for (const binding of result.bindings) {
          binding.delete(unusedVariable);
        }
      }

      // @ts-expect-error I know theres a million better ways to do this but idc
      result.bindings = result.bindings.filter((binding) => binding.size > 0);
    }

    return result;
  }

  private getAllVariablesInTerm(term: AST.Term): string[] {
    if (term._tag === "Variable") {
      return [term.name];
    } else {
      return term.arguments.flatMap((term2) => {
        if (term2._tag === "Variable") {
          return [term2.name];
        } else {
          return term2.arguments.flatMap((term3) =>
            this.getAllVariablesInTerm(term3),
          );
        }
      });
    }
  }

  private evaluateFunctor(
    functor: AST.Functor,
    bindings: Bindings,
  ): QueryResult {
    console.log("EVALUATEFUNCTOR", functor.name);
    const builtIn = this.handleBuiltIn(functor, bindings);
    if (builtIn) {
      return builtIn.success
        ? QueryResult(true, bindings.size === 0 ? [] : [bindings])
        : QueryResult(false);
    }

    const rules = this.rules.filter(
      (rule) =>
        rule.head.name === functor.name &&
        rule.head.arguments.length === functor.arguments.length,
    );

    if (rules.length === 0) {
      throw new UnknownFunctorError(functor);
    }

    const results: QueryResult[] = []; // Accumulate results of all applicable rules

    for (const rule of rules) {
      const newBindings = this.unify(
        rule.head.arguments,
        functor.arguments,
        bindings,
      );
      if (newBindings) {
        const result = this.evaluateFunctor(rule.body, newBindings);
        results.push(result); // Store the result
      }
    }

    // If no successful matches were found, return failure
    if (results.length === 0) {
      return QueryResult(false);
    }

    // If any rule resulted in a successful match, return success with bindings
    // If none of the rules succeeded, return failure
    const anySuccess = results.some((result) => result.success);
    if (!anySuccess) {
      return QueryResult(false);
    }

    function isSucessful(
      result: QueryResult,
    ): result is { _tag: "QueryResult"; success: true; bindings: Bindings[] } {
      return result.success;
    }

    // If any rule resulted in a successful match, return success with bindings
    return QueryResult(
      true,
      results.filter(isSucessful).flatMap((result) => result.bindings),
    );
  }

  private handleBuiltIn(
    functor: AST.Functor,
    bindings: Bindings,
  ): QueryResult | null {
    switch (functor.name) {
      // represents a 'rule'
      case "true": {
        if (functor.arguments.length === 0) {
          return QueryResult(true);
        }
        break;
      }
      // the 'and' functor
      case ",": {
        if (
          functor.arguments.every(
            (arg) =>
              arg._tag === "Functor" &&
              this.evaluateFunctor(arg, bindings).success,
          )
        ) {
          return QueryResult(true);
        }
        break;
      }
    }
    return null;
  }

  private unify(
    term1: AST.Term[],
    term2: AST.Term[],
    existingBindings: Bindings,
  ): Bindings | null {
    if (term1.length !== term2.length) return null;

    let bindings = this.cloneBindings(existingBindings);

    for (let i = 0; i < term1.length; i++) {
      const t1 = term1[i]!;
      const t2 = term2[i]!;

      if (t1._tag === "Variable" && t2._tag === "Variable") {
        if (t1.name === t2.name) {
          throw new Error("unable to handle reused variable name");
        } else {
          bindings.set(t1.name, t2);
        }
      } else if (t1._tag === "Variable" || t2._tag === "Variable") {
        const variable = t1._tag === "Variable" ? t1 : t2;
        const value = t1._tag === "Variable" ? t2 : t1;
        bindings.set(variable.name, value);
      } else if (t1._tag === "Functor" && t2._tag === "Functor") {
        if (
          t1.name !== t2.name ||
          t1.arguments.length !== t2.arguments.length
        ) {
          return null;
        }
        // Recursively unify arguments
        const subBindings = this.unify(t1.arguments, t2.arguments, bindings);
        if (subBindings === null) {
          return null;
        }
        // Merge the sub-bindings with the current bindings
        bindings = this.mergeBindings(bindings, subBindings);
      } else {
        throw new Error("should be unreachable");
      }
    }
    return bindings;
  }

  private cloneBindings(bindings: Bindings): Bindings {
    return new Map(bindings);
  }

  private mergeBindings(bindings1: Bindings, bindings2: Bindings): Bindings {
    return new Map([...bindings1, ...bindings2]);
  }
}
