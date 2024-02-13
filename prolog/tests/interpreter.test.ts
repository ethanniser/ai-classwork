import { describe, it, expect } from "bun:test";
import type { KnowledgeBase, Query } from "../ast";
import { loadInterpreter } from "../interpreter";

describe("interepreter", () => {
  it("can evaluate arity 0 exists", () => {
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
    expect(result).toBeTrue();
  });
  it("can evaluate arity 1 exists", () => {
    const knowledgeBase: KnowledgeBase = {
      _tag: "KnowledgeBase",
      rules: [
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "foo",
            arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
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
        arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
      },
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query(query);
    expect(result).toBeTrue();
  });

  it("can evaluate nested rules", () => {
    const knowledgeBase: KnowledgeBase = {
      _tag: "KnowledgeBase",
      rules: [
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "foo",
            arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
          },
          body: {
            _tag: "Functor",
            name: "true",
            arguments: [],
          },
        },
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "baz",
            arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
          },
          body: {
            _tag: "Functor",
            name: "foo",
            arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
          },
        },
      ],
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "baz",
        arguments: [{ _tag: "Functor", name: "bar", arguments: [] }],
      },
    });
    expect(result).toBeTrue();
  });
});
