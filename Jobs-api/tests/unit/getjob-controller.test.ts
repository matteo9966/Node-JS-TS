import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { CreatedJob, JobTypeInput } from "../../models/jobs.model";
import { Job } from "../../db/connect";
import e from "express";
import _ from "lodash";
import { updateJob } from "../../controllers/jobs/updateJob.controller";
import createHttpError, { HttpError } from "http-errors";
import { deleteJobController, getJobController } from "../../controllers/jobs";

describe("getjob controller", function () {
  let req = {} as e.Request;
  let res = {} as e.Response;
  let validJob = {
    company: "test company",
    createdBy: "test admin",
    position: "test position",
    id: "test-d",
    status: "declined",
    timestamp: "date now",
  } satisfies CreatedJob;

  beforeEach(function () {
    req = { body: {},params:{id:""} as e.Request['params'] } as e.Request;
    res = {
      status: sinon.spy() as e.Response["status"],
      json: sinon.spy() as e.Response["json"],
    } as e.Response;
    sinon.stub(Job, "update").resolves();
  });

  this.afterEach(function () {
    sinon.reset();
    sinon.restore();
  });

  it("should return a valid job if req has id param", async function () {
    req.params.id = "valid-id";
    sinon.stub(Job, "getOne").resolves({
      error: false,
      data: validJob,
    });

    await getJobController(req, res, _.noop);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ error: false, data: validJob })
    );
  });

  it("should return an error if no valid job id is provided", async function () {
    req.params.id = "invalid-id";
    sinon.stub(Job, "getOne").resolves({ error: true, message: "error" });

    await getJobController(req, res, _.noop);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ error: true, message: "error" })
    );
  });
});
