# fast-querystring

Fast query-string parser to replace the legacy `node:querystring` parse & stringify functions.

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
║ qs                                      │   10000 │  317841.53 op/sec │  ± 1.18 % ║
║ query-string                            │   10000 │  341009.91 op/sec │  ± 1.06 % ║
║ querystringify                          │    1000 │  451609.79 op/sec │  ± 0.61 % ║
║ @aws-sdk/querystring-parser             │    1000 │  477241.09 op/sec │  ± 0.69 % ║
║ URLSearchParams-with-Object.fromEntries │   10000 │  870095.07 op/sec │  ± 3.29 % ║
║ URLSearchParams-with-construct          │   10000 │ 1232650.60 op/sec │  ± 2.95 % ║
║ node:querystring                        │   10000 │ 1462802.04 op/sec │  ± 3.69 % ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ Fastest test                            │ Samples │            Result │ Tolerance ║
╟─────────────────────────────────────────┼─────────┼───────────────────┼───────────╢
║ fast-querystring                        │   10000 │ 1809816.84 op/sec │  ± 3.19 % ║
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
