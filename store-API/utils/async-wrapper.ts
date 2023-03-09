import { RequestHandler, Request, Response, NextFunction } from "express";

type requestHandler = (
  ...para: Parameters<RequestHandler>
) => Promise<ReturnType<RequestHandler>>;

export const asyncWrap = (fn: requestHandler) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (error) {
      if(error && typeof error === 'object' && 'message' in error){
        next(error.message);
      }
      else{
        next('server error')
      }
    }
  };
};
