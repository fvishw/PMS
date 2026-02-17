import nodemailer, { type Transporter } from "nodemailer";
import {
  APP_BASE_URL,
  GMAIL_APP_PASSWORD,
  NODE_ENV,
  SENDER_EMAIL,
} from "@/constants/env.js";
import { ApiError } from "@/utils/ApiError.js";
import { EmailTemplate } from "./emailTemplate.js";

interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class EmailService {
  private static instance: EmailService;
  private transporter: Transporter | null = null;

  private constructor() { }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      if (!SENDER_EMAIL || !GMAIL_APP_PASSWORD) {
        throw new ApiError(
          500,
          "Email service is not configured. Set SENDER_EMAIL and GMAIL_APP_PASSWORD.",
        );
      }
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SENDER_EMAIL,
          pass: GMAIL_APP_PASSWORD,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });
    }
    return this.transporter;
  }

  async verifyConnection(): Promise<void> {
    if (NODE_ENV !== "production") {
      return;
    }
    await this.getTransporter().verify();
  }

  private async sendEmail(payload: SendEmailPayload): Promise<void> {
    await this.getTransporter().sendMail({
      from: `"NexPerformance" <${SENDER_EMAIL}>`,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${APP_BASE_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(resetToken)}`;
    const template = EmailTemplate.getPasswordResetEmail({ resetUrl });

    await this.sendEmail({
      to: recipientEmail,
      html: template,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    });
  }
  async sendInvitationEmail(recipientEmail: string): Promise<void> {
    const template = EmailTemplate.getInvitationEmail();

    await this.sendEmail({
      to: recipientEmail,
      html: template,
      subject: "You're Invited to Join NexPerformance",
      text: `You have been invited to join NexPerformance. Please click the link in the email to accept the invitation and set up your account.`,
    });
  }
}

const emailService = EmailService.getInstance();

export default emailService;
