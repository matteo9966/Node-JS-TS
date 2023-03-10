import { signupController } from "../controllers/signup.controller";
import sinon from "sinon";
import chai from "chai";
import express from "express";
import { UserSignupType } from "../models/user.model";
import { User } from "../db/connect";
import { hashPassword } from "../utils/hashPassword";
import _ from "lodash";
const expect = chai.expect;

const validUser: UserSignupType = {
  email: "m@t.it",
  fullname: "marate tom",
  password: "Secret1111",
  username: "marato0",
};

describe("signup controller", function () {
  let req = {} as express.Request,
    res = {} as express.Response;

  beforeEach(function () {
    req = {} as express.Request;
    res = {
      json: sinon.stub() as express.Response["json"],
      status: sinon.stub() as express.Response["status"],
    } as express.Response;
  });

  afterEach(function () {
    sinon.restore();
    sinon.reset();
  });

  it("should create a user if i pass right body", async function () {
    sinon.stub(User, "insertOne").resolves();
    sinon.stub(User, "find").resolves(null);
    req.body = validUser;
    const expectedUser = { ...validUser };
    await signupController(req, res, () => {});
    sinon.assert.calledWith(
      <sinon.SinonStub>User.insertOne,
      sinon.match(_.omit(expectedUser, "password"))
    );
    sinon.assert.calledWith(<sinon.SinonStub>res.json, { inserted: true });
  });
  it("should return bad request if user already exists in a db", async function () {
    sinon.stub(User, "insertOne").resolves();
    sinon.stub(User, "find").resolves(true);
    req.body = validUser;

    await signupController(req, res, () => {});
    sinon.assert.calledWith(<sinon.SinonStub>res.status, 409);
    sinon.assert.calledWith(
      <sinon.SinonStub>res.json,
      sinon.match({ inserted: false })
    );
  });
});
