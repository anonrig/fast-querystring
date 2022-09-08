# fast-querystring

Fast query-string parser to replace the legacy `node:querystring` parse & stringify functions.

### Installation

```
npm i fast-querystring
```

### Features

- Supports both `parse` and `stringify` methods from `node:querystring` module
- Parsed object does not have prototype methods
- Uses `&` separator as default
- Supports only input of type `string`
- Supports repeating keys in query string
  - `foo=bar&foo=baz` parses into `{foo: ['bar', 'baz']}`
- Supports pairs with missing values
  - `foo=bar&hola` parses into `{foo: 'bar', hola: ''}`
- Stringify does not support nested values (just like `node:querystring`)

### Usage

```javascript
const qs = require('fast-querystring')

// Parsing a querystring
console.log(qs.parse('hello=world&foo=bar&values=v1&values=v2'))
// {
//   hello: 'world',
//   foo: 'bar',
//   values: ['v1', 'v2']
// }

// Stringifying an object
console.log(qs.stringify({ foo: ['bar', 'baz'] }))
// 'foo=bar&foo=baz'
```

### Benchmark

- Parsing a query-string

```
> node benchmark/parse.mjs

╔═════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ qs                                      │   10000 │  290743.91 op/sec │  ± 1.87 % ║
║ query-string                            │    1500 │  333025.25 op/sec │  ± 0.98 % ║
║ querystringify                          │   10000 │  430382.40 op/sec │  ± 1.95 % ║
║ @aws-sdk/querystring-parser             │    3000 │  452331.29 op/sec │  ± 0.87 % ║
║ URLSearchParams-with-Object.fromEntries │    2000 │  862635.26 op/sec │  ± 0.87 % ║
║ URLSearchParams-with-construct          │   10000 │ 1216331.19 op/sec │  ± 3.19 % ║
║ node:querystring                        │   10000 │ 1453849.93 op/sec │  ± 4.50 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 2047629.50 op/sec │  ± 3.72 % ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Stringify a query-string

```
> node benchmark/stringify.mjs

╔════════════════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests               │ Samples │            Result │ Tolerance ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ query-string               │   10000 │  284130.63 op/sec │  ± 1.62 % ║
║ qs                         │   10000 │  334799.48 op/sec │  ± 1.93 % ║
║ http-querystring-stringify │   10000 │  482642.49 op/sec │  ± 1.72 % ║
║ URLSearchParams            │   10000 │  587274.65 op/sec │  ± 1.88 % ║
║ querystringify             │   10000 │  753960.35 op/sec │  ± 2.20 % ║
║ node:querystring           │   10000 │ 1796993.95 op/sec │  ± 5.34 % ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test               │ Samples │            Result │ Tolerance ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring           │   10000 │ 2051022.89 op/sec │  ± 4.52 % ║
╚════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```
