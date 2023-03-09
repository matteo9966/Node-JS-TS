import express from 'express';
import {addProduct} from '../controllers/product.controller'
const router = express.Router();
router.route('/').post(addProduct)

export {router as productrouter}