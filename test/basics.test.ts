import qs from "../lib";
import { test, assert } from "vitest";
import vm from "node:vm";

const foreignObject = vm.runInNewContext('({"foo": ["bar", "baz"]})');
const qsNoMungeTestCases = [
  ["", {}],
  ["foo=bar&foo=baz", { foo: ["bar", "baz"] }],
  ["foo=bar&foo=baz", foreignObject],
  ["blah=burp", { blah: "burp" }],
  ["a=!-._~'()*", { a: "!-._~'()*" }],
  ["a=abcdefghijklmnopqrstuvwxyz", { a: "abcdefghijklmnopqrstuvwxyz" }],
  ["a=ABCDEFGHIJKLMNOPQRSTUVWXYZ", { a: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }],
  ["a=0123456789", { a: "0123456789" }],
  ["gragh=1&gragh=3&goo=2", { gragh: ["1", "3"], goo: "2" }],
  [
    "frappucino=muffin&goat%5B%5D=scone&pond=moose",
    { frappucino: "muffin", "goat[]": "scone", pond: "moose" },
  ],
  ["trololol=yes&lololo=no", { trololol: "yes", lololo: "no" }],
];

test("should parse the basics", () => {
  qsNoMungeTestCases.forEach((t) => {
    assert.deepEqual(qs.parse(t[0]), t[1]);
  });
});

test("should throw error on invalid type", () => {
  assert.throws(() => qs.parse(5), "Invalid Input");
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
