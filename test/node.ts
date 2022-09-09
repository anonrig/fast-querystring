import vm from "node:vm";

function extendedFunction() {}
extendedFunction.prototype = { a: "b" };

function createWithNoPrototype(properties) {
  const noProto = Object.create(null);
  properties.forEach((property) => {
    noProto[property.key] = property.value;
  });
  return noProto;
}
export const foreignObject = vm.runInNewContext('({"foo": ["bar", "baz"]})');
export const qsNoMungeTestCases = [
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
export const qsTestCases = [
  [
    "__proto__=1",
    "__proto__=1",
    createWithNoPrototype([{ key: "__proto__", value: "1" }]),
  ],
  [
    "__defineGetter__=asdf",
    "__defineGetter__=asdf",
    JSON.parse('{"__defineGetter__":"asdf"}'),
  ],
  [
    "foo=918854443121279438895193",
    "foo=918854443121279438895193",
    { foo: "918854443121279438895193" },
  ],
  ["foo=bar", "foo=bar", { foo: "bar" }],
  ["foo=bar&foo=quux", "foo=bar&foo=quux", { foo: ["bar", "quux"] }],
  ["foo=1&bar=2", "foo=1&bar=2", { foo: "1", bar: "2" }],
  [
    "my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F",
    "my%20weird%20field=q1!2%22'w%245%267%2Fz8)%3F",
    { "my weird field": "q1!2\"'w$5&7/z8)?" },
  ],
  ["foo%3Dbaz=bar", "foo%3Dbaz=bar", { "foo=baz": "bar" }],
  ["foo=baz=bar", "foo=baz%3Dbar", { foo: "baz=bar" }],
  [
    "str=foo&arr=1&arr=2&arr=3&somenull=&undef=",
    "str=foo&arr=1&arr=2&arr=3&somenull=&undef=",
    {
      str: "foo",
      arr: ["1", "2", "3"],
      somenull: "",
      undef: "",
    },
  ],
  [" foo = bar ", "%20foo%20=%20bar%20", { " foo ": " bar " }],
  ["foo=%zx", "foo=%25zx", { foo: "%zx" }],
  ["foo=%EF%BF%BD", "foo=%EF%BF%BD", { foo: "\ufffd" }],
  // See: https://github.com/joyent/node/issues/1707
  [
    "hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz",
    "hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz",
    {
      hasOwnProperty: "x",
      toString: "foo",
      valueOf: "bar",
      __defineGetter__: "baz",
    },
  ],
  // See: https://github.com/joyent/node/issues/3058
  ["foo&bar=baz", "foo=&bar=baz", { foo: "", bar: "baz" }],
  ["a=b&c&d=e", "a=b&c=&d=e", { a: "b", c: "", d: "e" }],
  ["a=b&c=&d=e", "a=b&c=&d=e", { a: "b", c: "", d: "e" }],
  ["a=b&=c&d=e", "a=b&=c&d=e", { a: "b", "": "c", d: "e" }],
  ["a=b&=&c=d", "a=b&=&c=d", { a: "b", "": "", c: "d" }],
  ["&&foo=bar&&", "foo=bar", { foo: "bar" }],
  ["&", "", {}],
  ["&&&&", "", {}],
  ["&=&", "=", { "": "" }],
  ["&=&=", "=&=", { "": ["", ""] }],
  ["=", "=", { "": "" }],
  ["+", "%20=", { " ": "" }],
  ["+=", "%20=", { " ": "" }],
  ["+&", "%20=", { " ": "" }],
  ["=+", "=%20", { "": " " }],
  ["+=&", "%20=", { " ": "" }],
  ["a&&b", "a=&b=", { a: "", b: "" }],
  ["a=a&&b=b", "a=a&b=b", { a: "a", b: "b" }],
  ["&a", "a=", { a: "" }],
  ["&=", "=", { "": "" }],
  ["a&a&", "a=&a=", { a: ["", ""] }],
  ["a&a&a&", "a=&a=&a=", { a: ["", "", ""] }],
  ["a&a&a&a&", "a=&a=&a=&a=", { a: ["", "", "", ""] }],
  ["a=&a=value&a=", "a=&a=value&a=", { a: ["", "value", ""] }],
  ["foo+bar=baz+quux", "foo%20bar=baz%20quux", { "foo bar": "baz quux" }],
  ["+foo=+bar", "%20foo=%20bar", { " foo": " bar" }],
  ["a+", "a%20=", { "a ": "" }],
  ["=a+", "=a%20", { "": "a " }],
  ["a+&", "a%20=", { "a ": "" }],
  ["=a+&", "=a%20", { "": "a " }],
  ["%20+", "%20%20=", { "  ": "" }],
  ["=%20+", "=%20%20", { "": "  " }],
  ["%20+&", "%20%20=", { "  ": "" }],
  ["=%20+&", "=%20%20", { "": "  " }],
  [null, "", {}],
  [undefined, "", {}],
];
export const qsWeirdObjects = [
  [{ regexp: /./g }, "regexp=", { regexp: "" }],
  [{ regexp: new RegExp(".", "g") }, "regexp=", { regexp: "" }],
  [{ fn: () => {} }, "fn=", { fn: "" }],
  [{ fn: new Function("") }, "fn=", { fn: "" }],
  [{ math: Math }, "math=", { math: "" }],
  [{ e: extendedFunction }, "e=", { e: "" }],
  [{ d: new Date() }, "d=", { d: "" }],
  [{ d: Date }, "d=", { d: "" }],
  [{ f: new Boolean(false), t: new Boolean(true) }, "f=&t=", { f: "", t: "" }],
  [{ f: false, t: true }, "f=false&t=true", { f: "false", t: "true" }],
  [{ n: null }, "n=", { n: "" }],
  [{ nan: NaN }, "nan=", { nan: "" }],
  [{ inf: Infinity }, "inf=", { inf: "" }],
  [{ a: [], b: [] }, "", {}],
  [{ a: 1, b: [] }, "a=1", { a: "1" }],
];
