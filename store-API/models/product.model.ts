import { z } from "zod";
import { safeParse, ErrorMessageOptions } from "zod-error";
import {  CustomZodError } from "../utils/custom-error";

const errorparseoptions: ErrorMessageOptions = {
  prefix: `Time: ${new Date().toISOString()}`,
};

const companies = z.enum(["ikea", "liddy", "caressa", "marcos"]);

const productSchema = z.object({
  name: z.string().nonempty("product name must be provided"),
  price: z
    .number()
    .nonnegative({ message: "price should be greater than 0" })
    .refine((data) => !!data, { message: "price is required" }),
  featured: z.boolean().optional(),
  rating: z
    .number()
    .min(0, { message: "min should be 0" })
    .max(5, { message: "max should be 10" })
    .optional(),
  createdAt: z.date().optional(),
  company: companies,
  id: z.string().optional(),
}).transform(obj=>({
  ...obj,
     createdAt:obj.createdAt || new Date(),
     id:obj.id || Math.random().toString(16).slice(2),
     rating: obj.rating || 4.5,
     featured:obj.featured || false,

}));

export type ProductType = z.infer<typeof productSchema>;

/**
 * @description this function throws if the product is not valid
 * @param product
 * @returns
 */
export function validateProduct(product: ProductType):ProductType {
  const result = safeParse(productSchema, product, errorparseoptions); //should add the id to the product
  if (!result.success) {
    const message = result.error.message;
    // console.error(message);
    throw new CustomZodError(message);
  } else {
    return productSchema.parse(product);
  }
}
