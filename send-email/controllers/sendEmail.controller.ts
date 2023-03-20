import { RequestHandler } from "express";
import { nodemailerSend, sendEmail } from "../utils/sendmail";

export const sendEmailController: RequestHandler = async function (
  req,
  res,
  next
) {
  const emailObj = req.body;
  try {
    const status = await sendEmail(emailObj);
    console.log(status);
    res.status(200);
    res.send("ok");
  } catch (error) {
    res.status(500);
    console.log(error);
    res.end("error while sending email");
  }
};
export const sendEmailNodemailerController: RequestHandler = async function (
  req,
  res,
  next
) {
  const emailObj = req.body;
  try {
    await nodemailerSend();
    res.status(200);
    res.end("sent something");
  } catch (error) {
    res.status(200);
    res.end("did not send anything");
  }
};
