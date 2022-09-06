# fast-querystring

Fast query-string parser to replace the legacy `node:querystring` parse function.

### Installation

```
npm i fast-querystring
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
║ qs                                      │   10000 │  295583.95 op/sec │  ± 1.44 % │                          ║
║ query-string                            │   10000 │  314370.91 op/sec │  ± 1.07 % │ + 6.36 %                 ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  808356.40 op/sec │  ± 2.45 % │ + 157.13 %               ║
║ URLSearchParams-with-construct          │   10000 │ 1135683.90 op/sec │  ± 3.18 % │ + 40.49 %                ║
║ node:querystring                        │   10000 │ 1275958.09 op/sec │  ± 3.88 % │ + 12.35 %                ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance │ Difference with previous ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ fast-querystring                        │   10000 │ 1492040.49 op/sec │  ± 2.77 % │ + 16.93 %                ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╧══════════════════════════╝
```
