import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import crypto from "crypto";
import { sendEmail } from "./mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return new Promise<string>((resolve, reject) => {
          const salt = crypto.randomBytes(16).toString("hex");
          crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
          });
        });
      },
      verify: async ({ hash, password }) => {
        return new Promise<boolean>((resolve) => {
          const [salt, key] = hash.split(":");
          crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err || !derivedKey) {
              resolve(false);
              return;
            }
            resolve(derivedKey.toString("hex") === key);
          });
        });
      },
    },
    sendResetPassword: async ({ user, url, token }, request) => {
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}`;
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1c1917; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 1.25rem; font-weight: 700; color: #4f46e5; letter-spacing: -0.025em;">Work à Rail</span>
          </div>
          <h2 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin-top: 0; margin-bottom: 12px;">Reset your password</h2>
          <p style="font-size: 0.875rem; line-height: 1.6; color: #57534e; margin-top: 0; margin-bottom: 24px;">
            We received a request to reset the password for your Work à Rail account. 
            Click the button below to choose a new password. This link will expire in 1 hour.
          </p>
          <div style="margin-bottom: 24px;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 0.875rem; font-weight: 500; text-decoration: none; padding: 10px 18px; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: background-color 0.15s ease-in-out;">
              Reset password
            </a>
          </div>
          <p style="font-size: 0.8125rem; line-height: 1.5; color: #78716c; margin-top: 0; margin-bottom: 24px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            <a href="${resetUrl}" style="color: #4f46e5; text-decoration: none; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
          <p style="font-size: 0.75rem; line-height: 1.4; color: #a8a29e; margin: 0;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      `;
      await sendEmail({
        to: user.email,
        subject: "Reset your password - Work à Rail",
        html,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "default-better-auth-secret-key-123456",
  plugins: [
    nextCookies(),
  ],
});
