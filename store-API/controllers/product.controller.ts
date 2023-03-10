import { Product } from "../db/connect";
import { validateProduct } from "../models/product.model";
import { asyncWrap } from "../utils/async-wrapper";
import { ZodError } from "zod";
import httperrors from "http-errors";
import { CustomZodError } from "../utils/custom-error";
import {
  getAllProductsQueryParser,
  getAllQueryType,
} from "../utils/getAllProducts-queryParser";
import express from "express";
import _, { orderBy } from "lodash";

export const addProduct = asyncWrap(async (req, res, next) => {
  const product = req.body;
  try {
    const parsedProduct = validateProduct(product); //this can throw
    console.log({parsedProduct})
    //ok
    await Product.insertOne(parsedProduct);
    res.json({ inserted: true });
  } catch (error) {
    if (error instanceof CustomZodError) {
      res.status(400);
      res.json({ error: error.message, inserted: false });
      return;
    }

    throw error;
  }
});

export const getAllProductsStatic = asyncWrap(async (req, res, next) => {
  let products = await Product.getAll();
  products = products.sort((p1, p2) => p1.price - p2.price);
  res.status(200).json({ products });
});

export const getAllProducts = asyncWrap(async (req, res, next) => {
  //ora questo products ha un querystring
  const query: express.Request["query"] = req.query; // in forma {id etc}
  //crea il filter function a partire dal query
  const parsedQuery = getAllProductsQueryParser(query);

  const filterObj = _.omit(parsedQuery, ["orderBy"]);
  let products = await Product.getAll();

  let filtered = _.filter(products, filterObj);
  if (parsedQuery.orderBy) {
    filtered = _.orderBy(filtered, parsedQuery.orderBy);
  }

  res.json(filtered);
});
