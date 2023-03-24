import e from "express";
import { loginController, registerController } from "../controllers/authentication";
const router = e.Router();

router.route('/signup').post(registerController)
router.route('/login').post(loginController)

export {router as authRouter}