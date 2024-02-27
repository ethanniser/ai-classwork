import { tokenize } from "./lexer";
import { parseToKnowledgeBase, parseToQuery } from "./parser";
import { loadInterpreter } from "./interpreter";
import { readFileSync } from "node:fs";
import readline from "node:readline";
import { PrologError } from "./error";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (prompt: string) =>
  new Promise<string>((resolve) => {
    rl.question(prompt, resolve);
  });

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: prolog <input>");
    process.exit(1);
  }

  const input = readFileSync(inputFile, "utf8");
  const knowledgeBaseTokens = tokenize(input);
  const knowledgeBase = parseToKnowledgeBase(knowledgeBaseTokens);
  const interpreter = loadInterpreter(knowledgeBase);

  while (true) {
    const query = await question("?- ");
    try {
      const queryTokens = tokenize(query);
      const parsedQuery = parseToQuery(queryTokens);
      const result = interpreter.query(parsedQuery);
      if (result.success) {
        if (result.bindings) {
          for (const variable in result.bindings) {
            console.log(
              `${variable} = ${result.bindings[variable]!.join(", ")}`
            );
          }
        } else {
          console.log("true.");
        }
      } else {
        console.log("false.");
      }
    } catch (e) {
      if (e instanceof PrologError) {
        console.error(e.message);
      } else {
        throw e;
      }
    }
  }
}

main();
