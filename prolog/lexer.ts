import { InvalidSyntaxError } from "./error";
export type Token =
  | { type: "identifier"; value: string }
  | { type: "openParen" }
  | { type: "closeParen" }
  | { type: "period" }
  | { type: "comma" }
  | { type: "ruleSeparator" };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];

    switch (char) {
      case "%":
        while (input[i] !== "\n" && i < input.length) {
          i++;
        }
        i++; // Skip the newline or end of input
        break;

      case "(":
        tokens.push({ type: "openParen" });
        i++;
        break;

      case ")":
        tokens.push({ type: "closeParen" });
        i++;
        break;

      case ".":
        tokens.push({ type: "period" });
        i++;
        break;

      case ",":
        tokens.push({ type: "comma" });
        i++;
        break;

      case ":":
        const nextChar = input[i + 1];
        if (nextChar) {
          tokens.push({ type: "ruleSeparator" });
          i += 2;
        } else {
          throw new InvalidSyntaxError(
            nextChar ?? "EOF",
            "Expected a rule separator",
          );
        }
        break;

      default:
        if (char?.match(/[a-z]/i)) {
          let value = "";
          while (i < input.length && input[i]!.match(/[a-z]/i)) {
            value += input[i];
            i++;
          }
          tokens.push({ type: "identifier", value });
        } else {
          i++; // Skip unrecognized characters
        }
    }
  }
  return tokens;
}
