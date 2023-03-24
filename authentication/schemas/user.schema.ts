//this is the zod schema for a user:
import { z } from "zod";
import { safeParse, ErrorMessageOptions } from "zod-error";

//TODO add validation?

export type userRoles = "admin" | "manager" | "user";


//this is a temporary solution
export type UserSignupType = {
  name: string;
  email: string;
  password: string;
  role?: userRoles;
  verificationToken?: string;
  isVerified?:boolean;
  passwordTokenExpirationDate?:Date;
};
