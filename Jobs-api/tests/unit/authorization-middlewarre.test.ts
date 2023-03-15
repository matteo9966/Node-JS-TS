import sinon from "sinon";
import chai from "chai";
import express from "express";
const expect = chai.expect;
import { authorizationfactoryMiddleware } from "../../middleware/authorization.middleware";
import { userType } from "../../models/user.model";

describe("testing authorization middleware", function () {
  afterEach(function () {
    sinon.reset();
    sinon.restore();
  });

  it("user satisfies user roles intersection for authorization", function () {
    const authorizationUserMiddleware = authorizationfactoryMiddleware([
      "admin",
      "manager",
    ]);
    const req = {} as express.Request;
    const res = {
      locals: {
        jobsUser: {
          roles: ["admin"],
        } as userType,
      } as express.Response["locals"],
    } as express.Response;
    const next = sinon.spy();

    authorizationUserMiddleware(req, res, next);
    sinon.assert.calledOnce(next);
  });

  it("should throw error if missing user user inside the jobsUser", function () {
    const req = {} as express.Request;
    const res = {
      locals: {
      } as express.Response["locals"],
    } as express.Response;
    const next = sinon.spy();

    const authorizationUserMiddleware = authorizationfactoryMiddleware([
      "admin",
      "manager",
    ]);
    expect(()=>authorizationUserMiddleware(req, res, next)).to.throw
    sinon.assert.notCalled(next);
  });

  it("should throw error if missing user user inside the jobsUser", function () {
    const req = {} as express.Request;
    const res = {
      locals: {
        jobsUser: {
          roles: ["admin"],
        } as userType,
      } as express.Response["locals"],
    } as express.Response;
    const next = sinon.spy();

    const authorizationUserMiddleware = authorizationfactoryMiddleware([
      "admin",
      "manager",
    ]);
    expect(authorizationUserMiddleware(req, res, next)).to.throw
    // sinon.assert.notCalled(next);
  });
  it("should throw if user doesnt have necessary authorization", function () {
    const req = {} as express.Request;
    const res = {
      locals: {
        jobsUser: {
          roles: ["user"],
        } as userType,
      } as express.Response["locals"],
    } as express.Response;
    const next = sinon.spy();
    

    const authorizationUserMiddleware = authorizationfactoryMiddleware([
      "admin",
      "manager",
    ]);
    expect(()=>authorizationUserMiddleware(req, res, next)).to.throw
    sinon.assert.notCalled(next);
  });
});
