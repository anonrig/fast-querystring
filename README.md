# fast-querystring

Fast query-string parser to replace the legacy `node:querystring` parse function.

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
║ qs                                      │    9000 │  320475.01 op/sec │  ± 1.00 % ║
║ query-string                            │   10000 │  329524.10 op/sec │  ± 1.33 % ║
║ querystringify                          │    1000 │  447654.63 op/sec │  ± 0.64 % ║
║ @aws-sdk/querystring-parser             │    1000 │  467889.89 op/sec │  ± 0.75 % ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  836523.77 op/sec │  ± 3.43 % ║
║ URLSearchParams-with-construct          │   10000 │ 1239361.94 op/sec │  ± 2.88 % ║
║ node:querystring                        │   10000 │ 1399756.44 op/sec │  ± 4.07 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │    5500 │ 1496630.81 op/sec │  ± 0.98 % ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Stringify a query-string

```
> node benchmark/stringify.mjs

╔══════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests     │ Samples │            Result │ Tolerance ║
╟──────────────────┼─────────┼───────────────────┼───────────╢
║ query-string     │   10000 │  294312.93 op/sec │  ± 1.31 % ║
║ qs               │   10000 │  355420.44 op/sec │  ± 1.26 % ║
║ URLSearchParams  │   10000 │  594915.18 op/sec │  ± 1.47 % ║
║ querystringify   │   10000 │  785004.65 op/sec │  ± 2.09 % ║
║ node:querystring │    1500 │ 1864502.85 op/sec │  ± 0.85 % ║
╟──────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test     │ Samples │            Result │ Tolerance ║
╟──────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring │   10000 │ 1893015.11 op/sec │  ± 4.26 % ║
╚══════════════════╧═════════╧═══════════════════╧═══════════╝
```
