import e from "express";
import createHttpError from "http-errors";
import { APIResponse } from "../../interfaces/response.interface";
import { passwordTokeModel } from "../../mongodb/models/PasswordToken.model";
import { userModel } from "../../mongodb/models/User.model";
import { sendResetPasswordEmail } from "../../utils/sendResetPasswordEmail.utils";

export const forgotPassowrdController: {
  (...args: Parameters<e.RequestHandler>): Promise<void>;
} = async function (req, res, next) {
  //i just need the email
  const { email } = req.body;
  const responsebody: APIResponse<any> = { error: false };
  try {
    if (!email) {
      throw createHttpError.BadRequest("missing email");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw createHttpError.BadRequest("invalid email");
    }

    const resetToken = Math.random().toString(16).slice(2); //the reset token
    const result = await passwordTokeModel.insertOne({
      token: resetToken,
      tokenExpiration: new Date(), //token has a ttl of 10 minutes
      user: user._id,
    });

    if (result.insertedId) {
      //i can send the token to the user
      //send email
      sendResetPasswordEmail({ to: email }, resetToken); //dont send
      responsebody.data = { sentToken: true };
      responsebody.statusCode = 200;
      res.status(200);
      res.send(responsebody);
    } else {
      throw createHttpError.InternalServerError(
        "error while trying to create reset token"
      );
    }

    //if i found the user, send a resetPassword email with user
  } catch (error) {
    responsebody.error = true;
    if (error instanceof createHttpError.HttpError) {
        res.status(error.status);
        responsebody.message = error.message;
        responsebody.statusCode = error.status;
    } else {
        res.status(500);
        responsebody.message = "internal server error";
      responsebody.statusCode = 500;
    }
    res.json(responsebody);
  }
};
