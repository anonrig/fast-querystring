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
║ qs                                      │   10000 │  350884.75 op/sec │  ± 1.36 % ║
║ query-string                            │   10000 │  383165.31 op/sec │  ± 1.22 % ║
║ querystringify                          │    1500 │  530280.43 op/sec │  ± 0.90 % ║
║ @aws-sdk/querystring-parser             │    2000 │  556657.27 op/sec │  ± 0.79 % ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  845766.67 op/sec │  ± 2.85 % ║
║ URLSearchParams-with-construct          │   10000 │ 1158368.83 op/sec │  ± 4.28 % ║
║ node:querystring                        │    2000 │ 1460476.58 op/sec │  ± 0.96 % ║
║ querystringparser                       │   10000 │ 1976384.97 op/sec │  ± 4.11 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 2123713.08 op/sec │  ± 2.87 % ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Stringify a query-string

```
> node benchmark/stringify.mjs

╔══════════════════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests                 │ Samples │            Result │ Tolerance ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ query-string                 │   10000 │  286850.93 op/sec │  ± 1.28 % ║
║ qs                           │   10000 │  349458.21 op/sec │  ± 1.47 % ║
║ @aws-sdk/querystring-builder │   10000 │  393736.38 op/sec │  ± 1.78 % ║
║ URLSearchParams              │    1000 │  402765.87 op/sec │  ± 0.57 % ║
║ http-querystring-stringify   │   10000 │  535008.72 op/sec │  ± 2.33 % ║
║ querystringparser            │   10000 │  541710.81 op/sec │  ± 2.46 % ║
║ querystringify               │   10000 │  680866.27 op/sec │  ± 3.09 % ║
║ querystringify-ts            │   10000 │  823101.36 op/sec │  ± 2.78 % ║
║ node:querystring             │    1500 │ 1065264.49 op/sec │  ± 0.88 % ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                 │ Samples │            Result │ Tolerance ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring             │   10000 │ 1903529.51 op/sec │  ± 5.96 % ║
╚══════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Importing package.

```
> node benchmark/import.mjs

╔═════════════════════════════╤═════════╤═════════════════╤═══════════╗
║ Slower tests                │ Samples │          Result │ Tolerance ║
╟─────────────────────────────┼─────────┼─────────────────┼───────────╢
║ @aws-sdk/querystring-parser │    1000 │  8675.34 op/sec │  ± 0.41 % ║
║ querystringparser           │    1000 │  9580.93 op/sec │  ± 0.75 % ║
║ querystringify              │    1000 │  9641.84 op/sec │  ± 0.51 % ║
║ qs                          │    1000 │  9840.70 op/sec │  ± 0.79 % ║
║ query-string                │    2000 │ 10958.10 op/sec │  ± 0.86 % ║
╟─────────────────────────────┼─────────┼─────────────────┼───────────╢
║ Fastest test                │ Samples │          Result │ Tolerance ║
╟─────────────────────────────┼─────────┼─────────────────┼───────────╢
║ fast-querystring            │    1500 │ 36919.26 op/sec │  ± 0.94 % ║
╚═════════════════════════════╧═════════╧═════════════════╧═══════════╝
```
