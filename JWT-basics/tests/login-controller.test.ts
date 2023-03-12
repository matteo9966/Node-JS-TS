import { signupController } from "../controllers/signup.controller";
import sinon from "sinon";
import chai from "chai";
import express from "express";
import { UserType } from "../models/user.model";
import { User } from "../db/connect";
import argon2 from "argon2";
import _ from "lodash";
import {jwtFns} from '../utils/createJWT';
import {  loginController } from "../controllers/login.controller";
const expect = chai.expect;

const validUser: UserType = {
  password: "Secret1111",
  username: "marato0",
};

describe("login controller", function () {
  let req = {} as express.Request,
    res = {} as express.Response;

  beforeEach(function () {
    req = {} as express.Request;
    res = {
      json: sinon.stub() as express.Response["json"],
      status: sinon.stub() as express.Response["status"],
      setHeader: sinon.stub() as express.Response["setHeader"],
    } as express.Response;
  });

  afterEach(function () {
    sinon.restore();
    sinon.reset();
  });

  it("should login if user exists in db ", async function () {
    sinon.stub(User, "find").resolves({ password: "digest-of-password" });
    sinon.stub(argon2, "verify").resolves(true);
    sinon.stub(jwtFns, "createJWT").resolves("token");
    req.body = validUser; //user valido

    await loginController(req, res, () => {});
    sinon.assert.calledWith(
      <sinon.SinonStub>res.json,
      sinon.match({ loggedIn: true })
    );
  });
});


describe('argon2 tests',function(){
  const password = "ThisIsASecret!1234"
  
  it('should return truthy if password corresponds to hashed password',async function () {
    const hash = await argon2.hash(password) //this is the hash stored in the db

    const result = await argon2.verify(hash,password) 
    chai.expect(result).to.be.true
  })


})