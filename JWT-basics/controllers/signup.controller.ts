import express from "express";
import { parseSignup, UserSignupType } from "../models/user.model";
import { User } from "../db/connect";
import { hashPassword } from "../utils/hashPassword";

export const signupController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let userdata = req.body;
  const result = parseSignup(userdata);
  if (result.error) {
    res.status(400);
    res.json({ inserted: false, error: result.errormessage });
    return;
  }
  const parsedUser = result.data!; // ora sono sicuro che c'è user, ora inseriamo user

  const exists = Boolean(
    await User.find<UserSignupType>((user) => user.email === parsedUser.email)
  );
  if (exists) {
    //conflict
    res.status(409);
    res.json({ inserted: false, error: "user already exists" });
    return;
  }

  const passwordHash = await hashPassword(parsedUser.password);

  const dbUser: UserSignupType = {
    email: parsedUser.email,
    fullname: parsedUser.fullname,
    password: passwordHash,
    username: parsedUser.username,
  };

  try {
    await User.insertOne(dbUser);
  } catch (error) {
    res.status(500);
    res.json({ inserted: false, error: "internal server error" });
    return;
  }

  res.status(201);
  res.json({ inserted: true });

  //creaimao l'hash della password

  //lo user è salvato nel db usando come indice l'email

  //validiamo l'email
};
