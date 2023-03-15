import express from "express";
import { dbConnection } from "./db/connect";
import path from "path";
import dotenv from "dotenv";
import { authenticationRouter } from "./routes/authentication.route";
import { errorMiddleware } from "./middleware/error.middleware";
import { notfoundMiddleware } from "./middleware/notFound.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { jobsrouter } from "./routes/job.route";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authenticationRouter);
app.use('/api/jobs',authenticationMiddleware,jobsrouter)
app.use('*',notfoundMiddleware);
app.use(errorMiddleware)

// app.use(  ! //only the first middleware is executed
//   "/test",
//   (req, res, next) => {
//     console.log("request: ", req.url);
//     res.json({ hello: "world" });
//   },
//   (req, res, next) => {
//     console.log("i got here");
//     res.json({hello:"wordl 2"})
//   }
// );

const dbPath =
  process.env.NODE_ENV === "development"
    ? process.env.DB_PATH
    : process.env.NODE_ENV === "testing"
    ? process.env.DB_PATH_TEST
    : "database-jobs.json";

function main() {
  try {
    dbConnection.initDB(path.join(__dirname, dbPath));
  } catch (error) {
    process.exit(1);
  }
  app.listen(process.env.JOBS_PORT, () =>
    console.log("listening on, port:", process.env.JOBS_PORT)
  );
}
main();
export { app };
