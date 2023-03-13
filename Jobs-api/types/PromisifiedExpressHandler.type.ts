import type { Promisified } from "./Promisified.type";
import express from "express";

export type PromisifiedExpressHandler = Promisified<
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void
>;
