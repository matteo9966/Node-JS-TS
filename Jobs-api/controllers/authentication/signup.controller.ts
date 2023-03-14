import {
  userLoginType,
  userSignupValidator,
  userType,
} from "../../models/user.model";
import { Express } from "express";
import { PromisifiedExpressHandler } from "../../types/PromisifiedExpressHandler.type";
import { User } from "../../db/connect";

export const signupController: PromisifiedExpressHandler = async function (
  req,
  res,
  next
) {
  const userSignup: userType = req.body;
  const parsedUser = await userSignupValidator(userSignup);
  if (parsedUser.error || !parsedUser.data) {
    res.status(401);
    res.json({ error: true, message: parsedUser.errormessage });
    return;
  }
  //check if user is unique
  const inDbUSer = await User.find<userType>(
    (user) => user.email === parsedUser.data.email
  );

  if (inDbUSer) {
    res.status(400);
    res.json({ error: true, message: "user exists" });
    return;
  }

  //can insert
  try {
    await User.insertOne(parsedUser.data);
    res.status(201);
    res.json({ error: false, inserted: true });
  } catch (error) {
    res.status(500);
    res.json({error:true,inserted:false,message:'server error'})
  }
};
