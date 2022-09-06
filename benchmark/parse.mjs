import benchmark from "cronometro";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";
import queryString from "query-string";

await benchmark(
  {
    qs() {
      return qs.parse(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
    },
    "fast-querystring"() {
      return fastQueryString.parse(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
    },
    "node:querystring"() {
      return native.parse(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
    },
    "query-string"() {
      return queryString.parse(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
    },
    "URLSearchParams-with-Object.fromEntries"() {
      const urlParams = new URLSearchParams(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
      return Object.fromEntries(urlParams);
    },
    "URLSearchParams-with-construct"() {
      const u = new URLSearchParams(
        "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz",
      );
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
  },
  { warmup: true, print: { compare: true, compareMode: "previous" } },
);
