// import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const nodemailerSend = async function(email:{to:string,subject:string,html:string}){
    const {to,subject,html}=email;
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
            user: process.env.VERIFIED_SENDER,
            pass: process.env.SECRET_EMAIL_PASSWROD
        }
    })

    return transporter.sendMail({
        from: process.env.VERIFIED_SENDER, // sender address
        to, 
        subject,
        html
      });


}