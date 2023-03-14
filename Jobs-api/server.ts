import express from "express";
import { dbConnection } from "./db/connect";
import path from "path";
import dotenv from "dotenv";
import { authenticationRouter } from "./routes/authentication.route";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authenticationRouter);

const dbPath =
  process.env.NODE_ENV === "development"
    ? process.env.DB_PATH
    : process.env.NODE_ENV === "testing"
    ? process.env.DB_PATH_TEST
    : "database-jobs.json";

function main() {
  try {
    dbConnection.initDB(path.join(__dirname,dbPath));
  } catch (error) {
    process.exit(1);
  }
  app.listen(process.env.JOBS_PORT, () =>
    console.log("listening on, port:", process.env.JOBS_PORT)
  );
}
main();
export { app };
