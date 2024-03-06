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
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [],
    });
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
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [],
    });
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
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [],
    });
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

  it("can calculate a variable query with one result", () => {
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
        arguments: [{ _tag: "Variable", name: "X" }],
      },
    });
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [
        new Map([["X", { _tag: "Functor", name: "bar", arguments: [] }]]),
      ],
    });
  });
  it("can calculate a variable query with multiple results", () => {
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
      bindings: [
        new Map([["X", { _tag: "Functor", name: "bar", arguments: [] }]]),
        new Map([["X", { _tag: "Functor", name: "baz", arguments: [] }]]),
      ],
    });
  });
  it("can calculate a nested variable query", () => {
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
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "f",
            arguments: [{ _tag: "Variable", name: "W" }],
          },
          body: {
            _tag: "Functor",
            name: "foo",
            arguments: [{ _tag: "Variable", name: "W" }],
          },
        },
      ],
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "f",
        arguments: [{ _tag: "Variable", name: "X" }],
      },
    });
    expect(result).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [
        new Map([["X", { _tag: "Functor", name: "bar", arguments: [] }]]),
        new Map([["X", { _tag: "Functor", name: "baz", arguments: [] }]]),
      ],
    });
  });
  it("can evaluate rules with 'and'", () => {
    const knowledgeBase: KnowledgeBase = {
      _tag: "KnowledgeBase",
      rules: [
        {
          _tag: "Rule",
          head: {
            _tag: "Functor",
            name: "baz",
            arguments: [{ _tag: "Functor", name: "foo", arguments: [] }],
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
            arguments: [{ _tag: "Functor", name: "notfoo", arguments: [] }],
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
            name: "bar",
            arguments: [{ _tag: "Functor", name: "foo", arguments: [] }],
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
            name: "both",
            arguments: [{ _tag: "Variable", name: "W" }],
          },
          body: {
            _tag: "Functor",
            name: ",",
            arguments: [
              {
                _tag: "Functor",
                name: "bar",
                arguments: [{ _tag: "Variable", name: "W" }],
              },
              {
                _tag: "Functor",
                name: "baz",
                arguments: [{ _tag: "Variable", name: "W" }],
              },
            ],
          },
        },
      ],
    };

    const interpreter = loadInterpreter(knowledgeBase);
    const result1 = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "both",
        arguments: [{ _tag: "Functor", name: "foo", arguments: [] }],
      },
    });
    expect(result1).toEqual({
      _tag: "QueryResult",
      success: true,
      bindings: [],
    });
    const result2 = interpreter.query({
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "both",
        arguments: [{ _tag: "Functor", name: "notfoo", arguments: [] }],
      },
    });
    expect(result2).toEqual({
      _tag: "QueryResult",
      success: false,
    });
  });
});
