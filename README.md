# chai-equal-ignore-undefined-properties

[![npm](https://img.shields.io/npm/v/chai-equal-ignore-undefined-properties.svg)](https://www.npmjs.com/package/chai-equal-ignore-undefined-properties)
[![npm](https://img.shields.io/npm/dw/chai-equal-ignore-undefined-properties.svg)](https://www.npmjs.com/package/chai-equal-ignore-undefined-properties)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![CI Status](https://github.com/DanielKurtjak/chai-equal-ignore-undefined-properties/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/DanielKurtjak/chai-equal-ignore-undefined-properties/actions/workflows/test.yaml)

Ignore keys with undefined value to compare from a deep equal operation with chai [expect](http://chaijs.com/api/bdd/).

## Why?

Sometimes you will have properties which have undefined value. This plugin helps to ignore those properties from comparison.

Works with both objects and array of objects with or without circular references.

## Installation

```bash
npm install chai-equal-ignore-undefined-properties --save-dev
```

```bash
yarn add chai-equal-ignore-undefined-properties --dev
```

## Usage

### Require

```js
const chai = require("chai");
const chaiIgnoreUndefinedProperties = require("chai-equal-ignore-undefined-properties");

chai.use(chaiIgnoreUndefinedProperties);
```

### ES6 Import

```js
import chai from "chai";
import chaiIgnoreUndefinedProperties from "chai-equal-ignore-undefined-properties";

chai.use(chaiIgnoreUndefinedProperties);
```

### TypeScript

```js
import * as chai from "chai";
import chaiIgnoreUndefinedProperties from "chai-equal-ignore-undefined-properties";

chai.use(chaiIgnoreUndefinedProperties);

// The typings for chai-equal-ignore-undefined-properties are included with the package itself.
```

## Examples

All these examples are for JavaScript.

### a) excluding

1. Ignore a top level property from an object

```js
expect({ aa: undefined, bb: "b" }).to.equal({
  bb: "b",
  cc: undefined,
});
```

2. Ignore properties within array with undefined values

```js
const expectedArray = [{ aa: undefined, bb: "b" }];
const actualArray = [{ cc: undefined, bb: "b" }];
expect(actualArray).to.deep.equal(expectedArray);
```

3. Ignore a nested properties with undefined value (only for deep equal comparison)

```js
expect({
  topLevelProp: { aa: undefined, bb: "b" },
}).to.deep.equal({
  topLevelProp: { bb: "b", cc: undefined },
});
```

4. Works with circular dependencies

```js
const actualObject = { aa: undefined, bb: "b" };
actualObject.c = actualObject;

const expectedObject = { bb: "b", cc: undefined };
expectedObject.c = expectedObject;

expect(actualObject).to.deep.equal(expectedObject);
```

## Contributing

Contributions are welcome. If you have any questions create an issue [here](https://github.com/DanielKurtjak/chai-equal-ignore-undefined-properties/issues).

## License

[MIT](LICENSE)
