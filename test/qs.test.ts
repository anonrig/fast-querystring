"use strict";

import { test, assert } from "vitest";
import qs from "../lib";

test("parses a simple string", () => {
  assert.deepEqual(qs.parse("0=foo"), { 0: "foo" });
  assert.deepEqual(qs.parse("foo=c++"), { foo: "c  " });
  assert.deepEqual(qs.parse("a[>=]=23"), { a: { ">=": "23" } });
  assert.deepEqual(qs.parse("a[<=>]==23"), { a: { "<=>": "=23" } });
  assert.deepEqual(qs.parse("a[==]=23"), { a: { "==": "23" } });
  assert.deepEqual(qs.parse("foo", { strictNullHandling: true }), {
    foo: null,
  });
  assert.deepEqual(qs.parse("foo"), { foo: "" });
  assert.deepEqual(qs.parse("foo="), { foo: "" });
  assert.deepEqual(qs.parse("foo=bar"), { foo: "bar" });
  assert.deepEqual(qs.parse(" foo = bar = baz "), { " foo ": " bar = baz " });
  assert.deepEqual(qs.parse("foo=bar=baz"), { foo: "bar=baz" });
  assert.deepEqual(qs.parse("foo=bar&bar=baz"), { foo: "bar", bar: "baz" });
  assert.deepEqual(qs.parse("foo2=bar2&baz2="), { foo2: "bar2", baz2: "" });
  assert.deepEqual(qs.parse("foo=bar&baz", { strictNullHandling: true }), {
    foo: "bar",
    baz: null,
  });
  assert.deepEqual(qs.parse("foo=bar&baz"), { foo: "bar", baz: "" });
  assert.deepEqual(qs.parse("cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World"), {
    cht: "p3",
    chd: "t:60,40",
    chs: "250x100",
    chl: "Hello|World",
  });
  assert.deepEqual(
    qs.parse("a[b]=c"),
    { a: { b: "c" } },
    "parses a single nested string",
  );
  assert.deepEqual(
    qs.parse("a[b][c]=d"),
    { a: { b: { c: "d" } } },
    "parses a double nested string",
  );

  assert.deepEqual(
    qs.parse("a=b&a=c"),
    { a: ["b", "c"] },
    "parses a simple array",
  );
});

test("allows dot inside key", () => {
  assert.deepEqual(qs.parse("a.b=c"), { "a.b": "c" });
});

test("parses an explicit array", () => {
  assert.deepEqual(qs.parse("a[]=b"), { a: ["b"] });
  assert.deepEqual(qs.parse("a[]=b&a[]=c"), { a: ["b", "c"] });
  assert.deepEqual(qs.parse("a[]=b&a[]=c&a[]=d"), { a: ["b", "c", "d"] });
});

test("parses a nested array", () => {
  assert.deepEqual(qs.parse("a[b][]=c&a[b][]=d"), { a: { b: ["c", "d"] } });
  assert.deepEqual(qs.parse("a[>=]=25"), { a: { ">=": "25" } });
});

test("supports encoded = signs", () => {
  assert.deepEqual(qs.parse("he%3Dllo=th%3Dere"), { "he=llo": "th=ere" });
});

test("is ok with url encoded strings", () => {
  assert.deepEqual(qs.parse("a[b%20c]=d"), { a: { "b c": "d" } });
  assert.deepEqual(qs.parse("a[b]=c%20d"), { a: { b: "c d" } });
});

