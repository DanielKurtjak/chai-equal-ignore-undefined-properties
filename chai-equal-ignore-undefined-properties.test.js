/* eslint-env mocha */

const { use, assert, expect } = require("chai");

const {
  default: chaiEqualIgnoreUndefinedProps,
  deepClone,
} = require("./chai-equal-ignore-undefined-properties");

use(chaiEqualIgnoreUndefinedProps);

describe("chai-equal-ignore-undefined-props", () => {
  describe("deepClone", () => {
    it("should clone an object", () => {
      const obj = {
        a: 1,
        b: new Date(),
        c: /abc/,
        d: new Map([["key1", "value1"]]),
        e: new Set([1, 2, 3]),
        f: function () {
          return "f";
        },
        g: Symbol("g"),
        h: null,
        i: undefined,
        j: true,
        k: [1, 2, { l: "m" }],
        m: {
          n: {
            o: "p",
          },
        },
      };

      // Use assert.deepEqual to compare the cloned object with the original object
      assert.deepEqual(deepClone(obj), obj);
    });
  });

  describe("expect(...).to[.deep].eq[ua]l[s](...)", () => {
    describe("with promises", () => {
      it("should work when actual param is a promise", async () => {
        await expect(Promise.resolve({ a: undefined, b: "b" })).to.deep.equal({
          b: "b",
          c: undefined,
        });
      });

      it("should work when expected param is a promise", async () => {
        await expect({ a: undefined, b: "b" }).to.deep.equal(
          Promise.resolve({ b: "b", c: undefined }),
        );
      });
    });

    it("should work normally for all primitive types", () => {
      expect(undefined).to.deep.equal(undefined);
      expect(null).to.deep.equal(null);
      expect(true).to.deep.equal(true);
      expect(false).to.deep.equal(false);
      expect(0).to.deep.equal(0);
      expect(1).to.deep.equal(1);
      expect("").to.deep.equal("");
      expect("string").to.deep.equal("string");
    });

    it("should not work with mixed primitive types", () => {
      expect(undefined).to.not.deep.equal(null);
      expect(null).to.not.deep.equal(true);
      expect(true).to.not.deep.equal(false);
      expect(false).to.not.deep.equal(0);
      expect(0).to.not.deep.equal(1);
      expect(1).to.not.deep.equal("");
      expect("").to.not.deep.equal("string");
    });

    it("should fail if used with not equal primitive types", () => {
      expect(() => {
        expect(undefined).to.deep.equal(null);
      }).to.throw("expected undefined to deeply equal null");

      expect(() => {
        expect(null).to.deep.equal(true);
      }).to.throw("expected null to deeply equal true");

      expect(() => {
        expect(true).to.deep.equal(false);
      }).to.throw("expected true to deeply equal false");

      expect(() => {
        expect(false).to.deep.equal(0);
      }).to.throw("expected false to deeply equal +0");

      expect(() => {
        expect(0).to.deep.equal(undefined);
      }).to.throw("expected +0 to deeply equal undefined");

      expect(() => {
        expect(0).to.deep.equal(null);
      }).to.throw("expected +0 to deeply equal null");

      expect(() => {
        expect(0).to.deep.equal("");
      }).to.throw("expected +0 to deeply equal ''");

      expect(() => {
        expect("").to.deep.equal("string");
      }).to.throw("expected '' to deeply equal 'string'");

      expect(undefined).to.not.deep.equal(null);
      expect(null).to.not.deep.equal(true);
      expect(true).to.not.deep.equal(false);
      expect(false).to.not.deep.equal(0);
      expect(0).to.not.deep.equal(1);
      expect(1).to.not.deep.equal("");
      expect("").to.not.deep.equal("string");
    });

    it("should fail if not is used when the primitive types are the same", () => {
      expect(() => {
        expect(undefined).to.not.deep.equal(undefined);
      }).to.throw("expected undefined to not deeply equal undefined");

      expect(() => {
        expect(null).to.not.deep.equal(null);
      }).to.throw("expected null to not deeply equal null");

      expect(() => {
        expect(true).to.not.deep.equal(true);
      }).to.throw("expected true to not deeply equal true");

      expect(() => {
        expect(false).to.not.deep.equal(false);
      }).to.throw("expected false to not deeply equal false");

      expect(() => {
        expect(0).to.not.deep.equal(0);
      }).to.throw("expected +0 to not deeply equal +0");

      expect(() => {
        expect(1).to.not.deep.equal(1);
      }).to.throw("expected 1 to not deeply equal 1");

      expect(() => {
        expect("").to.not.deep.equal("");
      }).to.throw("expected '' to not deeply equal ''");

      expect(() => {
        expect("string").to.not.deep.equal("string");
      }).to.throw("expected 'string' to not deeply equal 'string'");
    });

    it("should work with deep equal map objects", () => {
      const mapA = new Map([
        ["b", "b"],
        ["c", [1, 2]],
      ]);
      const mapB = new Map([
        ["b", "b"],
        ["c", [1, 2]],
      ]);
      expect(mapA).to.deep.equal(mapB);
    });

    it("should not ignore deep equal map objects having undefined properties", () => {
      const mapA = new Map([
        ["b", "b"],
        ["withUndefinedKey", { aa: undefined, b: "b" }],
      ]);
      const mapB = new Map([
        ["b", "b"],
        ["withUndefinedKey", { cc: undefined, b: "b" }],
      ]);

      // The expected value has a different key with undefined value
      expect(() => {
        expect(mapA).to.deep.equal(mapB);
      }).to.throw(
        "expected Map{ 'b' => 'b', …(1) } to deeply equal Map{ 'b' => 'b', …(1) }",
      );
    });

    it("should work with deep equal set objects", () => {
      const setA = new Set(["b", [1, 2]]);
      const setB = new Set(["b", [1, 2]]);
      expect(setA).to.deep.equal(setB);
    });

    it("should work with not deep equal normally", () => {
      const obj = { a: undefined, b: "b" };

      // Different object reference
      expect(obj).to.not.equal({ b: "b" });

      // Same object reference
      expect(obj).to.equal(obj);

      // Different object reference
      expect(obj).to.not.equal({ ...obj });

      // Same object reference with deep equal
      expect(obj).to.deep.equal(obj);
    });

    it("should ignore key(s) with undefined value from comparison for both expected value and actual value", () => {
      expect({ a: undefined, b: "b" }).to.deep.equal({
        b: "b",
        c: undefined,
      });

      expect({ a: undefined, aa: undefined, b: "b" }).to.deep.equal({
        b: "b",
        c: undefined,
        cc: undefined,
      });
    });

    it("should ignore key(s) with undefined value from comparison for expected value ", () => {
      expect({ a: undefined, b: "b" }).to.deep.equal({
        b: "b",
      });

      expect({ a: undefined, c: undefined, b: "b" }).to.deep.equal({
        b: "b",
      });
    });

    it("should ignore key(s) with undefined value from comparison from actual value", () => {
      expect({ b: "b" }).to.deep.equal({ b: "b", a: undefined });

      expect({ b: "b" }).to.deep.equal({ b: "b", a: undefined, c: undefined });
    });

    it("should ignore key(s) with undefined value from comparison for nested objects", () => {
      expect({ a: { b: undefined, c: "c" } }).to.deep.equal({
        a: { c: "c", d: undefined },
      });

      expect({ a: { b: undefined, bb: undefined, c: "c" } }).to.deep.equal({
        a: { c: "c", d: undefined, dd: undefined },
      });
    });

    it("should not ignore key(s) with undefined value if assertion is not deep", () => {
      expect({ a: { b: undefined, d: "d", c: "c" }, d: "d" }).to.not.equals({
        a: { c: "c", d: undefined },
      });

      expect({ a: { b: undefined, bb: undefined, c: "c" } }).to.not.equals({
        a: { c: "c", d: undefined, dd: undefined },
      });
    });

    it("should throw an error if the actual value does not match the expected value", () => {
      expect(() => {
        expect({ a: undefined, b: "b" }).to.deep.equal({
          b: "wrong value",
          c: undefined,
        });
      }).to.throw("expected { b: 'b' } to deeply equal { b: 'wrong value' }");
    });

    it("should handle undefined value if assertion is deep equal for arrays", () => {
      expect([undefined, "b"]).to.not.equals(["b"]);
      expect([
        [undefined, "a"],
        ["b", undefined],
      ]).to.deep.equal([
        [undefined, "a"],
        ["b", undefined],
      ]);
    });

    it("should throw an error if the actual value is not an object or array", () => {
      expect(() => {
        expect(undefined).to.deep.equal({ a: undefined });
      }).to.throw("expected undefined to deeply equal {}");

      expect(() => {
        expect(null).to.deep.equal({ a: undefined });
      }).to.throw("expected null to deeply equal {}");

      expect(() => {
        expect("string").to.deep.equal({ a: undefined });
      }).to.throw("expected 'string' to deeply equal {}");

      expect(() => {
        expect(123).to.deep.equal({ a: undefined });
      }).to.throw("expected 123 to deeply equal {}");

      expect(() => {
        expect(true).to.deep.equal({ a: undefined });
      }).to.throw("expected true to deeply equal {}");
    });

    it("should ignore key(s) with undefined value from comparison for both expected value and actual value in mixed objects and arrays", () => {
      expect([{ a: undefined, b: "b" }, ["c"]]).to.deep.equal([
        { b: "b" },
        ["c"],
      ]);
    });

    it("should ignore key(s) with undefined value from comparison for both expected value and actual value in mixed nested objects and arrays", () => {
      expect({ a: [{ b: undefined, c: "c" }] }).to.deep.equal({
        a: [{ c: "c" }],
      });
      expect({ a: [{ b: undefined, c: "c" }] }).to.deep.equal({
        a: [{ c: "c", d: undefined }],
      });
    });

    it("should not replace with [Circular] if the circular reference is not detected", () => {
      const ref = { r: "r" };
      // There is some reference to the same object but it is not circular
      const actualObject = { a: undefined, b: "b", ref, c: { ref } };
      const expectedObject = { c: undefined, b: "b", ref, c: { ref } };

      expect(actualObject).to.deep.equal(expectedObject);
      expect(actualObject).to.deep.equal({ b: "b", ref, c: { ref } });
    });

    it("should handle circular references on a top level properties", () => {
      const actualObject = { a: undefined, b: "b" };
      actualObject.c = actualObject;

      const expectedObject = { b: "b", c: undefined };
      expectedObject.c = expectedObject;

      expect(actualObject).to.deep.equal(expectedObject);
      expect(actualObject).to.deep.equal({ b: "b", c: "[Circular]" });
    });

    it("should handle circular references with nested objects", () => {
      const actualObject = { a: { b: undefined, c: "c" } };
      actualObject.a.d = actualObject;

      const expectedObject = { a: { c: "c", d: undefined } };
      expectedObject.a.d = expectedObject;

      expect(actualObject).to.deep.equal(expectedObject);
      expect(actualObject).to.deep.equal({ a: { c: "c", d: "[Circular]" } });
    });

    it("should handle circular references with arrays", () => {
      const actualArray = [undefined, "b"];
      actualArray.push(actualArray);

      const expectedArray = [undefined, "b"];
      expectedArray.push(expectedArray);

      expect(actualArray).to.deep.equal(expectedArray);
      expect(actualArray).to.deep.equal([undefined, "b", "[Circular]"]);
    });

    it("should handle circular references with mixed objects and arrays", () => {
      const actualMixed = [{ a: undefined, b: "b" }, ["c"]];
      actualMixed.push(actualMixed);

      const expectedMixed = [{ b: "b" }, ["c"]];
      expectedMixed.push(expectedMixed);

      expect(actualMixed).to.deep.equal(expectedMixed);
      expect(actualMixed).to.deep.equal([{ b: "b" }, ["c"], "[Circular]"]);
    });

    it("should handle multiple levels of circular references", () => {
      const actualObject = { one: undefined, b: "b" };
      actualObject.c = { d: actualObject };
      actualObject.c.e = { f: actualObject.c };

      const expectedObject = { b: "b", another: undefined };
      expectedObject.c = { d: expectedObject };
      expectedObject.c.e = { f: expectedObject.c };

      expect(actualObject).to.deep.equal(expectedObject);
      expect(actualObject).to.deep.equal({
        b: "b",
        c: {
          d: "[Circular]",
          e: {
            f: "[Circular]",
          },
        },
      });
    });
  });
});
