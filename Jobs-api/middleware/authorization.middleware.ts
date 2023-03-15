//TODO authorization middleware

import { RequestHandler } from "express";
import httperror from "http-errors";
import { userType } from "../models/user.model";
import _ from "lodash";
//after authentication i want to add authorization

export const authorizationfactoryMiddleware = function (
  validRoles: userType["roles"]
) {
  return function (req, res, next) {
    //always after
    const user = res.locals.jobsUser as userType;
    if (!user) {
      console.error("missing  jobsUser inside user");
      throw httperror.Unauthorized(
        "you are not authorized to access this route"
      );
    }
    const roles = user.roles as userType["roles"];
    if (_.intersection(roles, validRoles).length > 0) {
      next();
    } else {
      console.error(
        "authorizationMiddleware: valid roles:",
        validRoles,
        "provided roles:",
        roles
      );
      throw httperror.Unauthorized(
        "you do not have the authorization to access this route"
      );
    }
  } as RequestHandler;
};


