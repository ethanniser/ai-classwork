import * as AST from "./ast";

interface BooleanResult {
  readonly _tag: "BooleanResult";
  readonly success: boolean;
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

// TODO: Add Variables
// export type QueryResult = BooleanResult | BindingsResult;
export type QueryResult = BooleanResult;

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}

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
    if (functor.name === "true" && functor.arguments.length === 0) {
      return { _tag: "BooleanResult", success: true };
    } else {
      const rule = this.rules.find((rule) => {
        return (
          rule.head.name === functor.name &&
          rule.head.arguments.length === functor.arguments.length
        );
      });
      if (!rule) {
        throw new Error(
          `No rule found for ${functor.name}/${functor.arguments.length}`
        );
      }
      return this.evaluateRule(rule);
    }
  }

  private evaluateRule(rule: AST.Rule): QueryResult {
    return this.evaluateFunctor(rule.body);
  }
}
