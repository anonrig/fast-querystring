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
║ query-string                 │   10000 │  310383.60 op/sec │  ± 1.14 % ║
║ qs                           │   10000 │  354332.59 op/sec │  ± 1.23 % ║
║ @aws-sdk/querystring-builder │   10000 │  411500.38 op/sec │  ± 1.30 % ║
║ http-querystring-stringify   │    1500 │  535883.47 op/sec │  ± 1.00 % ║
║ URLSearchParams              │   10000 │  594068.52 op/sec │  ± 1.61 % ║
║ querystringparser            │   10000 │  766081.64 op/sec │  ± 2.18 % ║
║ querystringify               │   10000 │  914083.38 op/sec │  ± 1.67 % ║
║ node:querystring             │    4000 │ 1822536.85 op/sec │  ± 0.91 % ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                 │ Samples │            Result │ Tolerance ║
╟──────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring             │   10000 │ 2186435.62 op/sec │  ± 3.48 % ║
╚══════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```
