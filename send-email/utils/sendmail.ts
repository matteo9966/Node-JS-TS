import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const verifiedEmail = process.env.VERIFIED_SENDER;
async function sendEmail({ to, subject, text, html }: sgMail.MailDataRequired) {
  if (!(to && subject)) {
    throw new Error("invalid, to from and subject are required!");
  }
  try {
    console.log({
        to,
        from: verifiedEmail,
        subject,
        text: text || "",
        
      })
    return sgMail.send({
      to,
      from: verifiedEmail,
      subject,
      text: text || "",
      
    });
  } catch (error) {
    console.log(error);
  }
}

const nodemailerSend = async function(){

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.VERIFIED_SENDER,
        pass: process.env.SECRET_EMAIL_PASSWROD
    }
});


return transporter.sendMail({
  from: process.env.VERIFIED_SENDER, // sender address
  to: "matteo_tommasi96@hotmail.com", // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
});

}

export { sendEmail,nodemailerSend };
