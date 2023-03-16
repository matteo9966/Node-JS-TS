import { z } from "zod";
import { safeParse } from "zod-error";

const Job = z
  .object({
    company: z
      .string({ required_error: "company name is required please provide" })
      .max(50),
    position: z.string({ required_error: "please provide company position" }),
    status: z.enum(["interview", "declined", "pending"]).default("pending"),
    createdBy: z.string(),
    id: z.string().optional(),
  })
  .transform((ob) => ({ ...ob, timestamp: new Date().toISOString() }));

export type JobTypeInput = z.input<typeof Job>;
export type CreatedJob = z.output<typeof Job>;

export const validateInsertJob = function (data: JobTypeInput) {
  const result = safeParse(Job, data, {});
  if (!result.success) {
    return { error: true, errormessage: result.error.message };
  } else {
    return { error: false, data: result.data as CreatedJob };
  }
};

export const updatableProps: (keyof Omit<CreatedJob,'timestamp'>)[] = [
  "company",
  "createdBy",
  "status",
  "position",
  "id"
];

export const jobValidators = {validateInsertJob}
