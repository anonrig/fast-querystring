import benchmark from "cronometro";
import URLStateMachine from "url-state-machine";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";

await benchmark(
  {
    URLStateMachine() {
      return new URLStateMachine("hello=world&foo=bar", null, null, 115);
    },
    qs() {
      return qs.parse("hello=world&foo=bar");
    },
    "fast-querystring"() {
      return fastQueryString.parse("hello=world&foo=bar");
    },
    "native-querystring"() {
      return native.parse("hello=world&foo=bar");
    },
  },
  { warmup: true, print: { compare: true, compareMode: "previous" } },
);
