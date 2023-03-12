import express from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { loginController } from "../controllers/login.controller";
import { signupController } from "../controllers/signup.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const router = express.Router();

router.route("/signup").post(signupController);
router.route('/login').post(loginController);
router.route('/dashboard').get(authenticationMiddleware,dashboardController)
export { router };
