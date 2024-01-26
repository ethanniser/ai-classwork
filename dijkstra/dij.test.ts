import { describe, test, expect } from "bun:test";
import { PriorityQueue, WeightedGraph } from ".";

describe("PriorityQueue", () => {
  test("enqueue and size", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 2);
    expect(pq.size()).toBe(2);
  });

  test("dequeue and size", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 2);
    pq.dequeue();
    expect(pq.size()).toBe(1);
  });

  test("order of elements", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 5);
    pq.enqueue("node2", 1);
    pq.enqueue("node3", 3);
    expect(pq.dequeue()).toEqual({ node: "node2", priority: 1 });
    expect(pq.dequeue()).toEqual({ node: "node3", priority: 3 });
    expect(pq.dequeue()).toEqual({ node: "node1", priority: 5 });
  });

  test("dequeue on empty queue", () => {
    const pq = new PriorityQueue();
    expect(pq.dequeue()).toBeUndefined();
  });

  test("dequeue until empty", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.dequeue();
    expect(pq.dequeue()).toBeUndefined();
  });

  test("enqueue duplicate priorities", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 1);
    expect(pq.dequeue()).toEqual({ node: "node1", priority: 1 });
    expect(pq.dequeue()).toEqual({ node: "node2", priority: 1 });
  });

  test("large number of elements", () => {
    const pq = new PriorityQueue();
    for (let i = 0; i < 1000; i++) {
      pq.enqueue(`node${i}`, i);
    }
    expect(pq.size()).toBe(1000);
    for (let i = 0; i < 1000; i++) {
      expect(pq.dequeue()).toEqual({ node: `node${i}`, priority: i });
    }
  });
});

// from: https://www.cs.usfca.edu/~galles/visualization/Dijkstra.html
describe("dikstras", () => {
  test("simple", () => {
    const graph = WeightedGraph.fromAdjacencyList(
      new Map([
        [
          "0",
          [
            { node: "2", weight: 2 },
            { node: "3", weight: 9 },
          ],
        ],
        [
          "1",
          [
            { node: "2", weight: 6 },
            { node: "5", weight: 3 },
            { node: "6", weight: 1 },
          ],
        ],
        [
          "2",
          [
            { node: "0", weight: 2 },
            { node: "1", weight: 6 },
            { node: "5", weight: 5 },
            { node: "6", weight: 4 },
          ],
        ],
        ["3", [{ node: "0", weight: 9 }]],
        [
          "4",
          [
            { node: "6", weight: 2 },
            { node: "7", weight: 6 },
          ],
        ],
        [
          "5",
          [
            { node: "1", weight: 3 },
            { node: "2", weight: 5 },
            { node: "6", weight: 4 },
            { node: "7", weight: 7 },
          ],
        ],
        [
          "6",
          [
            { node: "1", weight: 1 },
            { node: "2", weight: 4 },
            { node: "4", weight: 2 },
            { node: "5", weight: 4 },
          ],
        ],
        [
          "7",
          [
            { node: "4", weight: 6 },
            { node: "5", weight: 7 },
          ],
        ],
      ])
    );

    const result = graph.dijkstra("0");
    expect(result.distances).toEqual(
      new Map([
        ["0", 0],
        ["1", 7],
        ["2", 2],
        ["3", 9],
        ["4", 8],
        ["5", 7],
        ["6", 6],
        ["7", 14],
      ])
    );

    expect(result.previous).toEqual(
      new Map([
        ["0", null],
        ["1", "6"],
        ["2", "0"],
        ["3", "0"],
        ["4", "6"],
        ["5", "2"],
        ["6", "2"],
        ["7", "5"],
      ])
    );
  });

  test("python test 1", () => {
    const graph = WeightedGraph.fromAdjacencyList(
      new Map([
        [
          "1",
          [
            { node: "2", weight: 10 },
            { node: "3", weight: 20 },
            { node: "4", weight: 50 },
          ],
        ],
        [
          "2",
          [
            { node: "1", weight: 10 },
            { node: "6", weight: 60 },
          ],
        ],
        [
          "3",
          [
            { node: "1", weight: 20 },
            { node: "6", weight: 40 },
          ],
        ],
        [
          "4",
          [
            { node: "1", weight: 50 },
            { node: "5", weight: 1 },
          ],
        ],
        [
          "5",
          [
            { node: "4", weight: 1 },
            { node: "6", weight: 5 },
          ],
        ],
        [
          "6",
          [
            { node: "2", weight: 60 },
            { node: "3", weight: 40 },
            { node: "5", weight: 5 },
          ],
        ],
      ])
    );

    const result = graph.dijkstra("1");
    expect(result.distances).toEqual(
      new Map([
        ["1", 0],
        ["2", 10],
        ["3", 20],
        ["4", 50],
        ["5", 51],
        ["6", 56],
      ])
    );

    expect(result.previous).toEqual(
      new Map([
        ["1", null],
        ["2", "1"],
        ["3", "1"],
        ["4", "1"],
        ["5", "4"],
        ["6", "5"],
      ])
    );
  });
});
