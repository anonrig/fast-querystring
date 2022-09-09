import { qsNoMungeTestCases, qsTestCases } from "./node";
import qs from "../lib";
import { test, assert } from "vitest";
import querystring from "querystring";

test("should succeed on node.js tests", () => {
  qsNoMungeTestCases.forEach((t) => assert.deepEqual(qs.stringify(t[1]), t[0]));
  qsTestCases.forEach((t) => assert.deepEqual(qs.stringify(t[2]), t[1]));
});

test("native querystring module should match the test suite result", () => {
  qsTestCases.forEach(
    (t) => assert.deepEqual(querystring.stringify(t[2]), t[1]),
  );
  qsNoMungeTestCases.forEach(
    (t) => assert.deepEqual(querystring.stringify(t[1]), t[0]),
  );
});

test("should handle numbers", () => {
  assert.deepEqual(
    qs.stringify({ age: 5, name: "John Doe" }),
    "age=5&name=John%20Doe",
  );
});

test("should handle BigInt", () => {
  assert.deepEqual(
    qs.stringify({ age: BigInt(55), name: "John" }),
    "age=55&name=John",
  );
});

test("should handle boolean values", () => {
  assert.deepEqual(qs.stringify({ valid: true }), "valid=true");
  assert.deepEqual(qs.stringify({ valid: false }), "valid=false");
});

test("should handle numbers", () => {
  assert.deepEqual(qs.stringify({ value: 1e22 }), "value=1e%2B22");
});

test("should omit objects", () => {
  // This aligns with querystring module
  assert.deepEqual(qs.stringify({ user: {} }), "user=");
});

test("should omit non-object inputs", () => {
  assert.deepEqual(qs.stringify("hello" as any), "");
});
