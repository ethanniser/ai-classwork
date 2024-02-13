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
      console.log(result ? "true." : "false.");
      // TODO: Add Variables
      // switch (result._tag) {
      //   case "BooleanResult":
      //     console.log(result.success ? "true." : "false.");
      //     break;
      // case "BindingsResult":
      //   if (!result.success) {
      //     console.log("false.");
      //   } else {
      //     for (const [variable, value] of result.bindings) {
      //       console.log(`${variable} = ${value}`);
      //     }
      //   }
      // }
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
