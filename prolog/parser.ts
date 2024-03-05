import type { Token } from "./lexer";
import * as AST from "./ast";
import { PrologError } from "./error";

export function parseToKnowledgeBase(tokens: Token[]): AST.KnowledgeBase {
  const rules: AST.Rule[] = [];
  let i = 0;

  while (i < tokens.length) {
    const head = parseFunctor();
    let body: AST.Functor;

    // Check for rule separator and parse the body accordingly
    if (tokens[i]?.type === "ruleSeparator") {
      i++; // Skip rule separator
      body = parseBody();
    } else {
      // If there is no body, use a 'true' functor to represent an empty body
      body = { _tag: "Functor", name: "true", arguments: [] };
    }
    rules.push({ _tag: "Rule", head, body });

    if (tokens[i]?.type === "period") {
      i++; // Skip period
    } else {
      throw new PrologError("Expected a period");
    }
  }
  return { _tag: "KnowledgeBase", rules };

  function parseFunctor(): AST.Functor {
    const nextToken = tokens[i];
    if (nextToken?.type !== "identifier")
      throw new PrologError("Expected an identifier");
    const name = nextToken.value;
    const args: AST.Functor[] = [];
    i++; // Move past the functor name

    if (tokens[i]?.type === "openParen") {
      i++; // Skip open parenthesis
      while (tokens[i] && tokens[i]!.type !== "closeParen") {
        args.push(parseFunctor());
        if (tokens[i]?.type === "comma") i++; // Skip comma
      }
      if (tokens[i]?.type === "closeParen")
        i++; // Skip close parenthesis
      else throw new PrologError("Expected a closing parenthesis");
    }
    return { _tag: "Functor", name, arguments: args };
  }

  function parseBody(): AST.Functor {
    const args: AST.Functor[] = [];
    while (i < tokens.length && tokens[i]!.type !== "period") {
      const functor = parseFunctor();
      args.push(functor);
      // Check for the comma separator between functors in the body
      if (tokens[i]?.type === "comma") i++; // Skip comma
    }

    // If there's only one functor in the body, return it directly without wrapping in ","
    if (args.length === 1) return args[0]!;

    return { _tag: "Functor", name: ",", arguments: args };
  }
}

export function parseToQuery(tokens: Token[]): AST.Query {
  let i = 0;

  const goal = parseFunctor();
  return { _tag: "Query", goal };

  function parseFunctor(): AST.Functor {
    const nextToken = tokens[i];
    if (nextToken?.type !== "identifier")
      throw new PrologError("Expected an identifier");
    const name = nextToken.value;
    const args: AST.Functor[] = [];
    i++; // Move past the functor name

    if (tokens[i]?.type === "openParen") {
      i++; // Skip open parenthesis
      while (tokens[i] && tokens[i]!.type !== "closeParen") {
        args.push(parseFunctor());
        if (tokens[i]?.type === "comma") i++; // Skip comma
      }
      if (tokens[i]?.type === "closeParen")
        i++; // Skip close parenthesis
      else throw new PrologError("Expected a closing parenthesis");
    }
    return { _tag: "Functor", name, arguments: args };
  }
}
