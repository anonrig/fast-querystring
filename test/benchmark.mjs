import benchmark from "cronometro";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";
import queryString from "query-string";

await benchmark(
  {
    qs() {
      return qs.parse("frappucino=muffin&goat%5B%5D=scone&pond=moose");
    },
    "fast-querystring"() {
      return fastQueryString.parse("frappucino=muffin&goat%5B%5D=scone&pond=moose");
    },
    "node:querystring"() {
      return native.parse("frappucino=muffin&goat%5B%5D=scone&pond=moose");
    },
    "query-string"() {
      return queryString.parse("frappucino=muffin&goat%5B%5D=scone&pond=moose");
    },
    URLSearchParams() {
      return new URLSearchParams("frappucino=muffin&goat%5B%5D=scone&pond=moose");
    },
  },
  { warmup: true, print: { compare: true, compareMode: "previous" } },
);
