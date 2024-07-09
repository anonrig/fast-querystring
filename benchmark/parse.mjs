import native from "node:querystring";
import awsQueryStringParser from "@aws-sdk/querystring-parser";
import benchmark from "cronometro";
import qs from "qs";
import queryString from "query-string";
import querystringify from "querystringify";
import querystringparser from "querystringparser";
import fastQueryString from "../lib/index.js";

const input = "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz";

await benchmark(
  {
    qs() {
      return qs.parse(input);
    },
    "fast-querystring"() {
      return fastQueryString.parse(input);
    },
    "node:querystring"() {
      return native.parse(input);
    },
    "query-string"() {
      return queryString.parse(input);
    },
    "URLSearchParams-with-Object.fromEntries"() {
      const urlParams = new URLSearchParams(input);
      return Object.fromEntries(urlParams);
    },
    "URLSearchParams-with-construct"() {
      const u = new URLSearchParams(input);
      const data = {};
      for (const [key, value] of u.entries()) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else if (data[key]) {
          data[key] = [].concat(data[key], value);
        } else {
          data[key] = value;
        }
      }
      return data;
    },
    querystringify() {
      return querystringify.parse(input);
    },
    "@aws-sdk/querystring-parser"() {
      return awsQueryStringParser.parseQueryString(input);
    },
    querystringparser() {
      return querystringparser.parse(input);
    },
  },
  { warmup: true },
);
