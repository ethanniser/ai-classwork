import { pipe } from "effect";
import { dual } from "effect/Function";

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

const flatMap: {
  <A, B>(io: IO<A>, f: (a: A) => IO<B>): IO<B>;
  <A, B>(f: (a: A) => IO<B>): (io: IO<A>) => IO<B>;
} = dual(
  2,
  <A, B>(io: IO<A>, f: (a: A) => IO<B>): IO<B> => new FlatMap(io, f as any)
);

function all<A>(ios: IO<A>[]): IO<A[]> {
  return new All(ios);
}

let idCounter = 0;
class Fiber<A> {
  private continuationStack: Array<(a: any) => IO<any>> = [];
  private currentOperation: IO<any>;
  private onDone: (a: A) => void;
  private hasExited: boolean = false;
  private id: number;

  constructor(startOp: IO<A>, onDone: (a: A) => void) {
    this.currentOperation = startOp;
    this.onDone = onDone;
    this.id = idCounter++;
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
          this.continuationStack.push(flatMapOp.f);
          this.currentOperation = flatMapOp.io;
          break;
        }
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

const makeInterval = (id: number, ms: number) => {
  let i = 0;
  const interval: IO<never> = pipe(
    sync(() => {
      console.log(`[${id}] interval ${i++}`);
    }),
    flatMap(() =>
      async(() => new Promise((resolve) => setTimeout(resolve, ms)))
    ),
    flatMap(() => interval)
  );
  return interval;
};

const fiber1 = new Fiber(makeInterval(1, 500), () => {}).run();
const fiber2 = new Fiber(makeInterval(2, 500), () => {}).run();

await new Promise((resolve) => setTimeout(resolve, 1000));
