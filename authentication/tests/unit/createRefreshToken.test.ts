import { ObjectId, WithId } from "mongodb";
import { UserSignupType } from "../../schemas/user.schema";
import { loginCookiesHelper } from "../../utils/setLoginCookies.utils";
import { jwtUtils } from "../../utils/jwt.utils";
import sinon from 'sinon';
import chai from 'chai'
const expect = chai.expect;
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
describe('create refresh token helper',function(){
    this.beforeEach(function(){
        sinon.reset();
        sinon.restore();
    })
  it('should create a refresh token that expires in one day',async function(){
    const clock = sinon.useFakeTimers();
    const refreshToken = await loginCookiesHelper.createRefreshToken(validUserWithId);
    expect(refreshToken).to.be.a.string;
    const payload:any = await jwtUtils.verifyJWT(refreshToken as string);
    expect(payload).to.have.property('exp');
    console.log(payload['exp'])
    expect(payload['exp']).to.be.equal(86400) //the returned format is in seconds

  })
})