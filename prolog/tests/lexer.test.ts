import { type Token, tokenize } from "../lexer";
import { describe, it, expect } from "bun:test";
import { InvalidSyntaxError } from "../error";

describe("lexer", () => {
  it("can tokenize an identifier", () => {
    const input = "foo";
    const result = tokenize(input);
    expect(result).toEqual([{ type: "identifier", value: "foo" }]);
  });
  it("can tokenize parens", () => {
    const input = "()";
    const result = tokenize(input);
    expect(result).toEqual([{ type: "openParen" }, { type: "closeParen" }]);
  });
  it("can tokenize a period", () => {
    const input = ".";
    const result = tokenize(input);
    expect(result).toEqual([{ type: "period" }]);
  });
  it("can tokenize a rule separator", () => {
    const input = ":-";
    const result = tokenize(input);
    expect(result).toEqual([{ type: "ruleSeparator" }]);
  });
  it("can tokenize a basic rule", () => {
    const input = "foo(bar) :- baz(bar).";
    const result = tokenize(input);
    expect(result).toEqual([
      { type: "identifier", value: "foo" },
      { type: "openParen" },
      { type: "identifier", value: "bar" },
      { type: "closeParen" },
      { type: "ruleSeparator" },
      { type: "identifier", value: "baz" },
      { type: "openParen" },
      { type: "identifier", value: "bar" },
      { type: "closeParen" },
      { type: "period" },
    ]);
  });
});
