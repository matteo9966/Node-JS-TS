import express from "express";
import {
  createJobController,
  deleteJobController,
  getAllJobs,
  getJobController,
  updateJob,
} from "../controllers/jobs";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const router = express.Router();

router.route("/all").get(authenticationMiddleware, getAllJobs);
router
  .route("/")
  .post(authenticationMiddleware, createJobController)
  .patch(authenticationMiddleware, updateJob);
router
  .route("/:id")
  .get(authenticationMiddleware, getJobController)
  .delete(authenticationMiddleware, deleteJobController);

export { router as jobsrouter };
