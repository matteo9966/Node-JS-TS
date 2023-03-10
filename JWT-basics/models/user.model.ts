import { z } from "zod";
import { safeParse, ErrorMessageOptions } from "zod-error";

const errorOptions: ErrorMessageOptions = { prefix: "error: " };

const userSchema = z.object({
  password: z.string().min(6, { message: "password min length 6" }),
  username: z.string().min(6, { message: "password min length 6 char" }),
});

const signupUserSchema = userSchema.extend({
  fullname: z.string().min(4, { message: "fullname min length should be 4" }),
  email: z.string().email(),
  id: z.string().optional(),
});

export type UserSignupType = z.infer<typeof signupUserSchema>;
export type UserType = z.infer<typeof userSchema>;

export function parseSignup(user: UserSignupType) {
  const result = safeParse(signupUserSchema, user, errorOptions);
  if (!result.success) {
    return { error: true, errormessage: result.error.message };
  } else {
    return { error: false, data: result.data };
  }
}
