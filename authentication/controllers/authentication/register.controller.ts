import e from "express";
import { APIResponse } from "../../interfaces/response.interface";

export const registerController: e.RequestHandler = async function (
  req,
  res,
  next
) {
  //email name password from body
  const responsebody: APIResponse<any> = {
    error: false,
  };
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    //throw error and catch it somewhere
    const errorMessage = `missing ${!email ? "email" : ""}${
      !name ? ", name" : ""
    }${!password ? ", password" : ""}`;
    (responsebody.error = true), (responsebody.message = errorMessage);
    return res.json(responsebody);
  }

   

  //check if unique

  //is first account then is admin

  //create an email verification token

  //create a user with zod: it must have: name , email password , role ,verification token

  //send the email with verification token

  //send verified
};
