import { Product } from "../db/connect";
import { validateProduct } from "../models/product.model";
import { asyncWrap } from "../utils/async-wrapper";
import { ZodError } from "zod";
import httperrors from "http-errors";
export const addProduct = asyncWrap(async (req, res, next) => {
  const product = req.body;
  try {
    const parsedProduct = validateProduct(product); //this can throw
    //ok
    await Product.insertOne(parsedProduct)
     res.json({inserted:true})
  } catch (error) {
    if (error instanceof Error) {
        console.log({errormesaage:error.message})
      throw httperrors.BadRequest(error.message);
    }
    throw error
  }
});
