import native from "node:querystring";
import awsQueryStringBuilder from "@aws-sdk/querystring-builder";
import benchmark from "cronometro";
import httpQuerystringStringify from "http-querystring-stringify";
import qs from "qs";
import queryString from "query-string";
import querystringify from "querystringify";
import querystringifyQs from "querystringify-ts";
import querystringparser from "querystringparser";
import fastQueryString from "../lib/index.js";

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
    querystringify() {
      return querystringify.stringify(value);
    },
    "http-querystring-stringify"() {
      return httpQuerystringStringify(value);
    },
    "@aws-sdk/querystring-builder"() {
      return awsQueryStringBuilder.buildQueryString(value);
    },
    querystringparser() {
      return querystringparser.stringify(value);
    },
    "querystringify-ts"() {
      return querystringifyQs.stringify(value);
    },
  },
  { warmup: true },
);
