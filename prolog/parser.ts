import type { Token } from "./lexer";
import * as AST from "./ast";

export function parseToKnowledgeBase(tokens: Token[]): AST.KnowledgeBase {
  throw new Error("Not implemented");
}

export function parseToQuery(tokens: Token[]): AST.Query {
  throw new Error("Not implemented");
}
