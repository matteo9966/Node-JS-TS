import e from "express";
import { loginController, registerController } from "../controllers/authentication";
import { forgotPassowrdController } from "../controllers/authentication/forgotPassword.controller";
import { logoutController } from "../controllers/authentication/logout.controller";
import { resetPasswordController, resetPasswordFormController } from "../controllers/authentication/resetPassword.controller";
import { tokenController } from "../controllers/authentication/token.controller";
import { verifyEmailController } from "../controllers/authentication/verifyEmail.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const router = e.Router();

router.route('/signup').post(registerController)
router.route('/login').post(loginController)
router.route('/logout').delete(authenticationMiddleware,logoutController)
router.route('/token').get(authenticationMiddleware,tokenController)
router.route('/verify').get(verifyEmailController);
router.route('/forgot-password').post(forgotPassowrdController)
router.route('/reset-password').get(resetPasswordFormController).post(resetPasswordController)

export {router as authRouter}