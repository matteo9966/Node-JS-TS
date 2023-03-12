import { NextFunction, Request, RequestHandler, Response } from "express";
import { jwtFns } from "../utils/createJWT";
import httperrors from "http-errors";

//instead of always using async await .... 

export const authenticationMiddleware = function (
  req:Request,
  res:Response,
  next:NextFunction
) {
  //va in header a prendere il bearer token
  const bearer = req.headers.authorization || "";
  const token = bearer.split(" ")[1];
  if (!token) {
    throw httperrors(401, { message: "missing jwt token" });
  }

 return jwtFns.verifyJWT(token)
    .then((body) => {
      res.locals.user = body;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
