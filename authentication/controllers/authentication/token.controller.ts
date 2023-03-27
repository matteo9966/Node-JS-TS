//this is only for testing,
//this route is accessible only with authentication

import e from "express";
import { WithId } from "mongodb";
import { APIResponse } from "../../interfaces/response.interface";
import { UserSignupType } from "../../schemas/user.schema";
import { jwtUtils } from "../../utils/jwt.utils";

export const tokenController: e.RequestHandler = async (req, res, next) => {
  //get the cookies in the request
  const { sessiontoken, refreshtoken } = req.cookies;
  console.log(req.cookies)
  console.log(req.signedCookies)
  //parse both the cookies
  const responsebody: APIResponse<{
    sessiontoken: Record<any, any>;
    refreshtoken: Record<any, any>;
    invalidsessionToken: boolean;
    invalidrefreshtoken: boolean;
  }> = {
    error: false,
    data: {
      refreshtoken: {},
      sessiontoken: {},
      invalidrefreshtoken: false,
      invalidsessionToken: false,
    },
  };
  let invalidsessiontoken = false;
  let invalidrefreshtoken = false;

  try {
    const sesstok = (await jwtUtils.verifyJWT(
      sessiontoken
    )) as WithId<UserSignupType>;
    responsebody.data!.sessiontoken = sesstok;
  } catch (error) {
    invalidsessiontoken = true;
  }

  
  try {
    const reftok = (await jwtUtils.verifyJWT(
      refreshtoken
    )) as WithId<UserSignupType>;
    responsebody.data!.refreshtoken = reftok;
  } catch (error) {
    invalidrefreshtoken = true;
  }

  responsebody.data!.invalidrefreshtoken = invalidrefreshtoken;
  responsebody.data!.invalidsessionToken = invalidsessiontoken;
  res.status(200);
  res.json(responsebody);
};
