import request from "supertest";
import chai from "chai";
import { app } from "../../server";
import supertest from "supertest";
import { CreatedJob, JobTypeInput } from "../../models/jobs.model";
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

    const token = authorization.split(" ")[1];
    agent.set("Authorization", "bearer " + token);
  });

  it("should return status code 200 if user is authenticated", async function () {
    const response = await agent.get("/api/jobs/all");

    expect(response.status).to.equal(201);
  });
});

describe("/api/jobs/", function () {
  describe("POST /api/jobs/", function () {
    let agent = supertest.agent(app);
    let user = {};
    let authorization = "";
    before(async function () {
      user = {
        name: "matteo",
        email: Math.random().toString(16).slice(2) + "@test.it",
        password: "Secret1",
        roles: ["admin"],
      };

      await agent.post("/api/auth/signup").send(user);
      const response = await agent.post("/api/auth/login").send(user);
      authorization =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        "";

      const token = authorization.split(" ")[1];
      agent.set("Authorization", "bearer " + token);
    });
    it("should insert a valid job in the database if job is correct", async function () {
      const validJob: JobTypeInput = {
        company: "company-test-inserted",
        createdBy: "test user",
        position: "manager",
        status: "interview",
      };

      const response = await agent.post("/api/jobs/").send(validJob);
      expect(response.body).to.have.property("inserted");
      expect(response.body.inserted).to.be.true;
    });

    it("should update a job that i create with a new value", async function () {});
  });
  describe("PATCH /api/jobs/", function () {
    let agent = supertest.agent(app);
    let user = {};
    let authorization = "";

    const validUpdate: Partial<JobTypeInput> = {
      company: "company-test-inserted-UPATE",
    };
    const validJob: JobTypeInput = {
      company: "company-test-inserted",
      createdBy: "test user",
      position: "manager",
      status: "interview",
      id: `${Math.random().toString(16).slice(2)}`,
    };

    before(async function () {
      user = {
        name: "matteo",
        email: Math.random().toString(16).slice(2) + "@test.it",
        password: "Secret1",
        roles: ["admin"],
      };

      await agent.post("/api/auth/signup").send(user);
      const response = await agent.post("/api/auth/login").send(user);
      authorization =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        "";

      const token = authorization.split(" ")[1];
      agent.set("Authorization", "bearer " + token);
      await agent.post("/api/jobs/").send(validJob);
    });

    it("should update a job that i create with a new value", async function () {
      validUpdate.id = validJob.id;
      const response = await agent.patch("/api/jobs/").send(validUpdate);

      expect(response.body).to.deep.equal({ updated: true, updateCount: 1 });
    });
  });
});
