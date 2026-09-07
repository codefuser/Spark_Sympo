/**
 * Server-Side Transactional Email Client
 * Communicates with Resend / Transactional Email HTTP API securely on the server.
 * Never leaks API keys or secrets to the browser.
 */

export interface EmailConfig {
  isConfigured: boolean;
  missingVars: string[];
  apiKey: string;
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  provider: string;
}

export function getEmailConfig(): EmailConfig {
  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.EMAIL_API_KEY ||
    "";

  const senderEmail =
    process.env.EMAIL_FROM ||
    "onboarding@resend.dev";

  const senderName =
    process.env.EMAIL_FROM_NAME ||
    "SPARKTRON 2K26";

  const replyToEmail =
    process.env.EMAIL_REPLY_TO ||
    "sparktron2k26@gmail.com";

  const missingVars: string[] = [];
  if (!apiKey) {
    missingVars.push("RESEND_API_KEY (or EMAIL_API_KEY)");
  }

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    apiKey,
    senderEmail,
    senderName,
    replyToEmail,
    provider: "Resend Transactional Email API",
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
 * Dispatches an email via the transactional email API.
 * Accurately reports success or error without falsifying delivery.
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
      error: `Email service is not configured on server. Missing: ${config.missingVars.join(", ")}. Please set RESEND_API_KEY in .env.`,
    };
  }

  try {
    const formattedFrom = `${config.senderName} <${config.senderEmail}>`;

    const payload = {
      from: formattedFrom,
      to: validRecipients,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      reply_to: replyTo || config.replyToEmail,
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
      const errorMsg =
        resData.message ||
        resData.error?.message ||
        `HTTP Error ${res.status}: ${res.statusText}`;

      console.error("[Email Dispatch Error]:", resData);
      return {
        success: false,
        configured: true,
        status: "Failed",
        error: errorMsg,
        raw: resData,
      };
    }

    const messageId = resData.id || `msg_${Date.now()}`;

    return {
      success: true,
      configured: true,
      status: "Sent",
      messageId,
      raw: resData,
    };
  } catch (err: any) {
    console.error("[Email Network/Fetch Error]:", err);
    return {
      success: false,
      configured: true,
      status: "Failed",
      error: err.message || "Failed to reach email provider endpoint.",
    };
  }
}

/**
 * Generates an instant mailto link for direct desktop client fallback testing.
 */
export function generateMailtoLink(to: string, subject: string, bodyText: string): string {
  const cleanTo = encodeURIComponent(to || "");
  const cleanSubj = encodeURIComponent(subject || "");
  const cleanBody = encodeURIComponent(bodyText || "");
  return `mailto:${cleanTo}?subject=${cleanSubj}&body=${cleanBody}`;
}
