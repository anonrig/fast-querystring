import benchmark from "cronometro";

// "node:querystring" module is omitted from this benchmark because
// it will always be faster than alternatives because of V8 snapshots.
await benchmark(
  {
    qs() {
      return import("qs");
    },
    "fast-querystring"() {
      return import("../lib/index.js");
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
