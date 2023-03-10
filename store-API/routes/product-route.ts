import express from 'express';
import {addProduct, getAllProducts, getAllProductsStatic} from '../controllers/product.controller'
const router = express.Router();
router.route('/').post(addProduct).get(getAllProductsStatic)
router.route('/all').get(getAllProducts)

export {router as productrouter}