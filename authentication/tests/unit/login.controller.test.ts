import e from "express";
import sinon from "sinon";
import { userModel } from "../../mongodb/models/User.model";
import { UserSignupType } from "../../schemas/user.schema";
import { ObjectId, WithId } from "mongodb";
import { passwordUtils } from "../../utils/password.utils";
import setCookie from "set-cookie-parser";
import { tokenModel } from "../../mongodb/models/Token.model";
import { loginController } from "../../controllers/authentication";
import _ from "lodash";
import { loginCookiesHelper } from "../../utils/setLoginCookies.utils";
const validUser: UserSignupType = {
  email: "valid@email",
  name: "validname",
  password: "validpassword",
  isVerified: false,
  passwordTokenExpirationDate: new Date(),
  role: "admin",
  verificationToken: "the verification token",
};

const validUserWithId: WithId<UserSignupType> = {
  ...validUser,
  _id: new ObjectId(),
};

describe("login controller", function () {
    this.beforeEach(function(){
        sinon.reset();
        sinon.restore();
    })
  it("should call json with a predefinded object format (all controllers)", async function () {
   
    const json = sinon.stub();
    const status = sinon.stub().returns({ json });
    const getHeader = sinon.stub().returns(["cookies;cookies"]);

    const response = {
      status: status as e.Response["status"],
      json: json as e.Response["json"],
      getHeader: getHeader as e.Response["getHeader"],
    } as e.Response;

    const request = {
      body: {
        email: "valid@email",
        password: "valid@password",
        headers:{}

      } as e.Request["body"],
    } as e.Request;

    sinon.stub(userModel, "findOne").resolves(validUserWithId);
    sinon.stub(passwordUtils, "verifyPassord").resolves(true);
    sinon
      .stub(setCookie, "parse")
      .returns([{ name: "refreshtoken", value: "ref--token" }]);
    sinon.stub(loginCookiesHelper,'setLoginCookies').resolves(true);

    const updateoneStub = sinon.stub(tokenModel, "updateOne").resolves();

    await loginController(request, response, _.noop);
    sinon.assert.calledWith(
      json,
      sinon.match({ error: false, data: validUserWithId })
    );
  });
  
});



