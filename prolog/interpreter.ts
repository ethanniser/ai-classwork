import * as AST from "./ast";

interface Interpreter {
  readonly query: (query: AST.Query) => boolean;
}

class InterpreterImpl implements Interpreter {
  constructor(knowledgeBase: AST.KnowledgeBase) {}

  public query(query: AST.Query): boolean {
    throw new Error("Not implemented");
  }
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}
