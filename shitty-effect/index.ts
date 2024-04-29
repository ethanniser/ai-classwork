import { pipe } from "effect";

type IO<A> = SyncOp<A> | AsyncOp<A> | FlatMap<A> | All<A>;

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

class All<A> {
  readonly _A!: () => A;
  readonly _tag = "All";
  constructor(public readonly ios: IO<unknown>[]) {}
}

function sync<A>(op: () => A): IO<A> {
  return new SyncOp(op);
}

function async<A>(op: () => Promise<A>): IO<A> {
  return new AsyncOp(op);
}

function flatMap<A, B>(io: IO<A>, f: (a: A) => IO<B>): IO<B> {
  return new FlatMap(io, f as any);
}

function all<A>(ios: IO<A>[]): IO<A[]> {
  return new All(ios);
}

class Fiber<A> {
  private continuationStack: Array<(a: any) => IO<any>> = [];
  private currentOperation: IO<any>;
  private onDone: (a: A) => void;
  private hasExited: boolean = false;

  constructor(startOp: IO<A>, onDone: (a: A) => void) {
    this.currentOperation = startOp;
    this.onDone = onDone;
  }

  public run(): void {
    let steps = 0;

    while (!this.hasExited && steps < 100) {
      switch (this.currentOperation._tag) {
        case "SyncOp":
          const syncOp = this.currentOperation;
          const result = syncOp.op();
          this.advance(result);
          break;
        case "AsyncOp":
          const asyncOp = this.currentOperation;
          asyncOp.op().then((result) => {
            this.advance(result);
            this.run();
          });
          return; // Break loop for async operation bc theres nothing to do
        case "FlatMap":
          const flatMapOp = this.currentOperation;
          this.continuationStack.push(flatMapOp.f);
          this.currentOperation = flatMapOp.io;
          break;
        default:
          throw new Error("Unsupported IO type");
      }
      steps++;
    }

    if (!this.hasExited) {
      // Yield execution after 100 steps
      setImmediate(() => this.run());
    }
  }

  private advance(value: any): void {
    if (this.continuationStack.length > 0) {
      const next = this.continuationStack.pop();
      this.currentOperation = next!(value);
    } else {
      // No more continuations, call final handler
      this.hasExited = true;
      this.onDone(value);
    }
  }
}

// const program = pipe(
//   sync(() => Math.random()),
//   (prev) => flatMap(prev, (n) => sync(() => Math.trunc(n * 100))),
//   (prev) =>
//     flatMap(prev, (n) =>
//       async(() => fetch(`https://jsonplaceholder.typicode.com/todos/${n}`))
//     ),
//   (prev) => flatMap(prev, (res) => async(() => res.text()))
// );

// const fiber = new Fiber(program, (a) => console.log(a)).run();

let i = 0;
const spinProgram: IO<never> = flatMap(
  sync(() => (i++ % 10000000 === 0 ? console.log("spin: ", i) : void 0)),
  () => spinProgram
);

const logProgram: IO<never> = pipe(
  sync(() => console.log("im awake!")),
  (prev) =>
    flatMap(prev, () =>
      async(() => new Promise((resolve) => setTimeout(resolve, 500)))
    ),
  (prev) => flatMap(prev, () => logProgram)
);

const fiber1 = new Fiber(spinProgram, () => {}).run();
const fiber2 = new Fiber(logProgram, () => {}).run();

// keep awake
await new Promise((resolve) => setTimeout(resolve, 1000));
