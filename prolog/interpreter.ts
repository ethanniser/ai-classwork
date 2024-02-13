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

export type QueryResult = BooleanResult | BindingsResult;

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

class InterpreterImpl implements Interpreter {
  private knowledgeBase: AST.KnowledgeBase;

  constructor(knowledgeBase: AST.KnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  public query(query: AST.Query): QueryResult {
    throw new Error("Not implemented");
  }
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}
