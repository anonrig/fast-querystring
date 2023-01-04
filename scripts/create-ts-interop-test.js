#!/usr/bin/env node
const path = require("path");
const fs = require("fs").promises;

const packageJsonType =
  process.argv[2] || process.env.PACKAGE_JSON_TYPE || "commonjs";
const tsconfigModule = process.argv[2] || process.env.TSCONFIG_MODULE || "Node";
const tsconfigModuleResolution =
  process.argv[2] || process.env.TSCONFIG_MODULE_RESOLUTION || "Node";

const rootPath = path.join(__dirname, "..");
const testPath = path.join(rootPath, "test_interop");

const indexTs = `import fastQuerystring from 'fast-querystring'
import { stringify, parse } from 'fast-querystring'
import * as fQuerystring from 'fast-querystring'
import { equal } from "assert"

equal(typeof fastQuerystring, 'object')
equal(typeof fastQuerystring.stringify, 'function')
equal(typeof fastQuerystring.parse, 'function')
equal(typeof fQuerystring.stringify, 'function')
equal(typeof fQuerystring.parse, 'function')
equal(typeof stringify, 'function')
equal(typeof parse, 'function')
`;

const tsconfigJson = JSON.stringify(
  {
    compilerOptions: {
      module: tsconfigModule,
      moduleResolution: tsconfigModuleResolution,
    },
  },
  null,
  2,
);

const packageJson = JSON.stringify(
  {
    name: "fqs-test",
    version: "1.0.0",
    description: "",
    main: "index.js",
    type: packageJsonType,
    scripts: {
      "test-interop": "tsc -p . && node index.js",
    },
    keywords: [],
    author: "",
    license: "ISC",
    dependencies: {
      "@types/node": "^18.11.10",
      typescript: "^4.9.3",
    },
  },
  null,
  2,
);

async function main() {
  await fs.mkdir(testPath);
  await fs.writeFile(path.join(testPath, "package.json"), packageJson);
  await fs.writeFile(path.join(testPath, "tsconfig.json"), tsconfigJson);
  await fs.writeFile(path.join(testPath, "index.ts"), indexTs);
}

main(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
