import express from "express";
import { signupController } from "../controllers/signup.controller";
const router = express.Router();

router.route("/signup").post(signupController);

export { router };
