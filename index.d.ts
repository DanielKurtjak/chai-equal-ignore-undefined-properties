/// <reference types="@types/chai" />
declare module "chai-equal-ignore-undefined-properties" {
  export default function chaiEqualIgnoreUndefinedProps(
    chai: Chai.ChaiStatic,
    utils: Chai.ChaiUtils,
  ): void;
}
