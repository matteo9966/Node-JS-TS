import sinon from "sinon";
import chai from "chai";
import express from "express";
const expect = chai.expect;
import { createJobController } from "../../controllers/jobs/createJob.controller";
import { CreatedJob, jobValidators } from "../../models/jobs.model";
import { Job } from "../../db/connect";
import e from "express";
import _ from "lodash";

describe("create job controller", function () {
  it("should create a valid job I insert a job", async function () {
    const req = { body: {} } as e.Request;
    const res = {
      status: sinon.spy() as e.Response["status"],
      json: sinon.spy() as e.Response["json"],
    } as e.Response;
    const validCompany: CreatedJob = {
      company: "company-test",
      createdBy: "test user",
      position: "manager",
      status: "interview",
      timestamp: new Date().toISOString(),
      id: "id-test1",
    };

    sinon.stub(jobValidators, "validateInsertJob").returns({
      error: false,
      data: validCompany,
    });
    sinon.stub(Job, "insertOne").resolves();

    await createJobController(req, res, _.noop);
    sinon.assert.calledWith(<sinon.SinonSpy>res.status, 200);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ error: false, inserted: true })
    );
  });
});
