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
║ qs                                      │   10000 │  310498.16 op/sec │  ± 1.40 % ║
║ query-string                            │   10000 │  335094.41 op/sec │  ± 1.06 % ║
║ querystringify                          │   10000 │  444913.68 op/sec │  ± 1.32 % ║
║ @aws-sdk/querystring-parser             │    1000 │  462867.39 op/sec │  ± 0.75 % ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  830585.13 op/sec │  ± 3.19 % ║
║ URLSearchParams-with-construct          │   10000 │ 1216221.57 op/sec │  ± 3.46 % ║
║ node:querystring                        │    3500 │ 1407749.94 op/sec │  ± 0.91 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 1575870.52 op/sec │  ± 2.80 % ║
╚═════════════════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```

- Stringify a query-string

```
> node benchmark/stringify.mjs

╔════════════════════════════╤═════════╤═══════════════════╤═══════════╗
║ Slower tests               │ Samples │            Result │ Tolerance ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ query-string               │   10000 │  290850.12 op/sec │  ± 1.52 % ║
║ qs                         │   10000 │  324324.45 op/sec │  ± 2.05 % ║
║ http-querystring-stringify │   10000 │  481327.85 op/sec │  ± 1.77 % ║
║ URLSearchParams            │   10000 │  538867.84 op/sec │  ± 3.93 % ║
║ querystringify             │   10000 │  774992.18 op/sec │  ± 2.51 % ║
║ node:querystring           │   10000 │ 1827458.66 op/sec │  ± 5.41 % ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test               │ Samples │            Result │ Tolerance ║
╟────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring           │   10000 │ 1881474.27 op/sec │  ± 4.78 % ║
╚════════════════════════════╧═════════╧═══════════════════╧═══════════╝
```
