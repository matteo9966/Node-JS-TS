import e from "express";
import { MongoServerError } from "mongodb";
import { APIResponse } from "../../interfaces/response.interface";
import { userModel } from "../../mongodb/models/User.model";
import { UserSignupType } from "../../schemas/user.schema";
import { passwordUtils } from "../../utils/password.utils";
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
    res.status(400);
    res.json(responsebody);
    return;
  }

  // find one by email
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      responsebody.error = true;
      responsebody.message = "email already exists";
      res.status(400);
      res.json(responsebody);
      return;
    }

    const verificationToken = Math.random().toString(16).slice(2);
    const hashedPassword = await passwordUtils.hashPassword(password) 
    if(!hashedPassword){
      throw new Error('error while hashing passord')
    }
    const insertUser: UserSignupType = {
      name,
      email,
      password:hashedPassword,
      isVerified: false,
      role: "user",
      passwordTokenExpirationDate: new Date(),
      verificationToken: verificationToken,
    };


    //create the user:
    const result = await userModel.insertOne(insertUser);
    if(result.insertedId){
      responsebody.data = {inserted:true};
      res.status(200)
      res.json(responsebody)
    }else{
      responsebody.error=true;
      responsebody.message=`user ${email} was not inserted`;
      res.status(400);
      res.json(responsebody)
    }

    //lets create the user to insert in the database
  } catch (error) {
    console.dir(error);
    res.status(500)
    responsebody.error=true;
   if( error instanceof MongoServerError &&
      (<Record<any, any>>error).keyValue 
    ){
      responsebody.message=error.message;
    }else if(error instanceof MongoServerError){

      responsebody.data=error.errInfo;
      responsebody.message=error.message
    }
    res.json(responsebody)
  }

};
