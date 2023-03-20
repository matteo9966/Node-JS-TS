//this is a demo app that uses sendgrid api to send an email

import e from "express";
import { sendEmailController, sendEmailNodemailerController } from "./controllers/sendEmail.controller";
import dotenv from "dotenv";
dotenv.config();

const app = e();
app.use(e.json());

app.post("/send", sendEmailController);
app.post("/send-nodemailer", sendEmailNodemailerController);
app.use("*", (req, res, next) => {
  res.status(404);
  res.end("page not found");
});

function main() {
  try {
    app.listen(7000, () => {
      console.log("listening on port 7000");
    });
  } catch (error) {
    process.exit(1);
  }
}


main();