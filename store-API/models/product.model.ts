import { z } from "zod";
import { safeParse, ErrorMessageOptions } from "zod-error";
import { CustomError } from "../utils/custom-error";

const errorparseoptions: ErrorMessageOptions = {
  prefix: `Time: ${new Date().toISOString()}`,
};

const companies = z.enum(["ikea", "liddy", "caressa", "marcos"], {});

const productSchema = z.object({
  name: z.string().nonempty("product name must be provided"),
  price: z
    .number()
    .nonnegative({ message: "price should be greater than 0" })
    .refine((data) => !!data, { message: "price is required" }),
  featured: z.boolean().default(false).optional(),
  rating: z
    .number()
    .min(0, { message: "min should be 0" })
    .max(5, { message: "max should be 10" })
    .default(4.5).optional(),
  createdAt: z.date().default(new Date()).optional(),
  company: companies,
  id: z.string().default(Math.random().toString(16).slice(2)).optional(),
});

export type ProductType = z.infer<typeof productSchema>;

/**
 * @description this function throws if the product is not valid
 * @param product
 * @returns
 */
export function validateProduct(product: ProductType) {
  const result = safeParse(productSchema, product, errorparseoptions); //should add the id to the product
  if (!result.success) {
    const message = result.error.message;
    // console.error(message);
    throw new CustomError(message);
  } else {
    return result.data;
  }
}
