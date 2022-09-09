import qs from "../lib";
import { test, assert } from "vitest";
import { qsNoMungeTestCases, qsTestCases, qsWeirdObjects } from "./node";
import querystring from "querystring";

test("should succeed on node.js tests", () => {
  qsWeirdObjects.forEach(
    (t) =>
      assert.deepEqual(qs.parse(t[1] as string), t[2] as Record<string, any>),
  );
  qsNoMungeTestCases.forEach((t) => assert.deepEqual(qs.parse(t[0]), t[1]));
  qsTestCases.forEach((t) => assert.deepEqual(qs.parse(t[0]), t[2]));
});

test("native querystring module should match the test suite result", () => {
  qsTestCases.forEach((t) => assert.deepEqual(querystring.parse(t[0]), t[2]));
  qsNoMungeTestCases.forEach(
    (t) => assert.deepEqual(querystring.parse(t[0]), t[1]),
  );
});

test("handles & on first/last character", () => {
  assert.deepEqual(qs.parse("&hello=world"), { hello: "world" });
  assert.deepEqual(qs.parse("hello=world&"), { hello: "world" });
});

test("handles ? on first character", () => {
  // This aligns with `node:querystring` functionality
  assert.deepEqual(qs.parse("?hello=world"), { "?hello": "world" });
});

test("handles + character", () => {
  assert.deepEqual(qs.parse("author=Yagiz+Nizipli"), {
    author: "Yagiz Nizipli",
  });
});

test("should accept pairs with missing values", () => {
  assert.deepEqual(qs.parse("foo=bar&hey"), { foo: "bar", hey: "" });
  assert.deepEqual(qs.parse("hey"), { hey: "" });
});

test("should decode key", () => {
  assert.deepEqual(qs.parse("full%20name=Yagiz"), { "full name": "Yagiz" });
});

test("should handle really large object", () => {
  const query = {};

  for (let i = 0; i < 2000; i++) query[i] = i;

  const url = qs.stringify(query);

  assert.strictEqual(Object.keys(qs.parse(url)).length, 2000);
});
