import qs from "../lib";
import { test, assert } from "vitest";

test("parse single key value pair", () => {
  assert.deepEqual(qs.parse("a=s"), { a: "s" });
});

test("parse multiple key value pair", () => {
  assert.deepEqual(qs.parse("hello=world&foo=bar"), {
    hello: "world",
    foo: "bar",
  });
});

test("should create an array with multiple same keys", () => {
  assert.deepEqual(qs.parse(
    "language=javascript&language=typescript&sort=true",
  ), {
    language: ["javascript", "typescript"],
    sort: "true",
  });
});

test("should parse [] notation", () => {
  assert.deepEqual(qs.parse("a[]=b&a[]=c"), {
    a: ["b", "c"],
  });
});

test("should parse single [] notation", () => {
  assert.deepEqual(qs.parse("a[]=b"), {
    a: ["b"],
  });
});

test("parse nested key value pairs", () => {
  assert.deepEqual(qs.parse("foo[bar]=baz"), {
    foo: {
      bar: "baz",
    },
  });
});
