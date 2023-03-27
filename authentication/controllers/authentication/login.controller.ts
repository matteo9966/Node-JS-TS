import e from "express";
import { APIResponse } from "../../interfaces/response.interface";
import { userModel } from "../../mongodb/models/User.model";
import httpError from "http-errors";
import { passwordUtils } from "../../utils/password.utils";
import { UserSignupType } from "../../schemas/user.schema";
import { setLoginCookies } from "../../utils/setLoginCookies.utils";
import setCookie from "set-cookie-parser";
import { TokenSchema } from "../../schemas/token.schema";
import { tokenModel } from "../../mongodb/models/Token.model";
export const loginController: e.RequestHandler = async function (
  req,
  res,
  next
) {
  const responsebody: APIResponse<any> = {
    error: false,
  };
  const { email, password } = req.body;
  if (!email || !password) {
    const errorMessage = `wrong format missing ${email ? "email" : ""}${
      password ? ", password" : ""
    }`;
    responsebody.message = errorMessage;
    responsebody.error = true;
    res.status(400).json(responsebody);
    return;
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw httpError.Unauthorized("wrong email or password");
    }

    const passwordValid = await passwordUtils.verifyPassord(
      user.password,
      password
    );

    if (!passwordValid) {
      throw httpError.Unauthorized("wrong email or password");
    }

    if (!user?.isVerified) {
      //todo add email verification
    }

    const settedCookies = await setLoginCookies(res, user); //this add the cookies
  
    if (!settedCookies) {
      throw new httpError.InternalServerError(
        "internal server error while authenticating user"
      );
    }


    const cookieHaders = (res.getHeader("Set-Cookie") as string[]) || [];
    const parsedCookies = setCookie.parse(cookieHaders);
    //check for the cookies;

    try {
      const userAgent = req.headers["user-agent"] || "";
      const ip = req.ip || "";
      const isValid = true;
      const refreshToken =
        parsedCookies.find((cook) => cook.name === "refreshtoken")?.value || "";
      const userID = user._id;

      const dbToken: Omit<TokenSchema,'user'> = {
        userAgent,
        ip,
        isValid,
        refreshToken,
      };

      await tokenModel.updateOne({ user: userID },{$set:dbToken}, { upsert: true });

    } catch (error) {
      console.dir(error);
      throw new httpError.InternalServerError(
        "internal server error while authenticating user"
      );
    }

  

    responsebody.data = user;
    res.status(200).json(responsebody);
  } catch (error) {
    responsebody.error = true;
    console.dir(error);
    if (error instanceof httpError.HttpError) {
      responsebody.message = error.message;
      res.status(error.status);
      res.json(responsebody);
    } else {
      responsebody.message = "server error retry later";
      res.status(500);
      res.json(responsebody);
    }
  }

  //find user by email

  //validate passowrd

  //check if user is verified

  //create a user jwt token

  // a database for tokens=???
};
