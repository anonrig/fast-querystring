import benchmark from "cronometro";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";
import queryString from "query-string";

const value = {
  frappucino: "muffin",
  goat: "scone",
  pond: "moose",
  foo: ["bar", "baz", "bal"],
  bool: true,
  bigIntKey: BigInt(100),
  numberKey: 256,
};

await benchmark(
  {
    qs() {
      return qs.stringify(value);
    },
    "fast-querystring"() {
      return fastQueryString.stringify(value);
    },
    "node:querystring"() {
      return native.stringify(value);
    },
    "query-string"() {
      return queryString.stringify(value);
    },
    URLSearchParams() {
      const urlParams = new URLSearchParams(value);
      return urlParams.toString();
    },
  },
  { warmup: true, print: { compare: true, compareMode: "previous" } },
);
