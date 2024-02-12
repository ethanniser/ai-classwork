import * as AST from "./ast";

interface BooleanResult {
  readonly _tag: "BooleanResult";
  readonly success: boolean;
}

interface BindingsResult {
  readonly _tag: "BindingsResult";
  readonly success: boolean;
  readonly bindings: Map<string, string>;
}

export type QueryResult = BooleanResult | BindingsResult;

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

class InterpreterImpl implements Interpreter {
  constructor(knowledgeBase: AST.KnowledgeBase) {}

  public query(query: AST.Query): QueryResult {
    throw new Error("Not implemented");
  }
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}
