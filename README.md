# fast-querystring

Fast query-string parser to replace the deprecated `node:querystring` parse function.

### Installation

```
npm i --save fast-querystring
```

### Features

- Uses `&` separator as default
- Removes fragment from string
  - `foo=bar#hello=world` parses into `{foo: 'bar'}`
- Supports only UTF-8
- Supports only input of type `string`
- Key & value with length 0 is omitted by default
  - `foo=bar&hey` parses into `{foo: 'bar'}`
- Supports repeating keys in query string
  - `foo=bar&foo=baz` parses into `{foo: ['bar', 'baz']}`

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

╔══════════════════╤═════════╤═══════════════════╤═══════════╤══════════════════════════╗
║ Slower tests     │ Samples │            Result │ Tolerance │ Difference with previous ║
╟──────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ qs               │   10000 │  690970.02 op/sec │  ± 2.62 % │                          ║
║ query-string     │   10000 │  728597.61 op/sec │  ± 3.27 % │ + 5.45 %                 ║
║ URLStateMachine  │   10000 │  782804.78 op/sec │  ± 2.19 % │ + 7.44 %                 ║
║ node:querystring │   10000 │ 3225895.94 op/sec │  ± 7.42 % │ + 312.09 %               ║
╟──────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ Fastest test     │ Samples │            Result │ Tolerance │ Difference with previous ║
╟──────────────────┼─────────┼───────────────────┼───────────┼──────────────────────────╢
║ fast-querystring │   10000 │ 3499113.15 op/sec │  ± 4.37 % │ + 8.47 %                 ║
╚══════════════════╧═════════╧═══════════════════╧═══════════╧══════════════════════════╝
```
