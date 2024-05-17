/* eslint-env mocha */

const { use, expect } = require("chai");

const chaiEqualIgnoreUndefinedProps = require("./chai-equal-ignore-undefined-properties");

use(chaiEqualIgnoreUndefinedProps);

describe("chai-equal-ignore-undefined-props", () => {
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

    it("should handle circular dependencies on a top level properties", () => {
      const actualObject = { a: undefined, b: "b" };
      actualObject.c = actualObject;

      const expectedObject = { b: "b", c: undefined };
      expectedObject.c = expectedObject;

      expect(actualObject).to.deep.equal(expectedObject);
    });

    it("should handle circular dependencies with nested objects", () => {
      const actualObject = { a: { b: undefined, c: "c" } };
      actualObject.a.d = actualObject;

      const expectedObject = { a: { c: "c", d: undefined } };
      expectedObject.a.d = expectedObject;

      expect(actualObject).to.deep.equal(expectedObject);
    });

    it("should handle circular dependencies with arrays", () => {
      const actualArray = [undefined, "b"];
      actualArray.push(actualArray);

      const expectedArray = [undefined, "b"];
      expectedArray.push(expectedArray);

      expect(actualArray).to.deep.equal(expectedArray);
    });

    it("should handle circular dependencies with mixed objects and arrays", () => {
      const actualMixed = [{ a: undefined, b: "b" }, ["c"]];
      actualMixed.push(actualMixed);

      const expectedMixed = [{ b: "b" }, ["c"]];
      expectedMixed.push(expectedMixed);

      expect(actualMixed).to.deep.equal(expectedMixed);
    });

    it("should handle multiple levels of circular dependencies", () => {
      const actualObject = { one: undefined, b: "b" };
      actualObject.c = { d: actualObject };
      actualObject.c.e = { f: actualObject.c };

      const expectedObject = { b: "b", another: undefined };
      expectedObject.c = { d: expectedObject };
      expectedObject.c.e = { f: expectedObject.c };

      expect(actualObject).to.deep.equal(expectedObject);
    });
  });
});
