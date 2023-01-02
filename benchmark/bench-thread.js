"use strict";

const { workerData: benchmark, parentPort } = require("node:worker_threads");

const Benchmark = require("benchmark");
Benchmark.options.minSamples = 100;

const suite = Benchmark.Suite();

const encodeString = require("../lib/internals/querystring").encodeString;
const parse = require("../lib/parse");
const stringify = require("../lib/stringify");

switch (benchmark.type) {
  case "encodeString":
    suite.add(`${benchmark.type}: ${benchmark.name}`, () => {
      encodeString(benchmark.input);
    });
    break;
  case "parse":
    suite.add(`${benchmark.type}: ${benchmark.name}`, () => {
      parse(benchmark.input);
    });
    break;
  case "stringify":
    suite.add(`${benchmark.type}: ${benchmark.name}`, () => {
      stringify(benchmark.input);
    });
    break;
}

suite
  .on("cycle", (event) => {
    parentPort.postMessage(String(event.target));
  })
  .run();
