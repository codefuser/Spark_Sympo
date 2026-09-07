import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { sendEmail } from "@/lib/email/emailClient";
import { getEmailSettings } from "@/lib/email/settings";
import {
  interpolateVariables,
  generateHtmlEmail,
  EMAIL_TEMPLATE_DEFINITIONS,
} from "@/lib/email/templateEngine";
import { EmailRecipientInfo, EmailTemplateType } from "@/types/email";

export const dynamic = "force-dynamic";

interface SendEmailRequestBody {
  participantIds?: string[];
  registrationIds?: string[];
  templateType?: EmailTemplateType;
  customSubject?: string;
  customMessage?: string;
  recipientsData?: EmailRecipientInfo[];
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body: SendEmailRequestBody = await request.json();
    const {
      participantIds = [],
      registrationIds = [],
      templateType = "CONFIRMATION",
      customSubject,
      customMessage,
      recipientsData = [],
    } = body;

    const settings = await getEmailSettings();

    const templateDef =
      EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === templateType) ||
      EMAIL_TEMPLATE_DEFINITIONS[0];

    const baseSubject = customSubject || templateDef.defaultSubject;
    const baseTextBody = customMessage || templateDef.plainText;

    // 1. Resolve recipients
    const recipientsToProcess: EmailRecipientInfo[] = [];

    if (recipientsData && recipientsData.length > 0) {
      recipientsToProcess.push(...recipientsData);
    } else {
      let queryRegIds = [...registrationIds];

      if (participantIds.length > 0) {
        const { data: matchedParts } = await supabase
          .from("participants")
          .select("registration_id")
          .in("id", participantIds);

        if (matchedParts) {
          queryRegIds.push(...matchedParts.map((p: any) => p.registration_id));
        }
      }

      queryRegIds = Array.from(new Set(queryRegIds.filter(Boolean)));

      if (queryRegIds.length === 0) {
        return NextResponse.json(
          { success: false, message: "No valid participants or registrations specified." },
          { status: 400 }
        );
      }

      const { data: regs } = await supabase
        .from("registrations")
        .select("*")
        .in("id", queryRegIds);

      const { data: parts } = await supabase
        .from("participants")
        .select("*")
        .in("registration_id", queryRegIds);

      const { data: events } = await supabase
        .from("events")
        .select("id, title, slug, category");

      const eventsMap = new Map((events || []).map((e: any) => [e.id, e]));
      const partsByRegId: Record<string, any[]> = {};
      (parts || []).forEach((p: any) => {
        if (!partsByRegId[p.registration_id]) partsByRegId[p.registration_id] = [];
        partsByRegId[p.registration_id].push(p);
      });

      (regs || []).forEach((r: any) => {
        const regParts = partsByRegId[r.id] || [];
        const techEv = eventsMap.get(r.technical_event_id);
        const nonTechEv = eventsMap.get(r.non_technical_event_id);

        regParts.forEach((p: any) => {
          if (participantIds.length > 0 && !participantIds.includes(p.id)) {
            return;
          }

          recipientsToProcess.push({
            participantId: p.id,
            registrationId: r.id,
            registrationCode: r.registration_code || "SPK-2K26-PASS",
            name: p.full_name || "Participant",
            email: p.email || "",
            phone: p.phone || "",
            college: p.college || "",
            department: p.department || "ECE",
            teamName: r.team_name,
            paymentStatus: r.payment_status || "UNPAID",
            foodPreference: p.food_preference || "Veg",
            technicalEventTitle: techEv?.title || "Technical Event",
            nonTechnicalEventTitle: nonTechEv?.title || "Non-Technical Event",
            technicalEventSlug: techEv?.slug,
            nonTechnicalEventSlug: nonTechEv?.slug,
          });
        });
      });
    }

    if (recipientsToProcess.length === 0) {
      return NextResponse.json(
        { success: false, message: "No matching recipient records found in database." },
        { status: 404 }
      );
    }

    // 2. Dispatch emails with rate-limiting
    const results: Array<{
      recipientName: string;
      recipientEmail: string;
      registrationCode: string;
      status: "Sent" | "Failed";
      messageId?: string;
      error?: string;
      subject: string;
    }> = [];

    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipientsToProcess.length; i++) {
      const recipient = recipientsToProcess[i];

      const personalizedSubject = interpolateVariables(baseSubject, recipient, settings);
      const personalizedText = interpolateVariables(baseTextBody, recipient, settings);
      const personalizedHtml = generateHtmlEmail({
        recipient,
        settings,
        subject: personalizedSubject,
        contentBodyText: personalizedText,
      });

      let dispatchResult;
      try {
        dispatchResult = await sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html: personalizedHtml,
          text: personalizedText,
        });
      } catch (sendErr: any) {
        dispatchResult = {
          success: false,
          configured: true,
          status: "Failed" as const,
          error: sendErr.message || "Failed to dispatch email",
        };
      }

      const status = dispatchResult.success ? "Sent" : "Failed";
      if (dispatchResult.success) {
        sentCount++;
      } else {
        failedCount++;
      }

      // Record in Supabase email_messages
      try {
        await supabase.from("email_messages").insert({
          registration_id: recipient.registrationId || null,
          recipient_name: recipient.name,
          recipient_email: recipient.email,
          subject: personalizedSubject,
          message_content: personalizedText,
          template_name: templateType,
          status: status,
          provider_message_id: dispatchResult.messageId || null,
          error_message: dispatchResult.error || null,
          sent_at: dispatchResult.success ? new Date().toISOString() : null,
        });
      } catch (logErr) {
        console.warn("Could not write to email_messages in Supabase:", logErr);
      }

      results.push({
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        registrationCode: recipient.registrationCode,
        status: status,
        messageId: dispatchResult.messageId,
        error: dispatchResult.error,
        subject: personalizedSubject,
      });

      if (i < recipientsToProcess.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    return NextResponse.json({
      success: true,
      total: recipientsToProcess.length,
      sentCount,
      failedCount,
      results,
    });
  } catch (error: any) {
    console.error("Email send route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process email request" },
      { status: 500 }
    );
  }
}
