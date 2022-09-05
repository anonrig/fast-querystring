# fast-querystring

Fast query-string parser to replace the legacy `node:querystring` parse function.

### Installation

```
npm i --save fast-querystring
```

### Features

- Parsed object does not have prototype methods
- Uses `&` separator as default
- Supports only input of type `string`
- Supports repeating keys in query string
  - `foo=bar&foo=baz` parses into `{foo: ['bar', 'baz']}`
- Supports pairs with missing values
  - `foo=bar&hola` parses into `{foo: 'bar', hola: ''}`

### Usage

```javascript
const QueryString = require('fast-querystring')
const qs = QueryString.parse('hello=world&foo=bar&values=v1&values=v2')

console.log(qs)
// {
//   hello: 'world',
//   foo: 'bar',
//   values: ['v1', 'v2']
// }
```

### Benchmark

```
> fast-querystring@0.1.0 benchmark
> node test/benchmark.mjs

╔═════════════════════════════════════════╤═════════╤═══════════════════╤═══════════╤══════════════════════════╗
║ Slower tests                            │ Samples │            Result │ Tolerance │ Difference with previous ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ qs                                      │   10000 │  314490.53 op/sec │  ± 1.30 % │                          ║
║ query-string                            │   10000 │  335943.68 op/sec │  ± 1.26 % │ + 6.82 %                 ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  841094.46 op/sec │  ± 2.71 % │ + 150.37 %               ║
║ URLSearchParams-with-construct          │   10000 │ 1230055.12 op/sec │  ± 3.04 % │ + 46.24 %                ║
║ node:querystring                        │   10000 │ 1402133.99 op/sec │  ± 4.02 % │ + 13.99 %                ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance │ Difference with previous ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ fast-querystring                        │   10000 │ 1620376.82 op/sec │  ± 3.72 % │ + 15.57 %                ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧══════════════════════════╝
```
