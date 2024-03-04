import * as AST from "./ast";
import { PrologError } from "./error";

type NonEmptyArray<T> = [T, ...T[]];

type Bindings = Map<string, NonEmptyArray<AST.Term>>;

export type QueryResult =
  | {
      readonly _tag: "QueryResult";
      readonly success: true;
      readonly bindings?: Bindings;
    }
  | {
      readonly _tag: "QueryResult";
      readonly success: false;
    };

function QueryResult(success: true, bindings: Bindings): QueryResult;
function QueryResult(success: false): QueryResult;
function QueryResult(success: boolean, bindings?: Bindings): QueryResult {
  return success
    ? { _tag: "QueryResult", success, bindings: bindings! }
    : { _tag: "QueryResult", success };
}

interface Interpreter {
  readonly query: (query: AST.Query) => QueryResult;
}

export function loadInterpreter(knowledgeBase: AST.KnowledgeBase): Interpreter {
  return new InterpreterImpl(knowledgeBase);
}

class InterpreterImpl implements Interpreter {
  private initialBindings: Bindings;

  constructor(knowledgeBase: AST.KnowledgeBase) {
    const bindings = new Map<string, NonEmptyArray<AST.Term>>();
    for (const rule of knowledgeBase.rules) {
      const values = bindings.get(rule.head.name);
      if (values) {
        values.push(rule.body);
      } else {
        bindings.set(rule.head.name, [rule.body]);
      }
    }
    this.initialBindings = bindings;
    console.log(this.initialBindings.get("f")![0]);
  }

  public query(query: AST.Query): QueryResult {
    throw new Error("Not implemented");
  }

  private cloneBindings(bindings: Bindings): Bindings {
    return new Map(bindings);
  }
}
