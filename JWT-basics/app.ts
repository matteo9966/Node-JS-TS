import express from "express";
import { errorHandlerMiddleware } from "./middleware/errorhandler.middleware";
import { router as userRouter } from "./routes/user.router";
import { dbConnection } from "./db/connect";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const env = process.env.NODE_ENV || "development";

const dbpath =
  env === "development"
    ? path.join(__dirname, process.env.DB_PATH)
    : env === "testing"
    ? path.join(__dirname, process.env.DB_PATH_TEST)
    : "todo: add prod path";




try {
  dbConnection.initDB(dbpath);
} catch (error) {
  console.error(error);
  process.exit(1);
}

export const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use(errorHandlerMiddleware); //questo fa quasi da interceptor di errore

app.listen(5000, () => console.log("listenign on 5000"));

