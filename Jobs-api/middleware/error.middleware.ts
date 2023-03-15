import { ErrorRequestHandler } from "express";
import { HttpError } from "http-errors";
//todo error middleware with custom error
export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const isInstanceOfHttpError = err instanceof HttpError;
  const status = isInstanceOfHttpError ? err.status : 500;
  const message = isInstanceOfHttpError ? err.message : "something went wrong";
  res.status(status);
  res.json({ error: true, message });
};
