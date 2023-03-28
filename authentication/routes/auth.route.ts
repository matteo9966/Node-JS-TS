import e from "express";
import { loginController, registerController } from "../controllers/authentication";
import { logoutController } from "../controllers/authentication/logout.controller";
import { tokenController } from "../controllers/authentication/token.controller";
import { verifyEmailController } from "../controllers/authentication/verifyEmail.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
const router = e.Router();

router.route('/signup').post(registerController)
router.route('/login').post(loginController)
router.route('/logout').delete(authenticationMiddleware,logoutController)
router.route('/token').get(authenticationMiddleware,tokenController)
router.route('/verify').get(verifyEmailController);

export {router as authRouter}