test("transforms arrays to objects (dot notation)", () => {
  assert.deepEqual(
    qs.parse("foo[0].baz=bar&fool.bad=baz", {
      allowDots: true,
    }),
    { foo: [{ baz: "bar" }], fool: { bad: "baz" } },
  );
  assert.deepEqual(
    qs.parse("foo[0].baz=bar&fool.bad.boo=baz", {
      allowDots: true,
    }),
    { foo: [{ baz: "bar" }], fool: { bad: { boo: "baz" } } },
  );
  assert.deepEqual(
    qs.parse("foo[0][0].baz=bar&fool.bad=baz", {
      allowDots: true,
    }),
    { foo: [[{ baz: "bar" }]], fool: { bad: "baz" } },
  );
  assert.deepEqual(
    qs.parse("foo[0].baz[0]=15&foo[0].bar=2", {
      allowDots: true,
    }),
    { foo: [{ baz: ["15"], bar: "2" }] },
  );
  assert.deepEqual(
    qs.parse("foo[0].baz[0]=15&foo[0].baz[1]=16&foo[0].bar=2", {
      allowDots: true,
    }),
    { foo: [{ baz: ["15", "16"], bar: "2" }] },
  );
  assert.deepEqual(qs.parse("foo.bad=baz&foo[0]=bar", { allowDots: true }), {
    foo: { bad: "baz", 0: "bar" },
  });
  assert.deepEqual(qs.parse("foo.bad=baz&foo[]=bar", { allowDots: true }), {
    foo: { bad: "baz", 0: "bar" },
  });
  assert.deepEqual(qs.parse("foo[]=bar&foo.bad=baz", { allowDots: true }), {
    foo: { 0: "bar", bad: "baz" },
  });
  assert.deepEqual(
    qs.parse("foo.bad=baz&foo[]=bar&foo[]=foo", {
      allowDots: true,
    }),
    { foo: { bad: "baz", 0: "bar", 1: "foo" } },
  );
  assert.deepEqual(
    qs.parse("foo[0].a=a&foo[0].b=b&foo[1].a=aa&foo[1].b=bb", {
      allowDots: true,
    }),
    { foo: [{ a: "a", b: "b" }, { a: "aa", b: "bb" }] },
  );
});

test("supports malformed uri characters", () => {
  assert.deepEqual(qs.parse("{%:%}"), {
    "{%:%}": null,
  });
  assert.deepEqual(qs.parse("{%:%}="), { "{%:%}": "" });
  assert.deepEqual(qs.parse("foo=%:%}"), { foo: "%:%}" });
});

test("doesn't produce empty keys", () => {
  assert.deepEqual(qs.parse("_r=1&"), { _r: "1" });
});

test("cannot access Object prototype", () => {
  qs.parse("constructor[prototype][bad]=bad");
  qs.parse("bad[constructor][prototype][bad]=bad");
  assert.equal(typeof Object.prototype.bad, "undefined");
});

test("parses arrays of objects", () => {
  assert.deepEqual(qs.parse("a[][b]=c"), { a: [{ b: "c" }] });
  assert.deepEqual(qs.parse("a[0][b]=c"), { a: [{ b: "c" }] });
});

test("allows for empty strings in arrays", () => {
  assert.deepEqual(qs.parse("a[]=b&a[]=&a[]=c"), { a: ["b", "", "c"] });

  assert.deepEqual(
    qs.parse("a[0]=b&a[1]&a[2]=c&a[19]=", {
      strictNullHandling: true,
      arrayLimit: 20,
    }),
    { a: ["b", null, "c", ""] },
    "with arrayLimit 20 + array indices: null then empty string works",
  );
  assert.deepEqual(
    qs.parse("a[]=b&a[]&a[]=c&a[]=", {
      strictNullHandling: true,
      arrayLimit: 0,
    }),
    { a: ["b", null, "c", ""] },
    "with arrayLimit 0 + array brackets: null then empty string works",
  );

  assert.deepEqual(
    qs.parse("a[0]=b&a[1]=&a[2]=c&a[19]", {
      strictNullHandling: true,
      arrayLimit: 20,
    }),
    { a: ["b", "", "c", null] },
    "with arrayLimit 20 + array indices: empty string then null works",
  );
  assert.deepEqual(
    qs.parse("a[]=b&a[]=&a[]=c&a[]", {
      strictNullHandling: true,
      arrayLimit: 0,
    }),
    { a: ["b", "", "c", null] },
    "with arrayLimit 0 + array brackets: empty string then null works",
  );

  assert.deepEqual(
    qs.parse("a[]=&a[]=b&a[]=c"),
    { a: ["", "b", "c"] },
    "array brackets: empty strings work",
  );
});

test("compacts sparse arrays", () => {
  assert.deepEqual(qs.parse("a[10]=1&a[2]=2", { arrayLimit: 20 }), {
    a: ["2", "1"],
  });
  assert.deepEqual(qs.parse("a[1][b][2][c]=1", { arrayLimit: 20 }), {
    a: [{ b: [{ c: "1" }] }],
  });
  assert.deepEqual(qs.parse("a[1][2][3][c]=1", { arrayLimit: 20 }), {
    a: [[[{ c: "1" }]]],
  });
  assert.deepEqual(qs.parse("a[1][2][3][c][1]=1", { arrayLimit: 20 }), {
    a: [[[{ c: ["1"] }]]],
  });
});

