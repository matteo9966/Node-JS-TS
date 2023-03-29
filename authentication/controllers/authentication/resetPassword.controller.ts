import e from "express";
import createHttpError from "http-errors";
import { APIResponse } from "../../interfaces/response.interface";
import { passwordTokeModel } from "../../mongodb/models/PasswordToken.model";
import { userModel } from "../../mongodb/models/User.model";
import { passwordUtils } from "../../utils/password.utils";
import path from 'path';
export const resetPasswordController: {
  (...args: Parameters<e.RequestHandler>): Promise<void>;
} = async function (req, res, next) {
  const responsebody: APIResponse<any> = { error: false };
  const { email, token } = req.query;
  const { password } = req.body; // the new password;
  try {
    if (!email || !token || !password) {
      throw createHttpError.BadRequest(
        "missing email and token in queryparams, or no new passowrd inserted"
      );
    }

    //find a user
    const user = await userModel.findOne({ email });
    if (!user) {
      throw createHttpError.BadRequest("invalid email");
    }

    //found the user, now i can look by user _id and token

    const foundToken = await passwordTokeModel.findOne({
      user: user._id,
      token,
    });

    if (!foundToken) {
      throw createHttpError.BadRequest("your password reset token is expired");
    }

    //i found the token so now i can reset the passwrod

    const hashedPassword = await passwordUtils.hashPassword(password);

    if (!hashedPassword) {
      throw new Error("error while hashing the password");
    }

    const result = await userModel.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    if (!result.modifiedCount) {
      throw new Error("error while updating the password");
    }

    //everithing ok

    res.status(200);
    responsebody.data = result;
    res.json(responsebody);
  } catch (error) {
    responsebody.error = true;
    if (error instanceof createHttpError.HttpError) {
      responsebody.message = error.message;
      responsebody.statusCode = error.status;
      res.status(error.status);
    } else if (error instanceof Error) {
      responsebody.message = error.message;
      res.status(500);
    } else {
      responsebody.message = "internal server error";
      res.status(500);
    }
    res.json(responsebody);
  }
};

export const resetPasswordFormController: {
  (...args: Parameters<e.RequestHandler>): Promise<void>;
} = async function (req, res, next) {
    
    //now i have to send the token with the form, but how?
    res.sendFile(path.join(__dirname,'../../forms/reset-password.html'));

  //send a form that posts a request with the new email and password
};
