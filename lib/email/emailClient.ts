/**
 * Server-Side Transactional Email Client
 * Supports:
 * 1. Brevo (Sendinblue) API (300 free emails/day to ANY student email without custom domain!)
 * 2. Gmail SMTP (Nodemailer)
 * 3. Resend Transactional Email API (https://resend.com)
 * 4. Fallback Mailto URL generation
 */
export { generateMailtoLink } from "./templateEngine";

export interface EmailConfig {
  isConfigured: boolean;
  missingVars: string[];
  apiKey: string;
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  provider: string;
  driver: "brevo" | "gmail" | "resend" | "none";
}

export function getEmailConfig(): EmailConfig {
  const brevoApiKey = process.env.BREVO_API_KEY || "";
  const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || "";
  const gmailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || "hello.sparktron@gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || "";

  const senderName = process.env.EMAIL_FROM_NAME || "SPARKTRON 2K26";
  const replyToEmail = process.env.EMAIL_REPLY_TO || "hello.sparktron@gmail.com";

  // 1. Brevo Priority (Sends to all students without custom domain requirement)
  if (brevoApiKey) {
    let senderEmail = process.env.EMAIL_FROM || "hello.sparktron@gmail.com";
    if (senderEmail.includes("resend.dev") || !senderEmail.includes("@")) {
      senderEmail = "hello.sparktron@gmail.com";
    }
    return {
      isConfigured: true,
      missingVars: [],
      apiKey: brevoApiKey,
      senderEmail,
      senderName,
      replyToEmail,
      provider: "Brevo Transactional API (Sends to All)",
      driver: "brevo",
    };
  }

  // 2. Gmail SMTP
  if (gmailPassword) {
    return {
      isConfigured: true,
      missingVars: [],
      apiKey: gmailPassword,
      senderEmail: gmailUser,
      senderName,
      replyToEmail,
      provider: "Gmail SMTP Direct",
      driver: "gmail",
    };
  }

  // 3. Resend
  if (resendApiKey) {
    const senderEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
    return {
      isConfigured: true,
      missingVars: [],
      apiKey: resendApiKey,
      senderEmail,
      senderName,
      replyToEmail,
      provider: "Resend Transactional API",
      driver: "resend",
    };
  }

  return {
    isConfigured: false,
    missingVars: ["BREVO_API_KEY or RESEND_API_KEY"],
    apiKey: "",
    senderEmail: "hello.sparktron@gmail.com",
    senderName,
    replyToEmail,
    provider: "Unconfigured",
    driver: "none",
  };
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResponse {
  success: boolean;
  configured: boolean;
  status: "Sent" | "Failed";
  messageId?: string;
  error?: string;
  raw?: any;
}

/**
 * Dispatches an email via Brevo, Gmail SMTP, or Resend API.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams): Promise<SendEmailResponse> {
  const config = getEmailConfig();

  const recipientList = Array.isArray(to) ? to : [to];
  const validRecipients = recipientList
    .map((e) => e?.trim())
    .filter((e) => e && e.includes("@"));

  if (validRecipients.length === 0) {
    return {
      success: false,
      configured: config.isConfigured,
      status: "Failed",
      error: "No valid recipient email address provided.",
    };
  }

  if (!config.isConfigured) {
    return {
      success: false,
      configured: false,
      status: "Failed",
      error: `Email service is not configured. Missing: ${config.missingVars.join(", ")}.`,
    };
  }

  // ==========================================
  // DRIVER 1: Brevo (Sendinblue) API
  // Sends to ANY student address without custom domain!
  // ==========================================
  if (config.driver === "brevo") {
    try {
      let cleanSenderEmail = config.senderEmail.includes("<")
        ? config.senderEmail.replace(/.*<([^>]+)>.*/, "$1").trim()
        : config.senderEmail.trim();

      if (cleanSenderEmail.includes("resend.dev") || !cleanSenderEmail.includes("@")) {
        cleanSenderEmail = "hello.sparktron@gmail.com";
      }

      const payload = {
        sender: {
          name: config.senderName,
          email: cleanSenderEmail,
        },
        to: validRecipients.map((email) => ({ email })),
        subject: subject,
        htmlContent: html,
        textContent: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        replyTo: {
          email: replyTo || config.replyToEmail || "hello.sparktron@gmail.com",
          name: config.senderName,
        },
      };

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          configured: true,
          status: "Failed",
          error: resData.message || `Brevo Error: HTTP ${res.status}`,
          raw: resData,
        };
      }

      return {
        success: true,
        configured: true,
        status: "Sent",
        messageId: resData.messageId || resData.messageIds?.[0],
        raw: resData,
      };
    } catch (brevoErr: any) {
      console.error("[Brevo Error]:", brevoErr);
      return {
        success: false,
        configured: true,
        status: "Failed",
        error: brevoErr.message || "Failed to communicate with Brevo Email API.",
      };
    }
  }

  // ==========================================
  // DRIVER 2: Gmail SMTP (Nodemailer)
  // ==========================================
  if (config.driver === "gmail") {
    try {
      const nodemailerModule = await import("nodemailer");
      const nodemailer = nodemailerModule.default || nodemailerModule;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.senderEmail,
          pass: config.apiKey,
        },
      });

      const formattedFrom = `"${config.senderName}" <${config.senderEmail}>`;

      const info = await transporter.sendMail({
        from: formattedFrom,
        to: validRecipients,
        subject,
        html,
        text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        replyTo: replyTo || config.replyToEmail,
      });

      return {
        success: true,
        configured: true,
        status: "Sent",
        messageId: info.messageId,
        raw: info,
      };
    } catch (smtpErr: any) {
      console.error("[Gmail SMTP Error]:", smtpErr);
      return {
        success: false,
        configured: true,
        status: "Failed",
        error: smtpErr.message || "Failed to send email via Gmail SMTP.",
      };
    }
  }

  // ==========================================
  // DRIVER 3: Resend HTTP API
  // ==========================================
  try {
    const formattedFrom = config.senderEmail.includes("<")
      ? config.senderEmail
      : `${config.senderName || "SPARKTRON 2K26"} <${config.senderEmail || "onboarding@resend.dev"}>`;

    const payload = {
      from: formattedFrom,
      to: validRecipients,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      reply_to: replyTo || config.replyToEmail || "hello.sparktron@gmail.com",
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMsg =
        resData.message ||
        resData.error?.message ||
        `Resend API error (HTTP ${res.status}): ${res.statusText}`;

      // User-friendly diagnostic for Resend sandbox domain restriction
      if (res.status === 403 && errorMsg.includes("own email address")) {
        errorMsg = `Resend Sandbox Mode: Only allows sending to your account email (${config.replyToEmail}). To send to all students, add a custom domain at resend.com/domains or use Brevo (BREVO_API_KEY).`;
      }

      return {
        success: false,
        configured: true,
        status: "Failed",
        error: errorMsg,
        raw: resData,
      };
    }

    return {
      success: true,
      configured: true,
      status: "Sent",
      messageId: resData.id,
      raw: resData,
    };
  } catch (err: any) {
    return {
      success: false,
      configured: true,
      status: "Failed",
      error: err?.message || "Network error communicating with Email API.",
    };
  }
}


