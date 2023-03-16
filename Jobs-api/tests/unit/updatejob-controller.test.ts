import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { JobTypeInput } from "../../models/jobs.model";
import { Job } from "../../db/connect";
import e from "express";
import _ from "lodash";
import { updateJob } from "../../controllers/jobs/updateJob.controller";
import createHttpError, { HttpError } from "http-errors";
chai.use(chaiAsPromised);
const expect = chai.expect;
describe("updatejob controller", function () {
  let req: e.Request, res: e.Response;

  beforeEach(function () {
    req = { body: {} } as e.Request;
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

  it("should update an existing job", async function () {
    const validJob: Partial<JobTypeInput> = {
      id: "jobid",
      company: "ikea",
    };

    const req = { body: validJob } as e.Request;
    await updateJob(req, res, _.noop);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ updated: true, updateCount: 1 })
    );
  });

  it("should throw if i pass an object without an id", async function () {
    const invalid: Partial<JobTypeInput> = {
      company: "ikea",
    };

    const req = { body: invalid } as e.Request;
    try {
      await updateJob(req, res, _.noop);
    } catch (error) {
      expect(error).to.be.instanceOf(createHttpError.BadRequest);
      expect((<HttpError>error).message).to.equal("job is missing id property");
    }
  });
});
