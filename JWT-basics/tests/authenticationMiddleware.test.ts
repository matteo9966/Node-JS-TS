import sinon from "sinon";
import chai from "chai";
import express from "express";
import { jwtFns } from "../utils/createJWT";
import _ from "lodash";
import httperrors from "http-errors";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const noop = _.noop;
const expect = chai.expect;

describe("authentication controller", function () {
  let req = {} as express.Request;
  let res = { locals: {} } as express.Response;

  beforeEach(function () {
    req = {
      headers: {
        authorization: "bearer validtoken",
      },
    } as express.Request;
  });
  afterEach(function () {
    sinon.restore();
    sinon.reset();
  });

  it("should add a user object to res.locals if jwt is valid", function (done) {
    const expected = { payload: "valid payload" };
    sinon.stub(jwtFns, "verifyJWT").resolves(expected);

    const nextfunction = function (err: any) {
      expect(res.locals.user).to.equal(expected);
      done();
    };
    authenticationMiddleware(req, res, nextfunction);
  });

  // it('should throw 401 error if jwt token is missing',function(done){
  //     const req = { headers: {} } as express.Request;
  //     // const nextFunction = function(err:any){
  //     //     done();
  //     // }
  //     function nextfn(err:any){
  //         done();
  //     }

  //     expect(function(){authenticationMiddleware(req,res,nextfn)}).to.throw() //doesnt work

  // })

  it("should throw 401 error if jwt token is missing", function (done) {
    const req = { headers: {} };
    const res = {};

    expect(function () {
      authenticationMiddleware(req as any, res as any, noop);
    }).throws(httperrors.Unauthorized)

    done();
  });

  it('should call next function with error if jwt token is invalid',function(done){
    const req = {headers:{authorization:'invalid token'}} as express.Request;

    const nextfn = function(err:any){
        expect(err).to.not.be.undefined
        done();
    }

    const error = {'error':true}
    sinon.stub(jwtFns,'verifyJWT').rejects(error)
    
    authenticationMiddleware(req,res,nextfn);

    
}) 
});
