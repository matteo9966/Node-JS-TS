import express from "express";
import { getAllJobs } from "../controllers/jobs";
import { createJob } from "../controllers/jobs/createJob.controller";
import { updateJob } from "../controllers/jobs/updateJob.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const router = express.Router();

router.route("/all").get(authenticationMiddleware, getAllJobs);
router
  .route("/")
  .post(authenticationMiddleware, createJob)
  .patch(authenticationMiddleware, updateJob);

export { router as jobsrouter };