test("continues parsing when no parent is found", () => {
  assert.deepEqual(qs.parse("[]=&a=b"), { 0: "", a: "b" });
  assert.deepEqual(qs.parse("[]&a=b"), {
    0: null,
    a: "b",
  });
  assert.deepEqual(qs.parse("[foo]=bar"), { foo: "bar" });
});

test("does not error when parsing a very long array", () => {
  var str = "a[]=a";
  while (Buffer.byteLength(str) < 128 * 1024) {
    str = str + "&" + str;
  }

  assert.doesNotThrow(function () {
    qs.parse(str);
  });
});

test("should not throw when a native prototype has an enumerable property", () => {
  Object.prototype.crash = "";
  Array.prototype.crash = "";
  assert.doesNotThrow(qs.parse.bind(null, "a=b"));
  assert.deepEqual(qs.parse("a=b"), { a: "b" });
  assert.doesNotThrow(qs.parse.bind(null, "a[][b]=c"));
  assert.deepEqual(qs.parse("a[][b]=c"), { a: [{ b: "c" }] });
  delete Object.prototype.crash;
  delete Array.prototype.crash;
});

test("parses an object and not child values", () => {
  var input = {
    "user[name]": { "pop[bob]": { test: 3 } },
    "user[email]": null,
  };

  var expected = {
    user: {
      name: { "pop[bob]": { test: 3 } },
      email: null,
    },
  };

  assert.deepEqual(qs.parse(input), expected);
});

test("does not blow up when Buffer global is missing", () => {
  var tempBuffer = global.Buffer;
  delete global.Buffer;
  var result = qs.parse("a=b&c=d");
  global.Buffer = tempBuffer;
  assert.deepEqual(result, { a: "b", c: "d" });
});

test("does not crash when parsing deep objects", () => {
  var parsed;
  var str = "foo";

  for (var i = 0; i < 5000; i++) {
    str += "[p]";
  }

  str += "=bar";

  assert.doesNotThrow(function () {
    parsed = qs.parse(str, { depth: 5000 });
  });

  assert.equal("foo" in parsed, true, 'parsed has "foo" property');
});

test("does not allow overwriting prototype properties", () => {
  assert.deepEqual(qs.parse("a[hasOwnProperty]=b"), {
    a: { hasOwnProperty: "b" },
  });
  assert.deepEqual(qs.parse("hasOwnProperty=b"), { hasOwnProperty: "b" });

  assert.deepEqual(qs.parse("toString"), {}, 'bare "toString" results in {}');
});

test("can allow overwriting prototype properties", () => {
  assert.deepEqual(qs.parse("a[hasOwnProperty]=b", { allowPrototypes: true }), {
    a: { hasOwnProperty: "b" },
  });
  assert.deepEqual(qs.parse("hasOwnProperty=b", { allowPrototypes: true }), {
    hasOwnProperty: "b",
  });

  assert.deepEqual(
    qs.parse("toString", { allowPrototypes: true }),
    { toString: "" },
    'bare "toString" results in { toString: "" }',
  );
});

test("params starting with a closing bracket", () => {
  assert.deepEqual(qs.parse("]=toString"), { "]": "toString" });
  assert.deepEqual(qs.parse("]]=toString"), { "]]": "toString" });
  assert.deepEqual(qs.parse("]hello]=toString"), { "]hello]": "toString" });
});

test("params starting with a starting bracket", () => {
  assert.deepEqual(qs.parse("[=toString"), { "[": "toString" });
  assert.deepEqual(qs.parse("[[=toString"), { "[[": "toString" });
  assert.deepEqual(qs.parse("[hello[=toString"), { "[hello[": "toString" });
});

test("add keys to objects", () => {
  assert.deepEqual(
    qs.parse("a[b]=c&a=d"),
    { a: { b: "c", d: true } },
    "can add keys to objects",
  );

  assert.deepEqual(
    qs.parse("a[b]=c&a=toString"),
    { a: { b: "c" } },
    "can not overwrite prototype",
  );

  assert.deepEqual(
    qs.parse("a[b]=c&a=toString", { allowPrototypes: true }),
    { a: { b: "c", toString: true } },
    "can overwrite prototype with allowPrototypes true",
  );

  assert.deepEqual(
    qs.parse("a[b]=c&a=toString", { plainObjects: true }),
    { __proto__: null, a: { __proto__: null, b: "c", toString: true } },
    "can overwrite prototype with plainObjects true",
  );
});
