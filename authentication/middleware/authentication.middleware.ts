import e from "express";
import createHttpError from "http-errors";
import { WithId } from "mongodb";
import { APIResponse } from "../interfaces/response.interface";
import { tokenModel } from "../mongodb/models/Token.model";
import { UserSignupType } from "../schemas/user.schema";
import { jwtUtils } from "../utils/jwt.utils";

//check te headers, if i have an expired sessiontoken check the refresh token
export const authenticationMiddleware: e.RequestHandler = async function (
  req,
  res,
  next
) {
  //get the cookies
  const responsebody: APIResponse<any> = {
    error: false,
  };

  const { sessiontoken, refreshtoken } = req.cookies;
  //chek if session token is valid

  try {
    await jwtUtils.verifyJWT(sessiontoken);
    return next(); //end here and go ahead
  } catch (error) {
    //unset the token
    res.cookie('sessiontoken','',{expires:new Date(),httpOnly:true})
    console.log(error);
  }

  //lets do the same with the refresh token:
  try {
    const refreshtokenPayload = (await jwtUtils.verifyJWT(
      refreshtoken
    )) as WithId<UserSignupType>;
    //lets verify that the refresh token is still valid:
    const dbRefreshToken = await tokenModel.findOne({
      refreshToken: refreshtoken,
      user: refreshtokenPayload._id,
    });

    if(!dbRefreshToken || !dbRefreshToken?.isValid){
        //dont go forward
        throw new createHttpError.Unauthorized('invalid authentication')
    }

    res.cookie("refreshtoken",refreshtoken,{
        httpOnly: true,
        secure: false, 
        signed: false, 
        // expires: new Date(Date.now() + sessioncookieEXP),
        // expires: new Date(Date.now()), //todo: the refresh token is expired todo:  this date must be the same as the exp date of the token
      });

    next();

  } catch (error) {
    console.log(error);
    responsebody.error=true;
    if(error instanceof createHttpError.HttpError){
      responsebody.message = error.message;
      responsebody.statusCode= error.status;
      res.status(error.statusCode);
    }else{
      responsebody.message='internal server error'
      responsebody.statusCode=500;
      res.status(500)
    }
    res.json(responsebody)
  }

};
