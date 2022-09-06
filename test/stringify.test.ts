import { qsNoMungeTestCases, qsTestCases } from "./node";
import qs from "../lib";
import { test, assert } from "vitest";

test("should stringify the basics", () => {
  qsNoMungeTestCases.forEach((t) => {
    assert.deepEqual(qs.stringify(t[1]), t[0]);
  });
});

test("should succeed on node.js tests", () => {
  qsTestCases.forEach((t) => {
    assert.deepEqual(qs.stringify(t[2]), t[1]);
  });
});
