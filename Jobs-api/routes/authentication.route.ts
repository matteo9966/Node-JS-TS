import express from 'express';
import { loginController } from '../controllers/authentication/login.controller';
import { signupController } from '../controllers/authentication/signup.controller';

const router = express.Router();

router.route('/signup').post(signupController);
router.route('/login').post(loginController);

export {router as authenticationRouter};