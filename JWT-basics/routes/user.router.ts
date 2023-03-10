import express from "express";
import { loginController } from "../controllers/login.controller";
import { signupController } from "../controllers/signup.controller";
const router = express.Router();

router.route("/signup").post(signupController);
router.route('/login').post(loginController);
export { router };
