import { Router } from "express";
import { uploadFileFormController } from "../controllers/upload.controller";
const router = Router();

router.route('').post(uploadFileFormController)

export {router as uploadRouter}