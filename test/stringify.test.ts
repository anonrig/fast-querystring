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
