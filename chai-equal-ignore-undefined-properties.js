const clone = require("fclone");

function chaiEqualIgnoreUndefinedProps(chai, utils) {
  const { Assertion } = chai;

  function cloneIgnoringUndefinedProperties(val, deepClone) {
    const obj = clone(val);

    function cloneIgnoringUndefinedPropertiesInner(object, deepClone) {
      if (typeof object !== "object" || object === null) {
        return object;
      }

      if (Array.isArray(object)) {
        return deepClone
          ? object.map((item) =>
              cloneIgnoringUndefinedPropertiesInner(item, true),
            )
          : object;
      }

      const clonedObject = {};
      for (const key in object) {
        if (
          Object.prototype.hasOwnProperty.call(object, key) &&
          object[key] !== undefined
        ) {
          clonedObject[key] = deepClone
            ? cloneIgnoringUndefinedPropertiesInner(object[key], true)
            : object[key];
        }
      }

      return clonedObject;
    }

    return cloneIgnoringUndefinedPropertiesInner(obj, deepClone);
  }

  function assertEqual(_super) {
    return function (val) {
      const deepClone = utils.flag(this, "deep");
      const strippedVal = cloneIgnoringUndefinedProperties(val, deepClone);

      this._obj = cloneIgnoringUndefinedProperties(this._obj, deepClone);

      arguments[0] = strippedVal;

      return _super.apply(this, arguments);
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
