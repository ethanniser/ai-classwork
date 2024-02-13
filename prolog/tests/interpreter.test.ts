import { describe, it, expect } from "bun:test";
import type { KnowledgeBase, Query } from "../ast";
import { loadInterpreter } from "../interpreter";

describe("interepreter", () => {
  it("can evaluate basic rule", () => {
    const knowledgeBase: KnowledgeBase = {
      _tag: "KnowledgeBase",
      rules: [
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "foo",
            arguments: [],
          },
          body: {
            _tag: "Functor",
            name: "true",
            arguments: [],
          },
        },
      ],
    };
    const query: Query = {
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "foo",
        arguments: [],
      },
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query(query);
    expect(result).toEqual({ _tag: "BooleanResult", success: true });
  });
});
