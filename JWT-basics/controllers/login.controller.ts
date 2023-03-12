import {jwtFns} from "../utils/createJWT";
import argon2 from 'argon2'
import express from "express";
import { parseLogin, UserSignupType } from "../models/user.model";
import { User } from "../db/connect";
export async function loginController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const parsedUser = parseLogin(req.body);
  if (parsedUser.error) {
    res.status(401);
    res.json({ error: true, message: "unothorized to login" });
    return;
  }

  //ora cerchiamo l'user nel db

  const user = await User.find<UserSignupType>(user=>user.username===parsedUser.data?.username)

  if(!user){
    res.status(401)
    res.json({error:true,message:'not authorized to login - no user in db'})
      return  
}

const userDigest = user.password;
const validPassword = await argon2.verify(userDigest,parsedUser.data?.password||"");
if(!validPassword){
    res.status(401)
    res.json({error:true,message:'wrong username or password, try again'})
    return
}
try {
    const jsonWebToken = await jwtFns.createJWT(user);
    //set authorization header 
    res.setHeader('Authorization',`bearer ${jsonWebToken}`);
    res.status(201);
    res.json({
        loggedIn:true,
        todo:'add the exp date of the token'
    })

    
} catch (error) {
    res.status(500);
    res.end({});
}





  //ok validazione del token
}
