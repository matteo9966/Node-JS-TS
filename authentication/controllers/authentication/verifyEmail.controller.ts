import e from "express";
import { APIResponse } from "../../interfaces/response.interface";
import { userModel } from "../../mongodb/models/User.model";
import httpError from "http-errors";
import { passwordUtils } from "../../utils/password.utils";
import { UserSignupType } from "../../schemas/user.schema";
import { loginCookiesHelper } from "../../utils/setLoginCookies.utils";
import setCookie from "set-cookie-parser";
import { TokenSchema } from "../../schemas/token.schema";
import { tokenModel } from "../../mongodb/models/Token.model";
// import querystring from 'querystring';

export const verifyEmailController: {
  (...args: Parameters<e.RequestHandler>): Promise<void>;
} = async function (req, res, next) {
    const responsebody:APIResponse<any>={error:false};

    /* 
    "query": {
      "email": "matteoluigitommasi@gmail.com",
      "verificationtoken": "7f94b429778f"
    }
    */
    const {email,verificationtoken} = {email:null,verificationtoken:null,...req.query};

    try {
        
        if(!email || !verificationtoken){
            throw httpError.BadRequest("missing email or verification token")
        }

        const user = await userModel.findOne({email});

        if(!user){
            throw httpError.BadRequest("no user with email provided")
        }


        const {isVerified} = user;
        if(isVerified){
            responsebody.data={verified:true};
            res.json(responsebody)
            return
        }
        //check if the verificationtokens are the same
        if(verificationtoken === user.verificationToken){
            //update 
            await userModel.updateOne({email},{$set:{isVerified:true,verificationToken:""}});
            responsebody.data={verified:true};
            res.json(responsebody)
            return
        }else{
            throw httpError.BadRequest("error while trying to verify your email")
        }

    } catch (error) {
        console.log(error);
        responsebody.error=true;
        if(error instanceof httpError.HttpError){
         responsebody.message = error.message;
         responsebody.statusCode=error.statusCode;
         res.status(error.statusCode);
         
        }else{
            responsebody.message="internal server error";
            responsebody.statusCode=500;
            res.status(500);
        }
        res.json(responsebody)
    }
    

    res.json(responsebody)

  

};
