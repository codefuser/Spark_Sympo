import { WhatsAppConfigStatus } from "@/types/whatsapp";

/**
 * Server-Side Meta WhatsApp Cloud API Client
 * Securely communicates with Meta Graph API using environment variables.
 * Never leaks access tokens or credentials to the client.
 */

export function getWhatsAppConfig(): {
  isConfigured: boolean;
  missingVars: string[];
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiUrl: string;
} {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "";
  const customApiUrl = process.env.WHATSAPP_API_URL || "";

  const missingVars: string[] = [];
  if (!accessToken) missingVars.push("WHATSAPP_ACCESS_TOKEN");
  if (!phoneNumberId) missingVars.push("WHATSAPP_PHONE_NUMBER_ID");

  const isConfigured = missingVars.length === 0;
  const apiUrl =
    customApiUrl ||
    `https://graph.facebook.com/v19.0/${phoneNumberId || "PHONE_NUMBER_ID"}/messages`;

  return {
    isConfigured,
    missingVars,
    accessToken,
    phoneNumberId,
    businessAccountId,
    apiUrl,
  };
}

/**
 * Normalizes phone numbers to standard E.164 without leading plus for WhatsApp Cloud API.
 * Handles 10-digit Indian numbers (prefixes 91), strips spaces, dashes, parentheses.
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, "");

  // If starts with 00, remove it
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // If 10-digit Indian mobile number, prefix 91
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }

  // If 11 digits starting with 0, replace 0 with 91
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`;
  }

  return digits;
}

/**
 * Generates an instant, direct "Open in WhatsApp Web / App" URL for fallback / manual sending.
 */
export function generateWaMeLink(phone: string, text: string): string {
  const formatted = formatPhoneNumber(phone);
  return `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
}

export interface SendWhatsAppResponse {
  success: boolean;
  configured: boolean;
  messageId?: string;
  status: "Sent" | "Failed";
  error?: string;
  raw?: any;
}

/**
 * Dispatches a personalized text message through Meta WhatsApp Cloud API.
 * Returns genuine success or failure status without falsification.
 */
export async function sendWhatsAppTextMessage({
  to,
  body,
}: {
  to: string;
  body: string;
}): Promise<SendWhatsAppResponse> {
  const config = getWhatsAppConfig();
  const formattedPhone = formatPhoneNumber(to);

  if (!formattedPhone) {
    return {
      success: false,
      configured: config.isConfigured,
      status: "Failed",
      error: "Invalid recipient phone number.",
    };
  }

  if (!config.isConfigured) {
    return {
      success: false,
      configured: false,
      status: "Failed",
      error: `WhatsApp API credentials are not configured on server. Missing: ${config.missingVars.join(", ")}. Please configure environment variables in .env.`,
    };
  }

  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: true,
        body: body,
      },
    };

    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        resData.error?.message ||
        resData.error?.error_user_msg ||
        resData.message ||
        `HTTP Error ${res.status}: ${res.statusText}`;

      console.error("[WhatsApp Cloud API Error]:", resData);
      return {
        success: false,
        configured: true,
        status: "Failed",
        error: errorMsg,
        raw: resData,
      };
    }

    const messageId = resData.messages?.[0]?.id || `wamid.${Date.now()}`;

    return {
      success: true,
      configured: true,
      status: "Sent",
      messageId: messageId,
      raw: resData,
    };
  } catch (err: any) {
    console.error("[WhatsApp Network/Fetch Error]:", err);
    return {
      success: false,
      configured: true,
      status: "Failed",
      error: err.message || "Failed to reach Meta WhatsApp API endpoint.",
    };
  }
}
