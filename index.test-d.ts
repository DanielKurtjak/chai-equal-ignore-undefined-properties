import * as chai from "chai";
import { expectType } from "tsd";

import ".";
import * as chaiEqualIgnoreUndefinedProperties from "./chai-equal-ignore-undefined-properties";

// @ts-ignore
chai.use(chaiEqualIgnoreUndefinedProperties);

// BDD API (expect)
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.eq({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.eql({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.eqls({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.equal({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.equals({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.deep.eq({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.deep.equal({ b: "b" }),
);
expectType<Chai.Assertion>(
  chai.expect({ a: undefined, b: "b" }).to.deep.equals({ b: "b" }),
);
