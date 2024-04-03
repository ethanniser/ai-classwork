import * as ohm from "ohm-js";

const grammar = await Bun.file("./parsing/prolog.ohm").text();
const parser = ohm.grammar(grammar);
const semantics = parser.createSemantics();
/*
Statement = (Rule | Functor) "."
  
  Functor = (Identifier | Variable) ("(" ListOf<Functor, ",">  ")")?
  Rule = Functor ":-" ListOf<Functor, ",">
    
  Identifier = lower letter*
  Variable = upper letter*
*/
semantics.addOperation("idk", {
  Statement(one: any, two: any) {
    return one.idk();
  },
  Functor(one: any, two: any, three: any, four: any) {
    // console.log([one, two, three, four]);
  },
  Rule(one: any, two: any, three: any) {
    // console.log([one, two, three]);
  },
});

const input = `foo(bar).`;
const match = parser.match(input);

if (match.succeeded()) {
  const result = semantics(match).idk();
  console.log(result);
}
