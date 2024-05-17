function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function isPrimitive(value) {
  return value !== Object(value);
}

function isFunction(value) {
  return typeof value === "function";
}

const deepClone = (value, hash = new WeakMap()) => {
  if (isPrimitive(value) || isFunction(value)) {
    return value;
  }

  // Check for circular references
  if (hash.has(value)) {
    return "[Circular]";
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value);
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value);
  }

  // Handle Map
  if (value instanceof Map) {
    const result = new Map();
    hash.set(value, result);
    value.forEach((val, key) => {
      result.set(deepClone(key, hash), deepClone(val, hash));
    });
    return result;
  }

  // Handle Set
  if (value instanceof Set) {
    const result = new Set();
    hash.set(value, result);
    value.forEach((val) => {
      result.add(deepClone(val, hash));
    });
    return result;
  }

  // Handle Array and Objects
  const result = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));
  hash.set(value, result);

  // Copy properties recursively
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      result[key] = deepClone(value[key], hash);
    }
  }

  // Handle Symbols in object keys
  const symbols = Object.getOwnPropertySymbols(value);
  for (const symbol of symbols) {
    if (value.propertyIsEnumerable(symbol)) {
      result[symbol] = deepClone(value[symbol], hash);
    }
  }

  return result;
};

function chaiEqualIgnoreUndefinedProps(chai, utils) {
  const { Assertion } = chai;

  function cloneIgnoringUndefinedProperties(value) {
    function cloneIgnoringUndefinedPropertiesInner(object) {
      if (Array.isArray(object)) {
        return object.map(cloneIgnoringUndefinedPropertiesInner);
      }

      if (!isPlainObject(object) || object === null) {
        return object;
      }

      const clonedObject = {};
      for (const key in object) {
        if (
          Object.prototype.hasOwnProperty.call(object, key) &&
          object[key] !== undefined
        ) {
          clonedObject[key] = cloneIgnoringUndefinedPropertiesInner(
            object[key],
          );
        }
      }

      return clonedObject;
    }
    const cloned = deepClone(value);
    return cloneIgnoringUndefinedPropertiesInner(cloned);
  }

  function assertEqual(_super) {
    return function (expected) {
      if (!utils.flag(this, "deep")) {
        return _super.apply(this, arguments);
      }

      const actual = this._obj;
      const applyResults = (filteredActual, filteredExpected) => {
        this._obj = filteredActual;
        arguments[0] = filteredExpected;
        return _super.apply(this, arguments);
      };

      if (expected instanceof Promise || actual instanceof Promise) {
        return Promise.all([
          Promise.resolve(actual),
          Promise.resolve(expected),
        ]).then(([resolvedActual, resolvedExpected]) => {
          return applyResults(
            cloneIgnoringUndefinedProperties(resolvedActual),
            cloneIgnoringUndefinedProperties(resolvedExpected),
          );
        });
      }

      return applyResults(
        cloneIgnoringUndefinedProperties(actual),
        cloneIgnoringUndefinedProperties(expected),
      );
    };
  }

  Assertion.overwriteMethod("eq", assertEqual);
  Assertion.overwriteMethod("eql", assertEqual);
  Assertion.overwriteMethod("eqls", assertEqual);
  Assertion.overwriteMethod("equal", assertEqual);
  Assertion.overwriteMethod("equals", assertEqual);
}

module.exports = chaiEqualIgnoreUndefinedProps;
module.exports.deepClone = deepClone;
module.exports.default = chaiEqualIgnoreUndefinedProps;
