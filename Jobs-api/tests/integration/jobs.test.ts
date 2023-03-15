import request from "supertest";
import chai from "chai";
import { app } from "../../server";
import supertest from "supertest";
const expect = chai.expect;

describe("/api/jobs/all", function () {
  let agent = supertest.agent(app);
  let user = {};
  let authorization = "";
  before(async function () {
    user = {
      name: "matteo",
      email: Math.random().toString(16).slice(2) + "@test.it",
      password: "Secret1",
    };

    await agent.post("/api/auth/signup").send(user);
    const response = await agent.post("/api/auth/login").send(user);
    authorization =
      response.headers["authorization"] ||
      response.headers["Authorization"] ||
      "";

    const token = authorization.split(' ')[1];
    agent.set('Authorization','bearer '+token);
    
  });


  it("should return status code 200 if user is authenticated", async function () {
    const response = await agent.get("/api/jobs/all");

    expect(response.status).to.equal(201);
  });
});
