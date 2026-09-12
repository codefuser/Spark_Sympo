import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { getEmailSettings } from "@/lib/email/settings";
import {
  interpolateVariables,
  EMAIL_TEMPLATE_DEFINITIONS,
} from "@/lib/email/templateEngine";
import { EmailRecipientInfo, EmailTemplateType } from "@/types/email";

export const dynamic = "force-dynamic";

/**
 * AI Assistant Secure Tool Execution Endpoint for Email System
 */

// Tool 1: getParticipant
async function getParticipant(query: string): Promise<EmailRecipientInfo[]> {
  const clean = query.trim().toLowerCase();
  const { data: parts } = await supabase
    .from("participants")
    .select("*, registration:registrations(*)")
    .or(`full_name.ilike.%${clean}%,email.ilike.%${clean}%,phone.ilike.%${clean}%`)
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
      email: p.email,
      phone: p.phone,
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
async function getParticipantsByEvent(eventQuery: string): Promise<{ eventTitle: string; count: number; recipients: EmailRecipientInfo[] }> {
  const clean = eventQuery.trim().toLowerCase();

  const { data: events } = await supabase.from("events").select("id, title, slug");
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

  const recipients: EmailRecipientInfo[] = (parts || []).map((p: any) => {
    const reg = regsMap.get(p.registration_id) || {};
    const tech = eventsMap.get(reg.technical_event_id);
    const nonTech = eventsMap.get(reg.non_technical_event_id);

    return {
      participantId: p.id,
      registrationId: reg.id || p.registration_id,
      registrationCode: reg.registration_code || "SPK-2K26-PASS",
      name: p.full_name,
      email: p.email,
      phone: p.phone,
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

  return { eventTitle, count: recipients.length, recipients };
}

// Tool 3: getParticipantsByPaymentStatus
async function getParticipantsByPaymentStatus(statusQuery: "PAID" | "UNPAID" | "PENDING"): Promise<{ count: number; recipients: EmailRecipientInfo[] }> {
  let regQuery = supabase.from("registrations").select("id, registration_code, technical_event_id, non_technical_event_id, team_name, payment_status");
  if (statusQuery === "PAID") {
    regQuery = regQuery.eq("payment_status", "PAID");
  } else {
    regQuery = regQuery.neq("payment_status", "PAID");
  }

  const { data: regs } = await regQuery;
  const regIds = (regs || []).map((r: any) => r.id);

  if (regIds.length === 0) {
    return { count: 0, recipients: [] };
  }

  const { data: parts } = await supabase
    .from("participants")
    .select("*")
    .in("registration_id", regIds);

  const { data: events } = await supabase.from("events").select("id, title, slug");
  const eventsMap = new Map((events || []).map((e: any) => [e.id, e]));
  const regsMap = new Map((regs || []).map((r: any) => [r.id, r]));

  const recipients: EmailRecipientInfo[] = (parts || []).map((p: any) => {
    const reg = regsMap.get(p.registration_id) || {};
    return {
      participantId: p.id,
      registrationId: reg.id || p.registration_id,
      registrationCode: reg.registration_code || "SPK-2K26-PASS",
      name: p.full_name,
      email: p.email,
      phone: p.phone,
      college: p.college,
      department: p.department || "ECE",
      teamName: reg.team_name,
      paymentStatus: reg.payment_status || "UNPAID",
      foodPreference: p.food_preference || "Veg",
      technicalEventTitle: eventsMap.get(reg.technical_event_id)?.title,
      nonTechnicalEventTitle: eventsMap.get(reg.non_technical_event_id)?.title,
    };
  });

  return { count: recipients.length, recipients };
}

// Tool 4: getEmailStatus
async function getEmailStatus(recipientQuery: string): Promise<any> {
  const { data: msgs } = await supabase
    .from("email_messages")
    .select("*")
    .or(`recipient_name.ilike.%${recipientQuery}%,recipient_email.ilike.%${recipientQuery}%`)
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
    const { action, query, eventName, paymentStatus } = body;

    const settings = await getEmailSettings();

    // Tool Invocation: Search Participant
    if (action === "getParticipant") {
      const participants = await getParticipant(query || "");
      return NextResponse.json({ success: true, participants });
    }

    // Tool Invocation: By Event
    if (action === "getParticipantsByEvent") {
      const result = await getParticipantsByEvent(eventName || query || "");
      return NextResponse.json({ success: true, ...result });
    }

    // Tool Invocation: By Payment Status
    if (action === "getParticipantsByPaymentStatus") {
      const result = await getParticipantsByPaymentStatus(paymentStatus || "UNPAID");
      return NextResponse.json({ success: true, ...result });
    }

    // Tool Invocation: Check Email Status
    if (action === "getEmailStatus") {
      const statusLogs = await getEmailStatus(query || "");
      return NextResponse.json({ success: true, statusLogs });
    }

    // Natural Language Command Parser
    if (action === "parseCommand" || action === "ask") {
      const userPrompt = (query || "").trim().toLowerCase();

      // 1. Quiz Link Command
      if (userPrompt.includes("quiz")) {
        const result = await getParticipantsByEvent("Technical Quiz");
        const template = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === "QUIZ")!;
        const samplePreview = result.recipients[0]
          ? interpolateVariables(template.plainText, result.recipients[0], settings)
          : template.plainText;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${result.count} participant${result.count === 1 ? "" : "s"} registered for "${result.eventTitle}". Do you want me to send the Quiz Information email to all ${result.count} participants?`,
          recipientCount: result.count,
          targetAudience: result.eventTitle,
          templateType: "QUIZ",
          sampleSubject: template.defaultSubject,
          samplePreview,
          recipients: result.recipients,
          requiresConfirmation: true,
        });
      }

      // 2. Paper Presentation Command
      if (userPrompt.includes("paper") || userPrompt.includes("ppt")) {
        const result = await getParticipantsByEvent("Paper Presentation");
        const template = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === "PPT")!;
        const samplePreview = result.recipients[0]
          ? interpolateVariables(template.plainText, result.recipients[0], settings)
          : template.plainText;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${result.count} participant${result.count === 1 ? "" : "s"} registered for "${result.eventTitle}". Do you want me to send the Paper Presentation PPT guidelines email to all ${result.count} participants?`,
          recipientCount: result.count,
          targetAudience: result.eventTitle,
          templateType: "PPT",
          sampleSubject: template.defaultSubject,
          samplePreview,
          recipients: result.recipients,
          requiresConfirmation: true,
        });
      }

      // 3. Payment Reminder Command
      if (userPrompt.includes("payment") || userPrompt.includes("pending") || userPrompt.includes("unpaid")) {
        const result = await getParticipantsByPaymentStatus("UNPAID");
        const template = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === "PAYMENT_REMINDER")!;
        const samplePreview = result.recipients[0]
          ? interpolateVariables(template.plainText, result.recipients[0], settings)
          : template.plainText;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${result.count} participant${result.count === 1 ? "" : "s"} with pending or unpaid payment. Do you want me to send the Payment Reminder email to all ${result.count} participants?`,
          recipientCount: result.count,
          targetAudience: "Pending Payment Participants",
          templateType: "PAYMENT_REMINDER",
          sampleSubject: template.defaultSubject,
          samplePreview,
          recipients: result.recipients,
          requiresConfirmation: true,
        });
      }

      // 4. Venue Location Command
      if (userPrompt.includes("venue") || userPrompt.includes("location") || userPrompt.includes("map")) {
        const { data: parts } = await supabase.from("participants").select("*, registration:registrations(*)");
        const recipients: EmailRecipientInfo[] = (parts || []).map((p: any) => ({
          participantId: p.id,
          registrationId: p.registration?.id || p.registration_id,
          registrationCode: p.registration?.registration_code || "SPK-2K26-PASS",
          name: p.full_name,
          email: p.email,
          phone: p.phone,
          college: p.college,
          department: p.department || "ECE",
          paymentStatus: p.registration?.payment_status || "UNPAID",
          foodPreference: p.food_preference || "Veg",
        }));

        const template = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === "VENUE")!;
        const samplePreview = recipients[0]
          ? interpolateVariables(template.plainText, recipients[0], settings)
          : template.plainText;

        return NextResponse.json({
          success: true,
          type: "BULK_PROPOSAL",
          message: `I found ${recipients.length} total registered participants. Do you want me to send the Venue & Location email to all ${recipients.length} participants?`,
          recipientCount: recipients.length,
          targetAudience: "All Registered Participants",
          templateType: "VENUE",
          sampleSubject: template.defaultSubject,
          samplePreview,
          recipients,
          requiresConfirmation: true,
        });
      }

      // 5. Individual Search/Confirmation Command (e.g. "Send registration confirmation to Joseph")
      const nameCandidate = userPrompt.replace(/(send|registration|confirmation|email|message|to|details|pass)/gi, "").trim();
      if (nameCandidate.length >= 2) {
        const found = await getParticipant(nameCandidate);
        if (found.length > 0) {
          const target = found[0];
          let chosenTemplate: EmailTemplateType = "CONFIRMATION";
          if (userPrompt.includes("payment")) chosenTemplate = "PAYMENT_REMINDER";
          if (userPrompt.includes("reminder")) chosenTemplate = "REMINDER";
          if (userPrompt.includes("venue")) chosenTemplate = "VENUE";

          const templateDef = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === chosenTemplate)!;
          const subject = interpolateVariables(templateDef.defaultSubject, target, settings);
          const samplePreview = interpolateVariables(templateDef.plainText, target, settings);

          return NextResponse.json({
            success: true,
            type: "INDIVIDUAL_PROPOSAL",
            message: `Found participant **${target.name}** (${target.email} • ${target.college}). Ready to send ${templateDef.label}.`,
            recipient: target,
            templateType: chosenTemplate,
            sampleSubject: subject,
            samplePreview,
            requiresConfirmation: true,
          });
        }
      }

      // Fallback
      return NextResponse.json({
        success: true,
        type: "INFO",
        message: `I can help you send emails to symposium participants! Try asking:
• *"Send registration confirmation to Joseph"*
• *"Send the quiz link to everyone registered for Technical Quiz"*
• *"Send venue information to all participants"*
• *"Send payment reminder to everyone who has pending payment"*`,
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
