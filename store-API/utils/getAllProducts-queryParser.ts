import { z } from "zod";
import express from 'express'


const boolean = z
  .string()
  .or(z.boolean())
  .transform((val) => {
    return typeof val === "boolean" ? val : val === "true" ? true : false;
  });

const getAllProducts = z.object({
  featured: boolean.optional(),
  company: z.string().optional(),
  name: z.string().optional(),
  orderBy: z.enum(["price", "rating"]).catch("price").optional(),
  price:z.string().transform(p=>Number(p)).optional()
});

export const getAllProductsQueryParser = (
  query: express.Request['query']
) => {
  const parsed = getAllProducts.safeParse(query);
  if (parsed.success) {
    return parsed.data;
  } else {
    return {};
  }
};

export type getAllQueryType = z.infer<typeof getAllProducts>

// export const productsParser = customParseSafe(getAllProducts);
