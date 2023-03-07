import express from 'express';
import { createTask } from '../controllers/tasks';
const taskRouter = express.Router();

taskRouter.route('/').post(createTask);


export {taskRouter}