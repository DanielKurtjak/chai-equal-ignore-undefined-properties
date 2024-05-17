const fClone = require("fclone");

function chaiEqualIgnoreUndefinedProps(chai, utils) {
  const { Assertion } = chai;

  function cloneIgnoringUndefinedProperties(value) {
    function cloneIgnoringUndefinedPropertiesInner(object) {
      if (typeof object !== "object" || object === null) {
        return object;
      }

      if (Array.isArray(object)) {
        return object.map((item) =>
          cloneIgnoringUndefinedPropertiesInner(item, true),
        );
      }

      const clonedObject = {};
      for (const key in object) {
        if (
          Object.prototype.hasOwnProperty.call(object, key) &&
          object[key] !== undefined
        ) {
          clonedObject[key] = cloneIgnoringUndefinedPropertiesInner(
            object[key],
            true,
          );
        }
      }

      return clonedObject;
    }

    return cloneIgnoringUndefinedPropertiesInner(fClone(value));
  }

  function assertEqual(_super) {
    return function (expected) {
      if (!utils.flag(this, "deep")) {
        return _super.apply(this, arguments);
      }

      const actual = utils.flag(this, "object");
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
module.exports.default = chaiEqualIgnoreUndefinedProps;
