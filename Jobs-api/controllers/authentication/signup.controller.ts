import { userLoginType, userSignupValidator,userType } from "../../models/user.model";
import { Express } from "express";
import { PromisifiedExpressHandler } from "../../types/PromisifiedExpressHandler.type";

export const signupController:PromisifiedExpressHandler = async function(req,res,next){
   const userSignup:userType = req.body;
   const parsedUser = await userSignupValidator(userSignup);
 
   //TODO: continua da qui!!!

}

