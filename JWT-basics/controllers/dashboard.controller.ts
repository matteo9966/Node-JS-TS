import type { RequestHandler } from "express";
import { UserSignupType } from "../models/user.model";
import { Promisified } from "../utils/utility-types/promisified.type";

export const dashboardController: Promisified<RequestHandler> = async function (
  req,
  res,
  next
) {
  const user: UserSignupType = res.locals.user; //il payload di user

  res.status(201);
  res.json(user); //restituisco solo l'user cosi come sta

  // i'll find the user inside req.locals
};
