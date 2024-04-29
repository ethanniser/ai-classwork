import { pipe } from "effect";
import { dual } from "effect/Function";

type IO<A> = SyncOp<A> | AsyncOp<A> | FlatMap<A> | Gen<A>;

class SyncOp<A> {
  readonly _tag = "SyncOp";
  constructor(public readonly op: () => A) {}
}

class AsyncOp<A> {
  readonly _tag = "AsyncOp";
  constructor(public readonly op: () => Promise<A>) {}
}

class FlatMap<A> {
  readonly _A!: () => A;
  readonly _tag = "FlatMap";
  constructor(
    public readonly io: IO<unknown>,
    public readonly f: (a: unknown) => IO<unknown>
  ) {}
}

class Gen<A> {
  readonly _tag = "Gen";
  constructor(public readonly gen: () => Generator<IO<any>, A, any>) {}
}

function sync<A>(op: () => A): IO<A> {
  return new SyncOp(op);
}

function async<A>(op: () => Promise<A>): IO<A> {
  return new AsyncOp(op);
}

const flatMap: {
  <A, B>(io: IO<A>, f: (a: A) => IO<B>): IO<B>;
  <A, B>(f: (a: A) => IO<B>): (io: IO<A>) => IO<B>;
} = dual(
  2,
  <A, B>(io: IO<A>, f: (a: A) => IO<B>): IO<B> => new FlatMap(io, f as any)
);

function gen<A>(gen: () => Generator<IO<any>, A, any>): IO<A> {
  return new Gen(gen);
}

class Fiber<A> {
  private continuationStack: Array<FlatMap<any> | Generator<any>> = [];
  private currentOperation: IO<any>;
  private onDone: (a: A) => void;
  private hasExited: boolean = false;

  constructor(startOp: IO<A>, onDone?: (a: A) => void) {
    this.currentOperation = startOp;
    this.onDone = onDone ?? (() => {});
  }

  public run(): void {
    let steps = 0;

    while (!this.hasExited && steps < 100) {
      switch (this.currentOperation._tag) {
        case "SyncOp": {
          const syncOp = this.currentOperation;
          const result = syncOp.op();
          this.advance(result);
          break;
        }
        case "AsyncOp": {
          const asyncOp = this.currentOperation;
          asyncOp.op().then((result) => {
            this.advance(result);
            this.run();
          });
          return; // Break loop for async operation bc theres nothing to do
        }
        case "FlatMap": {
          const flatMapOp = this.currentOperation;
          this.continuationStack.push(flatMapOp);
          this.currentOperation = flatMapOp.io;
          break;
        }
        case "Gen": {
          const genOp = this.currentOperation;
          const gen = genOp.gen();
          const next = gen.next();
          if (next.done) {
            this.advance(next.value);
          } else {
            this.continuationStack.push(gen);
            this.currentOperation = next.value;
          }
          break;
        }
        default:
          throw new Error("Unsupported operation");
      }
      steps++;
    }

    if (!this.hasExited) {
      // Yield execution after 100 steps
      setImmediate(() => this.run());
      // setTimeout(() => this.run(), 0);
    }
  }

  private advance(value: any): void {
    if (this.continuationStack.length > 0) {
      const cont = this.continuationStack.pop()!;
      // this.currentOperation = next!(value);
      if (cont instanceof FlatMap) {
        this.currentOperation = cont.f(value);
      } else {
        // gen
        const next = cont.next(value);
        if (next.done) {
          this.advance(next.value);
        } else {
          this.continuationStack.push(cont);
          this.currentOperation = next.value;
        }
      }
    } else {
      // No more continuations, call final handler
      this.hasExited = true;
      this.onDone(value);
    }
  }
}

const asyncInterval = (id: number, ms: number) =>
  gen(function* () {
    let i = 0;
    while (true) {
      yield sync(() => console.log(`[${id}] interval ${i++}`));
      yield async(() => new Promise((resolve) => setTimeout(resolve, ms)));
    }
  });

const spinInterval = (id: number, initial: number = 0) =>
  gen(function* () {
    let i = initial;
    while (true) {
      yield sync(() => i++);
      if (i % 1000 === 0) {
        yield sync(() => console.log(`[${id}] count: ${i}`));
      }
    }
  });

new Fiber(spinInterval(1)).run();
new Fiber(spinInterval(2, 500)).run();
new Fiber(asyncInterval(3, 2000)).run();

// const program = gen(function* () {
//   const res: Response = yield async(() =>
//     fetch("https://jsonplaceholder.typicode.com/todos/1")
//   );
//   const text: string = yield async(() => res.text());
//   yield sync(() => console.log(text));
// });

// new Fiber(program).run();
