import { InvalidSyntaxError } from "./error";
export type Token =
  | { type: "identifier"; value: string }
  | { type: "openParen" }
  | { type: "closeParen" }
  | { type: "period" }
  | { type: "ruleSeparator" };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i]!;
    if (char === "(") {
      tokens.push({ type: "openParen" });
      i++;
    } else if (char === ")") {
      tokens.push({ type: "closeParen" });
      i++;
    } else if (char === ".") {
      tokens.push({ type: "period" });
      i++;
    } else if (char === ":") {
      const nextChar = input[i + 1];
      if (nextChar) {
        tokens.push({ type: "ruleSeparator" });
        i += 2;
      } else {
        throw new InvalidSyntaxError(
          nextChar ?? "EOF",
          "Expected a rule separator"
        );
      }
    } else if (char.match(/[a-z]/i)) {
      let value = "";
      while (i < input.length && input[i]!.match(/[a-z]/i)) {
        value += input[i];
        i++;
      }
      tokens.push({ type: "identifier", value });
    } else {
      i++;
    }
  }
  return tokens;
}
