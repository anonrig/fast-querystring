"use strict";

const path = require("path");
const { Worker } = require("worker_threads");

const BENCH_THREAD_PATH = path.join(__dirname, "bench-thread.js");

const benchmarks = [
  {
    type: "encodeString",
    name: '""',
    input: "",
  },
  {
    type: "encodeString",
    name: '"123"',
    input: "123",
  },
  {
    type: "encodeString",
    name: '"ä"',
    input: "ä",
  },
  {
    type: "encodeString",
    name: '"𝌆" ',
    input: "𝌆",
  },
  {
    type: "stringify",
    name: "undefined",
    input: undefined,
  },
  {
    type: "stringify",
    name: "null",
    input: null,
  },
  {
    type: "stringify",
    name: "{}",
    input: {},
  },
  {
    type: "stringify",
    name: "{ id: true }",
    input: { id: true },
  },
  {
    type: "stringify",
    name: "{ id: false }",
    input: { id: false },
  },
  {
    type: "stringify",
    name: "{ id: 123 }",
    input: { id: 123 },
  },
  {
    type: "stringify",
    name: "{ id: 1e+22 }",
    input: { id: 1e+22 },
  },
  {
    type: "stringify",
    name: "{ id: 123n }",
    input: { id: 123n },
  },
  {
    type: "stringify",
    name: "{ id: Infinity }",
    input: { id: Infinity },
  },
  {
    type: "stringify",
    name: '{ id: ["1", "3"] }',
    input: { id: ["1", "3"] },
  },
  {
    type: "stringify",
    name: '{ id: "" }',
    input: { id: "" },
  },
  {
    type: "stringify",
    name: '{ id: "123" }',
    input: { id: "123" },
  },
  {
    type: "stringify",
    name: '{ id: "ä" }',
    input: { id: "ä" },
  },
  {
    type: "stringify",
    name: '{ id: "𝌆" } ',
    input: { id: "𝌆" },
  },
  {
    type: "stringify",
    name: '{ foo: ["1", "3"], bar: "2" }',
    input: { foo: ["1", "3"], bar: "2" },
  },
  {
    type: "parse",
    name: "",
    input: "",
  },
  {
    type: "parse",
    name: "id=123",
    input: "id=123",
  },
  {
    type: "parse",
    name: "id=123&id=123",
    input: "id=123&id=123",
  },
  {
    type: "parse",
    name: "full%20name=Yagiz",
    input: "full%20name=Yagiz",
  },
  {
    type: "parse",
    name: "invalid%key=hello",
    input: "invalid%key=hello",
  },
  {
    type: "parse",
    name: "my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F",
    input: "my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F",
  },
];

async function runBenchmark(benchmark) {
  const worker = new Worker(BENCH_THREAD_PATH, { workerData: benchmark });

  return new Promise((resolve, reject) => {
    let result = null;
    worker.on("error", reject);
    worker.on("message", (benchResult) => {
      result = benchResult;
    });
    worker.on("exit", (code) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function runBenchmarks() {
  let maxNameLength = 0;
  for (const benchmark of benchmarks) {
    maxNameLength = Math.max(benchmark.name.length, maxNameLength);
  }

  for (const benchmark of benchmarks) {
    benchmark.name = benchmark.name.padEnd(maxNameLength, " ");
    const resultMessage = await runBenchmark(benchmark);
    console.log(resultMessage);
  }
}

runBenchmarks();
