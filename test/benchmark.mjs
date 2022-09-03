import benchmark from "cronometro";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";
import queryString from "query-string";

await benchmark(
  {
    qs() {
      return qs.parse("hello=world&foo=bar");
    },
    "fast-querystring"() {
      return fastQueryString.parse("hello=world&foo=bar");
    },
    "node:querystring"() {
      return native.parse("hello=world&foo=bar");
    },
    "query-string"() {
      return queryString.parse("hello=world&foo=bar");
    },
  },
  { warmup: true, print: { compare: true, compareMode: "previous" } },
);
