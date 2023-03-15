//only checks for the presence of a authentication token inside the header
import { PromisifiedExpressHandler } from "../types/PromisifiedExpressHandler.type";
import httpErrors from "http-errors";
import { jwtFns } from "../utils/jwtUtils";
import e from "express";
export const authenticationMiddleware =
  async function (req:e.Request, res:e.Response, next:e.NextFunction) {
    const authenticationH = req.headers?.authorization;
    if (!authenticationH) {
      throw httpErrors.Unauthorized("you are not authorized");
    }
    const token = authenticationH.split(" ")[1];
    if (!token) {
      throw httpErrors.BadRequest("the right format of token is bearer token");
    }
    try {
      const payload = await jwtFns.verifyJWT(token);
      res.locals.payload = payload;
      next();
    } catch (error) {
      console.log(error)
      throw httpErrors.Unauthorized("invalid token");
    }
  };
