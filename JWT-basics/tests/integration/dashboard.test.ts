import chai from "chai";
import _ from "lodash";
import { app } from "../../app";
const expect = chai.expect;
import request from "supertest";

describe("/user/dashboard", function () {
  let token = "";
  before(function (done) {
    //get the token for the login
    request(app)
      .post("/user/login")
      .send({ username: "marateo1-", password: "Secret1" })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        token = res.headers["authorization"].split(" ")[1];
        return done();
      });
  });

  it("should return a valid user if in database", async function () {
    expect(token).to.not.be.undefined;
    expect(token).to.not.be.null;

    const response = await request(app)
      .get("/user/dashboard")
      .set("authorization", `bearer ${token}`);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("email");
    expect(response.body).to.have.property("id");
  });

  it("should return with status code 401 if no jwt token",async function(){
    const response = await request(app).get("/user/dashboard")
    expect(response.statusCode).to.be.equal(401)

  })
  it("should return with status code 401 if no jwt token",async function(){
    const response = await request(app).get("/user/dashboard")
    expect(response.statusCode).to.be.equal(401)

  })




});
