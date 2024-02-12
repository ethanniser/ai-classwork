import * as AST from "./ast";

interface Interpreter {
  readonly query: (query: AST.Query) => boolean;
}

class InterpreterImpl implements Interpreter {
  private knowledgeBase: AST.KnowledgeBase;

  constructor(knowledgeBase: AST.KnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  public query(query: AST.Query): boolean {
    throw new Error("Not implemented");
  }
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}
