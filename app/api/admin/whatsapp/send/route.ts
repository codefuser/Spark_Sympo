import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/metaClient";
import { getWhatsAppSettings } from "@/lib/whatsapp/settings";
import {
  interpolateVariables,
  TEMPLATE_DEFINITIONS,
} from "@/lib/whatsapp/templateEngine";
import { RecipientInfo, WhatsAppTemplateType } from "@/types/whatsapp";

export const dynamic = "force-dynamic";

interface SendRequestBody {
  participantIds?: string[];
  registrationIds?: string[];
  templateType?: WhatsAppTemplateType;
  customMessage?: string;
  recipientsData?: RecipientInfo[]; // Direct recipient payload from client if already available
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body: SendRequestBody = await request.json();
    const {
      participantIds = [],
      registrationIds = [],
      templateType = "CONFIRMATION",
      customMessage,
      recipientsData = [],
    } = body;

    // Load current WhatsApp & event link settings
    const settings = await getWhatsAppSettings();

    // Determine the template text to use
    let baseTemplateText = customMessage || "";
    if (!baseTemplateText) {
      const foundTemplate = TEMPLATE_DEFINITIONS.find((t) => t.id === templateType);
      baseTemplateText = foundTemplate ? foundTemplate.content : TEMPLATE_DEFINITIONS[0].content;
    }

    // 1. Gather all recipients
    const recipientsToProcess: RecipientInfo[] = [];

    // If client supplied prepared recipients, use them
    if (recipientsData && recipientsData.length > 0) {
      recipientsToProcess.push(...recipientsData);
    } else {
      // Otherwise query Supabase by participantIds or registrationIds
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
          { success: false, message: "No valid participants or registrations specified to send to." },
          { status: 400 }
        );
      }

      // Fetch registrations and participants from Supabase
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
          // If specific participantIds were requested, filter by them
          if (participantIds.length > 0 && !participantIds.includes(p.id)) {
            return;
          }

          recipientsToProcess.push({
            participantId: p.id,
            registrationId: r.id,
            registrationCode: r.registration_code || "SPK-2K26-PASS",
            name: p.full_name || "Participant",
            phone: p.phone || "",
            email: p.email || "",
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

    // 2. Dispatch messages sequentially with safe delay to protect API limits
    const results: Array<{
      recipientName: string;
      recipientPhone: string;
      registrationCode: string;
      status: "Sent" | "Failed";
      messageId?: string;
      error?: string;
      messageContent: string;
    }> = [];

    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipientsToProcess.length; i++) {
      const recipient = recipientsToProcess[i];

      // Personalize message strictly for this participant
      const personalizedMessage = interpolateVariables(baseTemplateText, recipient, settings);

      let dispatchResult;
      try {
        dispatchResult = await sendWhatsAppTextMessage({
          to: recipient.phone,
          body: personalizedMessage,
        });
      } catch (sendErr: any) {
        dispatchResult = {
          success: false,
          configured: true,
          status: "Failed" as const,
          error: sendErr.message || "Sending failed",
        };
      }

      const status = dispatchResult.success ? "Sent" : "Failed";
      if (dispatchResult.success) {
        sentCount++;
      } else {
        failedCount++;
      }

      // Record in Supabase whatsapp_messages table
      try {
        await supabase.from("whatsapp_messages").insert({
          registration_id: recipient.registrationId || null,
          recipient_name: recipient.name,
          recipient_phone: recipient.phone,
          message_type: templateType,
          message_content: personalizedMessage,
          status: status,
          provider_message_id: dispatchResult.messageId || null,
          error_message: dispatchResult.error || null,
          sent_at: dispatchResult.success ? new Date().toISOString() : null,
        });
      } catch (logErr) {
        console.warn("Could not write to whatsapp_messages in Supabase:", logErr);
      }

      results.push({
        recipientName: recipient.name,
        recipientPhone: recipient.phone,
        registrationCode: recipient.registrationCode,
        status: status,
        messageId: dispatchResult.messageId,
        error: dispatchResult.error,
        messageContent: personalizedMessage,
      });

      // Small delay between calls if multiple recipients (150ms)
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
    console.error("WhatsApp dispatch route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process WhatsApp request" },
      { status: 500 }
    );
  }
}
