import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  // Load fallback settings from environment variables
  let host = process.env.SMTP_HOST || "";
  let port = Number(process.env.SMTP_PORT) || 587;
  let secure = process.env.SMTP_SECURE === "true";
  let user = process.env.SMTP_USER || "";
  let pass = process.env.SMTP_PASS || "";
  let from = process.env.SMTP_FROM || "noreply@workarail.com";

  // Try retrieving SMTP settings from database
  try {
    const smtp = await prisma.smtpSettings.findUnique({
      where: { id: "default" },
    });
    if (smtp) {
      if (smtp.host) host = smtp.host;
      if (smtp.port) port = smtp.port;
      if (smtp.secure !== undefined) secure = smtp.secure;
      if (smtp.user) user = smtp.user;
      if (smtp.pass) pass = smtp.pass;
      if (smtp.from) from = smtp.from;
    }
  } catch (err) {
    console.error("Error fetching SMTP settings from DB, using fallback env settings:", err);
  }

  if (!host || !user || !pass) {
    console.warn("SMTP settings are not fully configured. Email was not sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // secure: true is only for port 465, port 587 uses STARTTLS (secure: false)
    auth: {
      user,
      pass,
    },
  });

  const fromName = process.env.SMTP_FROM_NAME || "Work à Rail";
  await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to,
    subject,
    html,
  });
}
