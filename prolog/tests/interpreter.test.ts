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
    expect(result).toEqual({ _tag: "QueryResult", success: true });
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
    expect(result).toEqual({ _tag: "QueryResult", success: true });
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
    expect(result).toEqual({ _tag: "QueryResult", success: true });
  });

  it("returns false when the query is not provable", () => {
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

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "foo",
        arguments: [
          {
            _tag: "Functor",
            name: "baz",
            arguments: [],
          },
        ],
      },
    });
    expect(result).toEqual({ _tag: "QueryResult", success: false });
  });

  it("throws when no rule exists", () => {
    const knowledgeBase: KnowledgeBase = {
      _tag: "KnowledgeBase",
      rules: [],
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = () =>
      interpreter.query({
        _tag: "Query",
        goal: {
          _tag: "Functor",
          name: "foo",
          arguments: [],
        },
      });
    expect(result).toThrow();
  });

  it("can calculate a variable query", () => {
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
            name: "foo",
            arguments: [{ _tag: "Functor", name: "baz", arguments: [] }],
          },
          body: {
            _tag: "Functor",
            name: "true",
            arguments: [],
          },
        },
      ],
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "foo",
        arguments: [{ _tag: "Variable", name: "X" }],
      },
    });
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: new Map([
        [
          "X",
          [
            { _tag: "Functor", name: "bar", arguments: [] },
            { _tag: "Functor", name: "baz", arguments: [] },
          ],
        ],
      ]),
    });
  });
});
