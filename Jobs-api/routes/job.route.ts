import express from 'express';
import { getAllJobs } from '../controllers/jobs';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
const router = express.Router();


router.route('/all').get(authenticationMiddleware,getAllJobs);

export {router as jobsrouter}