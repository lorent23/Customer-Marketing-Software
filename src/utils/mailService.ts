import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { logger } from './logger';

dotenv.config();


export const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    const transporter: any = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: Number(process.env.MAIL_PORT) || 0,
      // secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
    logger.info("Email sent sucessfully");
  } catch (error) {
    logger.error("Email not sent", error);
  }
};