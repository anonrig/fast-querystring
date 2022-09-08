# fast-querystring

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
║ qs                                      │   10000 │  302595.31 op/sec │  ± 1.22 % ║
║ query-string                            │    9500 │  334820.82 op/sec │  ± 0.99 % ║
║ querystringify                          │    1000 │  437899.50 op/sec │  ± 0.73 % ║
║ @aws-sdk/querystring-parser             │    1000 │  454836.96 op/sec │  ± 0.69 % ║
║ URLSearchParams-with-Object.fromEntries │    1500 │  849572.92 op/sec │  ± 0.89 % ║
║ URLSearchParams-with-construct          │   10000 │ 1190835.28 op/sec │  ± 3.22 % ║
║ node:querystring                        │   10000 │ 1384717.43 op/sec │  ± 2.99 % ║
║ querystringparser                       │    3500 │ 1735544.65 op/sec │  ± 0.95 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 2023187.35 op/sec │  ± 2.67 % ║
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
