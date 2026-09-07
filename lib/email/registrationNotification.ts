import { supabase } from "@/lib/database/supabase";
import { getEmailSettings } from "@/lib/email/settings";
import { sendEmail } from "@/lib/email/emailClient";
import {
  EMAIL_TEMPLATE_DEFINITIONS,
  interpolateVariables,
  generateHtmlEmail,
} from "@/lib/email/templateEngine";
import { EmailRecipientInfo } from "@/types/email";

/**
 * Automatically dispatches registration confirmation email after successful database save.
 * Protected with idempotency checks to prevent duplicate confirmation emails.
 */
export async function sendAutomaticRegistrationConfirmation(
  registrationId: string
): Promise<{ success: boolean; sentCount: number; message: string }> {
  try {
    if (!registrationId) {
      return { success: false, sentCount: 0, message: "Missing registrationId" };
    }

    // 1. Idempotency Check: Verify if a confirmation email was already sent for this registration
    const { data: existingLogs } = await supabase
      .from("email_messages")
      .select("id, status")
      .eq("registration_id", registrationId)
      .eq("template_name", "CONFIRMATION")
      .in("status", ["Sent", "Delivered"]);

    if (existingLogs && existingLogs.length > 0) {
      console.log(`[Auto-Email] Confirmation email already sent for registration ${registrationId}. Skipping to prevent duplicates.`);
      return {
        success: true,
        sentCount: 0,
        message: "Confirmation email already sent (idempotent skip)",
      };
    }

    // 2. Fetch Registration, Participants, and Events from Supabase
    const { data: reg, error: regErr } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .maybeSingle();

    if (regErr || !reg) {
      console.warn(`[Auto-Email] Registration ${registrationId} not found in database:`, regErr);
      return { success: false, sentCount: 0, message: "Registration not found" };
    }

    const { data: participants, error: partErr } = await supabase
      .from("participants")
      .select("*")
      .eq("registration_id", registrationId);

    if (partErr || !participants || participants.length === 0) {
      console.warn(`[Auto-Email] No participants found for registration ${registrationId}`);
      return { success: false, sentCount: 0, message: "No participants found" };
    }

    // Fetch event track titles
    const { data: events } = await supabase
      .from("events")
      .select("id, title, slug, category");

    const eventsMap = new Map((events || []).map((e: any) => [e.id, e]));
    const techEv = eventsMap.get(reg.technical_event_id);
    const nonTechEv = eventsMap.get(reg.non_technical_event_id);

    // 3. Load Email & Venue Settings
    const settings = await getEmailSettings();

    // 4. Default Template
    const templateDef =
      EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === "CONFIRMATION") ||
      EMAIL_TEMPLATE_DEFINITIONS[0];

    let sentCount = 0;

    // 5. Send confirmation to each participant in the roster (or team leader)
    for (const p of participants) {
      const recipient: EmailRecipientInfo = {
        participantId: p.id,
        registrationId: reg.id,
        registrationCode: reg.registration_code || "SPK-2K26-PASS",
        name: p.full_name || "Participant",
        email: p.email || "",
        phone: p.phone || "",
        college: p.college || "",
        department: p.department || "ECE",
        teamName: reg.team_name,
        paymentStatus: reg.payment_status || "UNPAID",
        foodPreference: p.food_preference || "Veg",
        technicalEventTitle: techEv?.title,
        nonTechnicalEventTitle: nonTechEv?.title,
        technicalEventSlug: techEv?.slug,
        nonTechnicalEventSlug: nonTechEv?.slug,
      };

      if (!recipient.email) continue;

      const subject = interpolateVariables(templateDef.defaultSubject, recipient, settings);
      const textBody = interpolateVariables(templateDef.plainText, recipient, settings);
      const htmlBody = generateHtmlEmail({
        recipient,
        settings,
        subject,
        contentBodyText: textBody,
      });

      const dispatch = await sendEmail({
        to: recipient.email,
        subject,
        html: htmlBody,
        text: textBody,
      });

      const status = dispatch.success ? "Sent" : "Failed";
      if (dispatch.success) sentCount++;

      // Log to email_messages table
      try {
        await supabase.from("email_messages").insert({
          registration_id: reg.id,
          recipient_name: recipient.name,
          recipient_email: recipient.email,
          subject: subject,
          message_content: textBody,
          template_name: "CONFIRMATION",
          status: status,
          provider_message_id: dispatch.messageId || null,
          error_message: dispatch.error || null,
          sent_at: dispatch.success ? new Date().toISOString() : null,
        });
      } catch (logErr) {
        console.warn("[Auto-Email] Could not log to email_messages table:", logErr);
      }
    }

    return {
      success: true,
      sentCount,
      message: `Confirmation emails processed: ${sentCount} sent`,
    };
  } catch (error: any) {
    console.error("[Auto-Email] Unexpected error in sendAutomaticRegistrationConfirmation:", error);
    return {
      success: false,
      sentCount: 0,
      message: error.message || "Failed to send automatic confirmation email",
    };
  }
}
