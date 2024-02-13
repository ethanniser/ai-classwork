import { describe, it, expect } from "bun:test";
import { tokenize } from "../lexer";
import { parseToKnowledgeBase, parseToQuery } from "../parser";
import type { Rule, Query } from "../ast";

function toAst(input: string): Rule[] {
  const tokens = tokenize(input);
  return parseToKnowledgeBase(tokens).rules;
}

describe("parsing functors with no 'body'", () => {
  it("parses a arity 0 functor", () => {
    const input = "foo.";
    const input2 = "foo().";
    const input3 = "foo :- true.";
    const input4 = "foo() :- true.";
    const expected: Rule[] = [
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
    ];

    expect(toAst(input)).toEqual(expected);
    expect(toAst(input2)).toEqual(expected);
    expect(toAst(input3)).toEqual(expected);
    expect(toAst(input4)).toEqual(expected);
  });

  it("parses a non 0  functor", () => {
    const input = "foo(bar, baz).";
    const input2 = "foo(bar, baz) :- true.";
    const expected: Rule[] = [
      {
        _tag: "Rule",
        head: {
          _tag: "Functor",
          name: "foo",
          arguments: [
            {
              _tag: "Functor",
              name: "bar",
              arguments: [],
            },
            {
              _tag: "Functor",
              name: "baz",
              arguments: [],
            },
          ],
        },
        body: {
          _tag: "Functor",
          name: "true",
          arguments: [],
        },
      },
    ];

    expect(toAst(input)).toEqual(expected);
    expect(toAst(input2)).toEqual(expected);
  });
});

describe("parsing functors with 'body'", () => {
  it("parses a one rule body", () => {
    const input = "foo :- bar.";
    const expected: Rule[] = [
      {
        _tag: "Rule",
        head: {
          _tag: "Functor",
          name: "foo",
          arguments: [],
        },
        body: {
          _tag: "Functor",
          name: "bar",
          arguments: [],
        },
      },
    ];

    expect(toAst(input)).toEqual(expected);
  });

  it("parses a non one rule body", () => {
    const input = "foo :- bar, baz.";
    const expected: Rule[] = [
      {
        _tag: "Rule",
        head: {
          _tag: "Functor",
          name: "foo",
          arguments: [],
        },
        body: {
          _tag: "Functor",
          name: ",",
          arguments: [
            {
              _tag: "Functor",
              name: "bar",
              arguments: [],
            },
            {
              _tag: "Functor",
              name: "baz",
              arguments: [],
            },
          ],
        },
      },
    ];

    expect(toAst(input)).toEqual(expected);
  });

  it("parses a nested body", () => {
    const input = "foo(bar) :- bar(baz, bob), biz(baz).";
    const expected: Rule[] = [
      {
        _tag: "Rule",
        head: {
          _tag: "Functor",
          name: "foo",
          arguments: [
            {
              _tag: "Functor",
              name: "bar",
              arguments: [],
            },
          ],
        },
        body: {
          _tag: "Functor",
          name: ",",
          arguments: [
            {
              _tag: "Functor",
              name: "bar",
              arguments: [
                {
                  _tag: "Functor",
                  name: "baz",
                  arguments: [],
                },
                {
                  _tag: "Functor",
                  name: "bob",
                  arguments: [],
                },
              ],
            },
            {
              _tag: "Functor",
              name: "biz",
              arguments: [
                {
                  _tag: "Functor",
                  name: "baz",
                  arguments: [],
                },
              ],
            },
          ],
        },
      },
    ];

    expect(toAst(input)).toEqual(expected);
  });
});

describe("parsing queries", () => {
  it("parses a query", () => {
    const input = "foo(bar).";
    const expected: Query = {
      _tag: "Query",
      goal: {
        _tag: "Functor",
        name: "foo",
        arguments: [
          {
            _tag: "Functor",
            name: "bar",
            arguments: [],
          },
        ],
      },
    };

    expect(parseToQuery(tokenize(input))).toEqual(expected);
  });
});

// describe("built ins", () => {
//   it("or", () => {
//     const input = "foo :- baz ; biz.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "foo",
//           arguments: [],
//         },
//         body: {
//           _tag: "Functor",
//           name: ";",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "baz",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "biz",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];

//     expect(toAst(input)).toEqual(expected);
//   });

//   it("cut", () => {
//     const input = "foo :- baz, !, biz.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "foo",
//           arguments: [],
//         },
//         body: {
//           _tag: "Functor",
//           name: ",",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "baz",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "!",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "biz",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];

//     expect(toAst(input)).toEqual(expected);
//   });

//   it("not", () => {
//     const input = "foo :- \\+ baz.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "foo",
//           arguments: [],
//         },
//         body: {
//           _tag: "Functor",
//           name: "\\+",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "baz",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];

//     expect(toAst(input)).toEqual(expected);
//   });

//   it("=", () => {
//     const input = "foo = bar.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "=",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "foo",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "bar",
//               arguments: [],
//             },
//           ],
//         },
//         body: {
//           _tag: "Functor",
//           name: ",",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "true",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];
//     expect(toAst(input)).toEqual(expected);
//   });
//   it("==", () => {
//     const input = "foo == bar.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "==",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "foo",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "bar",
//               arguments: [],
//             },
//           ],
//         },
//         body: {
//           _tag: "Functor",
//           name: ",",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "true",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];
//     expect(toAst(input)).toEqual(expected);
//   });

//   it("\\= and \\==", () => {
//     const input = "foo \\= bar, foo \\== bar.";
//     const expected: Rule[] = [
//       {
//         _tag: "Rule",
//         head: {
//           _tag: "Functor",
//           name: "\\=",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "foo",
//               arguments: [],
//             },
//             {
//               _tag: "Functor",
//               name: "bar",
//               arguments: [],
//             },
//           ],
//         },
//         body: {
//           _tag: "Functor",
//           name: ",",
//           arguments: [
//             {
//               _tag: "Functor",
//               name: "\\==",
//               arguments: [
//                 {
//                   _tag: "Functor",
//                   name: "foo",
//                   arguments: [],
//                 },
//                 {
//                   _tag: "Functor",
//                   name: "bar",
//                   arguments: [],
//                 },
//               ],
//             },
//             {
//               _tag: "Functor",
//               name: "true",
//               arguments: [],
//             },
//           ],
//         },
//       },
//     ];
//     expect(toAst(input)).toEqual(expected);
//   });
// });
