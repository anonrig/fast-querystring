# fast-querystring

![Test](https://github.com/anonrig/fast-querystring/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/anonrig/fast-querystring/branch/main/graph/badge.svg?token=4ZDJA2BMOH)](https://codecov.io/gh/anonrig/fast-querystring)
[![NPM version](https://img.shields.io/npm/v/fast-querystring.svg?style=flat)](https://www.npmjs.com/package/fast-querystring)

Fast query-string parser and stringifier to replace the legacy `node:querystring` module.

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
║ qs                                      │   10000 │  310825.09 op/sec │  ± 1.29 % ║
║ query-string                            │    1000 │  340059.83 op/sec │  ± 0.82 % ║
║ querystringify                          │   10000 │  435456.34 op/sec │  ± 1.06 % ║
║ @aws-sdk/querystring-parser             │    1000 │  451618.35 op/sec │  ± 0.85 % ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  876030.86 op/sec │  ± 1.78 % ║
║ URLSearchParams-with-construct          │   10000 │ 1239366.24 op/sec │  ± 2.59 % ║
║ node:querystring                        │   10000 │ 1442731.43 op/sec │  ± 2.95 % ║
║ querystringparser                       │    3000 │ 1863385.29 op/sec │  ± 0.99 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 2086260.18 op/sec │  ± 3.18 % ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Stringify a query-string

```
> node benchmark/stringify.mjs

╔══════════════════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests                 │ Samples │            Result │ Tolerance ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ query-string                 │   10000 │  294354.42 op/sec │  ± 1.25 % ║
║ qs                           │   10000 │  349992.31 op/sec │  ± 1.45 % ║
║ @aws-sdk/querystring-builder │   10000 │  380426.03 op/sec │  ± 1.69 % ║
║ http-querystring-stringify   │   10000 │  489248.93 op/sec │  ± 1.54 % ║
║ URLSearchParams              │   10000 │  579241.21 op/sec │  ± 1.92 % ║
║ querystringparser            │    1500 │  667303.72 op/sec │  ± 0.77 % ║
║ querystringify               │   10000 │  780283.61 op/sec │  ± 2.43 % ║
║ node:querystring             │   10000 │ 1779241.34 op/sec │  ± 6.49 % ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                 │ Samples │            Result │ Tolerance ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring             │   10000 │ 2125769.45 op/sec │  ± 3.93 % ║
╚══════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```
