import benchmark from "cronometro";

await benchmark(
  {
    qs() {
      return import("qs");
    },
    "fast-querystring"() {
      return import("../lib/index.js");
    },
    "node:querystring"() {
      return import("node:querystring");
    },
    "query-string"() {
      return import("query-string");
    },
    querystringify() {
      return import("querystringify");
    },
    "@aws-sdk/querystring-parser"() {
      return import("@aws-sdk/querystring-parser");
    },
    querystringparser() {
      return import("querystringparser");
    },
  },
  { warmup: true },
);
