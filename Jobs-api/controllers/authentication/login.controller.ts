import {
  userLoginType,
  userSignupValidator,
  userLoginValidator,
  userType,
} from "../../models/user.model";
import * as argon2 from "argon2";
import { Express } from "express";
import { PromisifiedExpressHandler } from "../../types/PromisifiedExpressHandler.type";
import { User } from "../../db/connect";
import { jwtFns } from "../../utils/jwtUtils";

export const loginController: PromisifiedExpressHandler = async function (
  req,
  res,
  next
) {
  const userSignup: userLoginType = req.body;
  const parsedUser = await userLoginValidator(userSignup);
  if (parsedUser.error || !parsedUser.data) {
    res.status(401);
    res.json({ error: true, message: parsedUser.errormessage });
    return;
  }
  //check if user is unique
  const inDbUSer = await User.find<userType>(
    (user) => user.email === parsedUser.data.email
  );

  if (!inDbUSer) {
    res.status(401);
    res.json({
      error: true,
      message: "you are not authorized. user does not exist",
    });
    return;
  }

  //can insert
  try {
    const verified = await argon2.verify(
      inDbUSer.password,
      userSignup.password
    );
    if (!verified) {
      res.status(401);
      res.json({ error: true, message: "you are not authorized" });
    } else {
      //creo un jwt con il inDbUser e lo mando come header
      const jwt = await jwtFns.createJWT(inDbUSer);
      res.setHeader("Authorization", `bearer ${jwt}`);
      res.status(200);
      res.json({ error: false, authenticated: true });
      return;
    }
  } catch (error) {
    res.status(500);
    res.json({ error: true, inserted: false, message: "server error" });
  }
};
