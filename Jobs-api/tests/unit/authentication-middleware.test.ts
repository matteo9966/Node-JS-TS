import sinon from "sinon";
import chai from "chai";
import express from "express";
const expect = chai.expect;
import { jwtFns } from "../../utils/jwtUtils";
import { authenticationMiddleware } from "../../middleware/authentication.middleware";
describe("authentication middleware", function () {
    afterEach(function () {
        sinon.restore();
        sinon.reset();
    })
  it("should work with a valid token", async function () {
    const request = {
      headers: {
        authorization: "bearer validtoken",
      },
    } as express.Request;

    const res = {locals:{}} as express.Response;
    const next = sinon.spy();
    const expected_payload = {payload:'ok'};
   const stub= sinon.stub(jwtFns,'verifyJWT').resolves(expected_payload);

    await authenticationMiddleware(request,res,next);
   sinon.assert.calledOnce(stub)
    sinon.assert.calledOnce(next);
    expect(res.locals).to.have.property('payload');
    expect(res.locals.payload).to.deep.equal(expected_payload)

  });
});
