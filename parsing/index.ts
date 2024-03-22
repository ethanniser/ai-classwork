import * as ohm from "ohm-js";

const grammar = await Bun.file("./parsing/prolog.ohm").text();
const parser = ohm.grammar(grammar);
const s = parser.createSemantics();
s.addOperation("idk", {
    
})

const input = `foo(bar).`;
const match = parser.match(input);

if (match.succeeded()) {
  const result = s(match);
  console.log(result);
}
