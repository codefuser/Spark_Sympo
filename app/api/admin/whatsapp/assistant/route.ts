import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { getWhatsAppSettings } from "@/lib/whatsapp/settings";
import {
  interpolateVariables,
  TEMPLATE_DEFINITIONS,
} from "@/lib/whatsapp/templateEngine";
import { RecipientInfo, WhatsAppTemplateType } from "@/types/whatsapp";

export const dynamic = "force-dynamic";

/**
 * AI Assistant Secure Tool Execution Endpoint
 * Exposes controlled tools without leaking credentials.
 */

// Tool 1: getParticipant
async function getParticipant(query: string): Promise<RecipientInfo[]> {
  const cleanQuery = query.trim().toLowerCase();
  const { data: parts } = await supabase
    .from("participants")
    .select("*, registration:registrations(*)")
    .or(`full_name.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,phone.ilike.%${cleanQuery}%`)
    .limit(10);

  if (!parts || parts.length === 0) return [];

  const { data: events } = await supabase.from("events").select("id, title, slug");
  const eventsMap = new Map((events || []).map((e: any) => [e.id, e]));

  return parts.map((p: any) => {
    const reg = p.registration || {};
    const tech = eventsMap.get(reg.technical_event_id);
    const nonTech = eventsMap.get(reg.non_technical_event_id);

    return {
      participantId: p.id,
      registrationId: reg.id || p.registration_id,
      registrationCode: reg.registration_code || "SPK-2K26-PASS",
      name: p.full_name,
      phone: p.phone,
      email: p.email,
      college: p.college,
      department: p.department || "ECE",
      teamName: reg.team_name,
      paymentStatus: reg.payment_status || "UNPAID",
      foodPreference: p.food_preference || "Veg",
      technicalEventTitle: tech?.title,
      nonTechnicalEventTitle: nonTech?.title,
      technicalEventSlug: tech?.slug,
      nonTechnicalEventSlug: nonTech?.slug,
    };
  });
}

// Tool 2: getParticipantsByEvent
async function getParticipantsByEvent(eventQuery: string): Promise<{ eventTitle: string; count: number; recipients: RecipientInfo[] }> {
  const clean = eventQuery.trim().toLowerCase();

  // Find event
  const { data: events } = await supabase.from("events").select("id, title, slug, category");
  const allEvents = events || [];

  const matchedEvent = allEvents.find(
    (e: any) =>
      e.title.toLowerCase().includes(clean) ||
      e.slug.toLowerCase().includes(clean) ||
      (clean.includes("quiz") && e.title.toLowerCase().includes("quiz")) ||
      (clean.includes("paper") && e.title.toLowerCase().includes("paper")) ||
      (clean.includes("project") && e.title.toLowerCase().includes("project"))
  );

  const eventId = matchedEvent?.id;
  const eventTitle = matchedEvent?.title || eventQuery;

  let regQuery = supabase.from("registrations").select("id, registration_code, technical_event_id, non_technical_event_id, team_name, payment_status");
  if (eventId) {
    regQuery = regQuery.or(`technical_event_id.eq.${eventId},non_technical_event_id.eq.${eventId}`);
  }

  const { data: regs } = await regQuery;
  const regIds = (regs || []).map((r: any) => r.id);

  if (regIds.length === 0) {
    return { eventTitle, count: 0, recipients: [] };
  }

  const { data: parts } = await supabase
    .from("participants")
    .select("*")
    .in("registration_id", regIds);

  const eventsMap = new Map(allEvents.map((e: any) => [e.id, e]));
  const regsMap = new Map((regs || []).map((r: any) => [r.id, r]));

  const recipients: RecipientInfo[] = (parts || []).map((p: any) => {
    const reg = regsMap.get(p.registration_id) || {};
    const tech = eventsMap.get(reg.technical_event_id);
    const nonTech = eventsMap.get(reg.non_technical_event_id);

    return {
      participantId: p.id,
      registrationId: reg.id || p.registration_id,
      registrationCode: reg.registration_code || "SPK-2K26-PASS",
      name: p.full_name,
      phone: p.phone,
      email: p.email,
      college: p.college,
      department: p.department || "ECE",
      teamName: reg.team_name,
      paymentStatus: reg.payment_status || "UNPAID",
      foodPreference: p.food_preference || "Veg",
      technicalEventTitle: tech?.title,
      nonTechnicalEventTitle: nonTech?.title,
      technicalEventSlug: tech?.slug,
      nonTechnicalEventSlug: nonTech?.slug,
    };
  });

  return {
    eventTitle,
    count: recipients.length,
    recipients,
  };
}

