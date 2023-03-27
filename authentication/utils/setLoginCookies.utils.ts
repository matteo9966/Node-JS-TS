import e from "express";
import _ from "lodash";
import { WithId } from "mongodb";
import { tokenModel } from "../mongodb/models/Token.model";
import { UserSignupType } from "../schemas/user.schema";
// import { addCookieToResponse } from "./addCookiesToRes.utils";
import { jwtUtils } from "./jwt.utils";

const sessioncookieEXP = 1000 * 60 * 60 * 24;
const refreshTokenEXP = 1000 * 60 * 60 * 24; //in ms


 /**
  * @description adds both refresh token and session token to cookies,
  * @param res 
  * @param user 
  * @returns 
  */
export async function setLoginCookies(
  res: e.Response,
  user: WithId<UserSignupType>
):Promise<boolean> {
  //every time you log in you add a sessionToken
  let sessionToken:string|null=null;
  let refToken:string|null=null;
  try {
    sessionToken = await jwtUtils.createJWT(user, {}); //can reject
  } catch (error) {
    console.dir(error);
    return false; //
  }

  refToken = await handleRefreshToken(user)
  //can return null 
  if(!refToken){
    return false; //
  }
  

  res.cookie("sessiontoken", sessionToken, {
    httpOnly: true,
    secure: false, 
    signed: false, 
    expires: new Date(Date.now() + sessioncookieEXP),
  });

  res.cookie("refreshtoken",refToken,{
    httpOnly: true,
    secure: false, 
    signed: false, 
    expires: new Date(Date.now() + sessioncookieEXP),
    // expires: new Date(Date.now()), //the refresh token is expired
  });

  return true

}







async function handleRefreshToken(
  user: WithId<UserSignupType>
):Promise<null|string> {
  //check if user has a refresh token,
  const id = user._id;
  let refToken:string|null = null;
  try {
    const token = await tokenModel.findOne({ user: id });


    if(token){

      try {
         await jwtUtils.verifyJWT(token.refreshToken) //rejects if not valid
         refToken = token.refreshToken

      } catch (error) {
         console.log("setLoginCookies.utils:\n",error);
         refToken = await createRefreshToken(user);
      }
      
    }
    else{
      refToken = await createRefreshToken(user); //create new one
    }

    
  } catch (error) {
    console.dir(error);
  }


  return refToken

}


async function createRefreshToken(user:WithId<UserSignupType>){
  return jwtUtils.createJWT(user,{expiresIn:refreshTokenEXP/1000})
}