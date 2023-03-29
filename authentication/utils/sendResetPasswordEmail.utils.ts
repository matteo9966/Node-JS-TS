import { nodemailerSend } from "./sendEmail.utils";
import querystring from 'querystring';
import dotenv from 'dotenv';
import { convertDate } from "./convert-dates.utils";
dotenv.config();

export function sendResetPasswordEmail(email: { to: string },token:string) {
    const subject = "reset password";
    const origin = `http://localhost`;
    const port =process.env.AUTHENTICATION_APP_PORT;
    
  const html = createHtmlBody(token,email.to,origin,port);
  nodemailerSend({ to: email.to, html, subject });
}

function createHtmlBody(token:string,email:string,origin:string,port:string){
    const qstr = querystring.stringify({email,token:token});
   const href = `${origin}:${port}/auth/reset-password?${qstr}`;
   // http://localhost:7700/auth/reset-password?email=matteoluigitommasi%40gmail.com&token=5ee3a18acafa1
   const date = convertDate(new Date())
    return `
    <p>Click on the link to reset your password!</p>
    <b>Your password token will only have a validity of 10 minutes starting from: ${date}</b>
    <ul>
    <li>email: ${email}</li>
    <li>token: ${token}</li>
    <br>
    <p>Click here to reset your passowrd: <a href="${href}">Reset your password</a></p>
    </ul>        
    `
  }