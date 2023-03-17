import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { JobTypeInput } from "../../models/jobs.model";
import { Job } from "../../db/connect";
import e from "express";
import _ from "lodash";
import { updateJob } from "../../controllers/jobs/updateJob.controller";
import createHttpError, { HttpError } from "http-errors";
import { deleteJobController } from "../../controllers/jobs";

describe("deletejob controller", function () {
  let req = {} as e.Request;
  let res = {} as e.Response;

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
  it("should delete a job if id is provided", async function () {
    req.params.id="id";

    sinon.stub(Job, "deleteOne").resolves({ deleted: true });
    await deleteJobController(req, res, _.noop);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ deleted: true, error: false })
    );
  });

  it("should return error message if wrong id provided ", async function () {
    sinon
      .stub(Job, "deleteOne")
      .resolves({ deleted: false, message: "wrong id" });
    req.params.id = "invalid";
    await deleteJobController(req, res, _.noop);
    sinon.assert.calledWith(
      <sinon.SinonSpy>res.json,
      sinon.match({ deleted: false, error: true, message: "wrong id" })
    );
  });



});
