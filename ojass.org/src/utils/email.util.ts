import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

// Template imports (typed as functions returning string)
import getEmailVerificationTemplateUtopia from "../templates/utopia/email-verification.js";
import getEmailVerificationTemplateDystopia from "../templates/dystopia/email-verification.js";
import getResetPasswordTemplateUtopia from "../templates/utopia/reset-password.js";
import getResetPasswordTemplateDystopia from "../templates/dystopia/reset-password.js";

/**
 * Get theme from environment or default to 'utopia'
 */
const getTheme = (): string => {
  return process.env.EMAIL_THEME || "utopia";
};

/**
 * Initialize Brevo API instance
 */
const getBrevoApi = (): TransactionalEmailsApi => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is not configured. Please set BREVO_API_KEY in environment variables."
    );
  }

  const emailAPI = new TransactionalEmailsApi();
  // @ts-ignore — the SDK’s typings sometimes lag behind actual fields
  emailAPI.authentications.apiKey.apiKey = apiKey;

  return emailAPI;
};

/**
 * Send email using Brevo
 * @param receiver - Recipient email address
 * @param subject - Email subject
 * @param htmlContent - HTML content of the email
 * @param textContent - Optional plain text version
 * @returns Brevo API response
 */
const sendEmail = async (
  receiver: string,
  subject: string,
  htmlContent: string,
  textContent: string | null = null
): Promise<any> => {
  try {
    // Development mode fallback (no API key)
    if (process.env.NODE_ENV === "development" && !process.env.BREVO_API_KEY) {
      console.log("=== EMAIL (Development Mode - Brevo Not Configured) ===");
      console.log("To:", receiver);
      console.log("Subject:", subject);
      console.log("HTML Content Length:", htmlContent?.length || 0);
      console.log(
        "HTML Preview (first 500 chars):",
        htmlContent?.substring(0, 500)
      );
      return { messageId: "dev-mode" };
    }

    const emailAPI = getBrevoApi();
    const message = new SendSmtpEmail();

    message.subject = subject;
    message.htmlContent = htmlContent;

    if (textContent) {
      message.textContent = textContent;
    }

    message.sender = {
      name: process.env.SENDER_NAME || "OJASS 2026",
      email:
        process.env.SENDER_EMAIL ||
        process.env.BREVO_SENDER_EMAIL ||
        "noreply@ojassfest.com",
    };

    message.to = [{ email: receiver }];

    const response = await emailAPI.sendTransacEmail(message);

    if (response) {
      return response;
    } else {
      throw new Error("There was an error while sending an email!");
    }
  } catch (error: any) {
    console.error("Error sending email via Brevo:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        response: error.response?.body,
      });
    }
    throw error;
  }
};

/**
 * Send email verification code
 * @param email - Recipient email
 * @param otp - Verification OTP
 */
export const sendEmailVerification = async (
  email: string,
  otp: string | number
): Promise<void> => {
  try {
    const theme = getTheme();
    let htmlContent: string;

    if (theme === "dystopia") {
      htmlContent = getEmailVerificationTemplateDystopia(otp.toString());
    } else {
      htmlContent = getEmailVerificationTemplateUtopia(otp.toString());
    }

    const response = await sendEmail(
      email,
      "Verify Your Email - OJASS 2026",
      htmlContent,
      `Your email verification code for OJASS 2026 is: ${otp}. This code will expire in 10 minutes.`
    );

    console.log(
      `Email verification sent to ${email}`,
      response?.messageId ? `(Message ID: ${response.messageId})` : ""
    );
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

/**
 * Send password reset code
 * @param email - Recipient email
 * @param otp - Reset OTP
 */
export const sendPasswordReset = async (
  email: string,
  otp: string | number
): Promise<void> => {
  try {
    const theme = getTheme();
    let htmlContent: string;

    if (theme === "dystopia") {
      htmlContent = getResetPasswordTemplateDystopia(otp.toString());
    } else {
      htmlContent = getResetPasswordTemplateUtopia(otp.toString());
    }

    const response = await sendEmail(
      email,
      "Password Reset - OJASS 2026",
      htmlContent,
      `Your password reset code for OJASS 2026 is: ${otp}. This code will expire in 10 minutes.`
    );

    console.log(
      `Password reset email sent to ${email}`,
      response?.messageId ? `(Message ID: ${response.messageId})` : ""
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Export the base sendEmail function for other uses
export { sendEmail };
