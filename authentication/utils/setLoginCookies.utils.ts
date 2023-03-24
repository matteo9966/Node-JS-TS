import e from "express";
import _ from "lodash";
import { WithId } from "mongodb";
import { UserSignupType } from "../schemas/user.schema";
// import { addCookieToResponse } from "./addCookiesToRes.utils";
import { jwtUtils } from "./jwt.utils";

const sessioncookieEXP = 1000 * 60 * 60 * 24;

export async function setLoginCookies(
  res: e.Response,
  user: WithId<UserSignupType>
) {
  const sessionToken = await jwtUtils.createJWT(user, {});
  res.cookie("sessiontoken", sessionToken, {
    httpOnly: true, 
    secure: false, // todo add secure to cookie
    signed: false, //todo add sign to cookie
    expires: new Date(Date.now() + sessioncookieEXP),
  });

  //per adesso vediamo se aggiunge il session token

}