// Tool 3: getMessageStatus
async function getMessageStatus(recipientQuery: string): Promise<any> {
  const { data: msgs } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .or(`recipient_name.ilike.%${recipientQuery}%,recipient_phone.ilike.%${recipientQuery}%`)
    .order("created_at", { ascending: false })
    .limit(5);

  return msgs || [];
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, query, eventName, templateType = "CONFIRMATION" } = body;

    const settings = await getWhatsAppSettings();

    // Tool: Search Participant
    if (action === "getParticipant") {
      const participants = await getParticipant(query || "");
      return NextResponse.json({ success: true, participants });
    }

    // Tool: Get Participants by Event
    if (action === "getParticipantsByEvent") {
      const result = await getParticipantsByEvent(eventName || query || "");
      return NextResponse.json({ success: true, ...result });
    }

    // Tool: Check Message Status
    if (action === "getMessageStatus") {
      const statusLogs = await getMessageStatus(query || "");
      return NextResponse.json({ success: true, statusLogs });
    }

    // High-Level Natural Language Assistant Parsing
    if (action === "parseCommand" || action === "ask") {
      const userPrompt = (query || "").trim().toLowerCase();

      // 1. Check for Quiz request
      if (userPrompt.includes("quiz")) {
        const result = await getParticipantsByEvent("Technical Quiz");
        const template = TEMPLATE_DEFINITIONS.find((t) => t.id === "QUIZ")!;
        const samplePreview = result.recipients[0]
          ? interpolateVariables(template.content, result.recipients[0], settings)
          : template.content;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${result.count} participant${result.count === 1 ? "" : "s"} registered for "${result.eventTitle}". Do you want me to send the Quiz information message to all ${result.count}?`,
          recipientCount: result.count,
          targetEvent: result.eventTitle,
          templateType: "QUIZ",
          samplePreview,
          recipients: result.recipients,
          requiresConfirmation: true,
        });
      }

      // 2. Check for Paper Presentation request
      if (userPrompt.includes("paper") || userPrompt.includes("ppt")) {
        const result = await getParticipantsByEvent("Paper Presentation");
        const template = TEMPLATE_DEFINITIONS.find((t) => t.id === "PPT")!;
        const samplePreview = result.recipients[0]
          ? interpolateVariables(template.content, result.recipients[0], settings)
          : template.content;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${result.count} participant${result.count === 1 ? "" : "s"} registered for "${result.eventTitle}". Do you want me to send the Paper Presentation submission guidelines and PPT link to all ${result.count}?`,
          recipientCount: result.count,
          targetEvent: result.eventTitle,
          templateType: "PPT",
          samplePreview,
          recipients: result.recipients,
          requiresConfirmation: true,
        });
      }

      // 3. Check for Venue / Location request
      if (userPrompt.includes("venue") || userPrompt.includes("location") || userPrompt.includes("map")) {
        // All registered participants
        const { data: parts } = await supabase.from("participants").select("*, registration:registrations(*)");
        const { data: events } = await supabase.from("events").select("id, title, slug");
        const eventsMap = new Map((events || []).map((e: any) => [e.id, e]));

        const recipients: RecipientInfo[] = (parts || []).map((p: any) => {
          const reg = p.registration || {};
          return {
            participantId: p.id,
            registrationId: reg.id || p.registration_id,
            registrationCode: reg.registration_code || "SPK-2K26-PASS",
            name: p.full_name,
            phone: p.phone,
            email: p.email,
            college: p.college,
            department: p.department || "ECE",
            teamName: reg.team_name,
            paymentStatus: reg.payment_status || "UNPAID",
            foodPreference: p.food_preference || "Veg",
            technicalEventTitle: eventsMap.get(reg.technical_event_id)?.title,
            nonTechnicalEventTitle: eventsMap.get(reg.non_technical_event_id)?.title,
          };
        });

        const template = TEMPLATE_DEFINITIONS.find((t) => t.id === "VENUE")!;
        const samplePreview = recipients[0]
          ? interpolateVariables(template.content, recipients[0], settings)
          : template.content;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${recipients.length} total registered participant${recipients.length === 1 ? "" : "s"}. Do you want me to send the Venue Location & Google Maps link to all ${recipients.length}?`,
          recipientCount: recipients.length,
          targetEvent: "All Registered Participants",
          templateType: "VENUE",
          samplePreview,
          recipients: recipients,
          requiresConfirmation: true,
        });
      }

      // 4. Check for individual search / send request (e.g. "Send registration confirmation to Joseph")
      const nameMatch = userPrompt.replace(/(send|registration|confirmation|message|to|whatsapp|details|pass)/gi, "").trim();
      if (nameMatch.length >= 2) {
        const found = await getParticipant(nameMatch);
        if (found.length > 0) {
          const target = found[0];
          let chosenTemplate: WhatsAppTemplateType = "CONFIRMATION";
          if (userPrompt.includes("payment")) chosenTemplate = "PAYMENT_REMINDER";
          if (userPrompt.includes("reminder")) chosenTemplate = "REMINDER";
          if (userPrompt.includes("venue")) chosenTemplate = "VENUE";

          const templateDef = TEMPLATE_DEFINITIONS.find((t) => t.id === chosenTemplate)!;
          const previewText = interpolateVariables(templateDef.content, target, settings);

          return NextResponse.json({
            success: true,
            type: "INDIVIDUAL_PROPOSAL",
            message: `Found participant: **${target.name}** (${target.phone} • ${target.college}). Ready to send ${templateDef.label}.`,
            recipient: target,
            templateType: chosenTemplate,
            samplePreview: previewText,
            requiresConfirmation: true,
          });
        }
      }

      // Default fallback guidance
      return NextResponse.json({
        success: true,
        type: "INFO",
        message: `I can help you send WhatsApp notifications! Try asking:
• *"Send the quiz link to everyone registered for Technical Quiz"*
• *"Send registration confirmation to Joseph"*
• *"Send venue location to all registered participants"*
• *"Send PPT submission link to Paper Presentation teams"*`,
        requiresConfirmation: false,
      });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Assistant error" },
      { status: 500 }
    );
  }
}
