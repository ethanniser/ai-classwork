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

export class InvalidSyntaxError extends PrologError {
  constructor(public token: string, public explanation: string) {
    super(`Invalid syntax: \"${token}\" - ${explanation}`);
  }
}

export class InvalidQueryError extends PrologError {
  constructor(public rule: AST.Rule, public explanation: string) {
    super(`Invalid query - ${explanation}`);
  }
}
