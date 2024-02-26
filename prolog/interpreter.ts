import * as AST from "./ast";
import { UnknownFunctorError } from "./error";

interface BooleanResult {
  readonly _tag: "BooleanResult";
  readonly success: boolean;
}

function BooleanResult(success: boolean): BooleanResult {
  return { _tag: "BooleanResult", success };
}

type BindingsResult =
  | {
      readonly _tag: "BindingsResult";
      readonly success: true;
      readonly bindings: Map<string, string>;
    }
  | {
      readonly _tag: "BindingsResult";
      readonly success: false;
    };

function BindingsResult({
  success,
  bindings,
}: {
  success: true;
  bindings: Map<string, string>;
}): BindingsResult;
function BindingsResult({ success }: { success: false }): BindingsResult;
function BindingsResult({
  success,
  bindings,
}: {
  success: boolean;
  bindings?: Map<string, string>;
}): BindingsResult {
  if (success) {
    return { _tag: "BindingsResult", success: true, bindings: bindings! };
  } else {
    return { _tag: "BindingsResult", success: false };
  }
}

export type QueryResult = BooleanResult | BindingsResult;

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}

// rethink
const builtInFunctors: AST.Rule[] = [];

class InterpreterImpl implements Interpreter {
  private rules: AST.Rule[];

  constructor(knowledgeBase: AST.KnowledgeBase) {
    this.rules = knowledgeBase.rules.concat(builtInFunctors);
  }

  public query(query: AST.Query): QueryResult {
    return this.evaluateFunctor(query.goal);
  }

  private evaluateFunctor(functor: AST.Functor): QueryResult {
    if (functor.name === "halt" && functor.arguments.length === 0) {
      process.exit(0);
    } else if (functor.name === "true" && functor.arguments.length === 0) {
      return BooleanResult(true);
    } else {
      const rule = this.rules.find((rule) => {
        return (
          rule.head.name === functor.name &&
          rule.head.arguments.length === functor.arguments.length
        );
      });
      if (!rule) {
        throw new UnknownFunctorError(functor);
      }
      return this.evaluateRule(rule, functor);
    }
  }

  private evaluateRule(rule: AST.Rule, value: AST.Functor): QueryResult {
    if (this.compareFunctors(rule.head, value)) {
      return this.evaluateFunctor(rule.body);
    } else {
      return BooleanResult(false);
    }
  }

  private compareFunctors(
    functor1: AST.Functor,
    functor2: AST.Functor
  ): boolean {
    return (
      functor1.name === functor2.name &&
      functor1.arguments.length === functor2.arguments.length &&
      functor1.arguments.every((arg, i) => {
        const self = arg;
        const other = functor2.arguments[i]!;
        const selfIsFunctor = self._tag === "Functor";
        const otherIsFunctor = other._tag === "Functor";
        if (selfIsFunctor && otherIsFunctor) {
          return this.compareFunctors(self, other);
        } else {
          throw new Error("Not implemented");
        }
      })
    );
  }
}
