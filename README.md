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
║ qs                                      │   10000 │  316721.51 op/sec │  ± 1.13 % │                          ║
║ query-string                            │   10000 │  336703.57 op/sec │  ± 1.07 % │ + 6.31 %                 ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  855837.00 op/sec │  ± 2.37 % │ + 154.18 %               ║
║ URLSearchParams-with-construct          │    3000 │ 1157891.65 op/sec │  ± 0.87 % │ + 35.29 %                ║
║ node:querystring                        │    2500 │ 1414600.03 op/sec │  ± 0.96 % │ + 22.17 %                ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance │ Difference with previous ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ fast-querystring                        │   10000 │ 1500650.01 op/sec │  ± 2.52 % │ + 6.08 %                 ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧══════════════════════════╝
```
