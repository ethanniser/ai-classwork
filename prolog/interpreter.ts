import * as AST from "./ast";
import { UnknownFunctorError } from "./error";

type NonEmptyArray<T> = [T, ...T[]];

type Bindings = Record<string, NonEmptyArray<AST.Term>>;

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

function QueryResult(success: true, bindings: Bindings): QueryResult;
function QueryResult(success: false): QueryResult;
function QueryResult(success: boolean, bindings?: Bindings): QueryResult {
  return success
    ? { _tag: "QueryResult", success, bindings: bindings! }
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
    throw new Error("Not implemented");
  }

  private evaluateRule(
    rule: AST.Rule,
    query: AST.Query,
    bindings: Bindings
  ): QueryResult {
    throw new Error("Not implemented");
  }

  private backtrack(
    query: AST.Query,
    path: AST.Rule[],
    bindings: Bindings
  ): QueryResult {
    throw new Error("Not implemented");
  }

  private unify(
    term1: AST.Term,
    term2: AST.Term,
    currentBindings: Bindings
  ): Bindings | null {
    throw new Error("Not implemented");
  }

  private applyBindings(term: AST.Term, bindings: Bindings): AST.Term {
    throw new Error("Not implemented");
  }

  private cloneBindings(bindings: Bindings): Bindings {
    return structuredClone(bindings);
  }
}
