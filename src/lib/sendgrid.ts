import { config } from "@/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(config.env.SENDGRID_API_KEY);
export const mailClient = sgMail;
