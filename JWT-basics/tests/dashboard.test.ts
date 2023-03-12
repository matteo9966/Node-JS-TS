import { signupController } from "../controllers/signup.controller";
import sinon from "sinon";
import chai from "chai";
import express from "express";
import _ from "lodash";
import { dashboardController } from "../controllers/dashboard.controller";
const noop = _.noop;
const expect = chai.expect;

describe(" dashboard.controller", function () {
  it(" it should call res.json with the user stored in res.locals", async function () {
    const expecteduser = { name: "matt", nickname: "marat", email: "roosvelt" };
    const res = {
      locals: { user: expecteduser } as express.Response["locals"],
      json:sinon.spy() as express.Response['json'],
      status:sinon.spy() as express.Response['status'],
    } as express.Response;

    await dashboardController({} as express.Request,res,noop);
    const jsonRes = res.json as sinon.SinonSpy
     sinon.assert.calledWith(jsonRes,expecteduser);
    expect(jsonRes.calledOnce).to.be.true

  });
});
