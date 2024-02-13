import * as AST from "./ast";

export class PrologError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownFunctorError extends PrologError {
  constructor(public functor: AST.Functor) {
    super(`Unknown functor: ${functor.name}/${functor.arguments.length}`);
  }
}
