import request from "supertest";
import chai from "chai";
import { app } from "../../server";
const expect = chai.expect;

describe("/api/auth/login", function () {
  describe("valid credentials", function () {
    let email = "";
    before(async function () {
      email = Math.random().toString(16).slice(2) + "@test.it";
      return request(app).post("/api/auth/signup").send({
        name: "matteo",
        email: email,
        password: "Secret1",
      });
    });
    it("should return status 200 if user logs in with valid credentials and have a authorization header", async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: "Secret1", email });

      const header =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        "";

      expect(header).to.include("bearer");
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("authenticated");
    });
  });
  describe("invalid", function () {
    
   
    it("user with invalid email should give me a bad request", async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: "Secret1", email:Math.random().toString(16).slice(2) + "@test.it" });
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property("error");
    });
  });

});
