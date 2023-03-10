import express from "express";
import { router as userRouter } from "./routes/user.router";
const app = express();
app.use(express.json());

app.use("/user", userRouter);
