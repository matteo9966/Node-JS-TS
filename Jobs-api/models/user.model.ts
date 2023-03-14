import { z } from "zod";
import { hashPassword } from "../utils/hashPassword";
import { safeParseAsync } from "zod-error";
import { User  as UserModel} from "../db/connect";
const User = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .min(3)
    .max(30),
  email: z.string().email({ message: "please provide a valid email" }),
  password: z
    .string()
    .min(6, { message: "password min length: 6" })
    .max(30, { message: "password max length :30" })
    .transform(async (password) => await hashPassword(password)),
  id:z.string().optional()
})


const UserLogin = User.omit({name:true})


export type userType = z.infer<typeof User>;
export type userLoginType = z.infer<typeof UserLogin>;

export const userSignupValidator = async function (data: userType) {
  const result = await safeParseAsync(User, data, {});
  if (!result.success) {
    return { error: true, errormessage: result.error.message };
  } else {
    return { error: false, data: result.data };
  }
};

export const userLoginValidator = async function(data:userLoginType){
  const result = await safeParseAsync(UserLogin, data, {});
  if (!result.success) {
    return { error: true, errormessage: result.error.message };
  } else {
    return { error: false, data: result.data };
  }
}
