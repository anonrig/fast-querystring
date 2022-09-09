import { qsNoMungeTestCases, qsTestCases, qsWeirdObjects } from "./node";
import qs from "../lib";
import { test, assert } from "vitest";
import querystring from "querystring";

test("should succeed on node.js tests", () => {
  qsWeirdObjects.forEach(
    (t) =>
      assert.deepEqual(
        qs.stringify(t[2] as Record<string, any>),
        t[1] as string,
      ),
  );
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
  assert.strictEqual(qs.stringify({ foo: 2n ** 1023n }), "foo=" + 2n ** 1023n);
  assert.strictEqual(qs.stringify([0n, 1n, 2n]), "0=0&1=1&2=2");
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

test("should handle multi-byte characters", () => {
  assert.deepEqual(qs.stringify({ multiByte: "𝌆" }), "multiByte=%F0%9D%8C%86");
});

test("invalid surrogate pair should throw", () => {
  assert.throws(() => qs.stringify({ foo: "\udc00" }), "URI malformed");
});

test("should omit nested values", () => {
  const f = qs.stringify({
    a: "b",
    q: qs.stringify({
      x: "y",
      y: "z",
    }),
  });
  assert.strictEqual(f, "a=b&q=x%3Dy%26y%3Dz");
});

test("should coerce numbers to string", () => {
  assert.strictEqual(qs.stringify({ foo: 0 }), "foo=0");
  assert.strictEqual(qs.stringify({ foo: -0 }), "foo=0");
  assert.strictEqual(qs.stringify({ foo: 3 }), "foo=3");
  assert.strictEqual(qs.stringify({ foo: -72.42 }), "foo=-72.42");
  assert.strictEqual(qs.stringify({ foo: NaN }), "foo=");
  assert.strictEqual(qs.stringify({ foo: 1e21 }), "foo=1e%2B21");
  assert.strictEqual(qs.stringify({ foo: Infinity }), "foo=");
});

test("should return empty string on certain inputs", () => {
  assert.strictEqual(qs.stringify(), "");
  assert.strictEqual(qs.stringify(0), "");
  assert.strictEqual(qs.stringify([]), "");
  assert.strictEqual(qs.stringify(null), "");
  assert.strictEqual(qs.stringify(true), "");
});
