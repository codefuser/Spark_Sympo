import { RecipientInfo, WhatsAppSettings, WhatsAppTemplateType } from "@/types/whatsapp";

export interface TemplateDefinition {
  id: WhatsAppTemplateType;
  label: string;
  description: string;
  content: string;
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: "CONFIRMATION",
    label: "Registration Confirmation",
    description: "Official registration pass confirmation with registered events and venue details",
    content: `🎉 SPARKTRON 2K26

Hi {{name}}!

Your registration for SPARKTRON 2K26 has been successfully completed. ✅

Registration ID:
{{pass_code}}

Your Registered Events:
{{events}}

College:
{{college}}

Department:
{{department}}

Event Links:
{{event_links}}

📍 Venue:
{{venue_name}}

🗺️ Location:
{{map_link}}

Thank you for registering for SPARKTRON 2K26! ❤️`,
  },
  {
    id: "QUIZ",
    label: "Quiz Information",
    description: "Technical Quiz portal link, pass code and participation rules",
    content: `🧠 SPARKTRON 2K26 — Technical Quiz

Hi {{name}}!

Here is your portal link and access details for the Technical Quiz:

Pass Code: {{pass_code}}
🔗 Quiz Portal: {{quiz_link}}

📌 Instructions:
1. Access the quiz portal during the official time window.
2. Enter your Pass Code ({{pass_code}}) to verify your eligibility.
3. Stable internet connection is recommended.

Best of luck! 🏆`,
  },
  {
    id: "PPT",
    label: "Paper Presentation Information",
    description: "PPT submission link, guidelines and schedule",
    content: `📑 SPARKTRON 2K26 — Paper Presentation

Hi {{name}}!

Thank you for registering for Paper Presentation at SPARKTRON 2K26.

Pass Code: {{pass_code}}
📤 PPT & Abstract Upload Link:
{{ppt_upload_link}}

📌 Important Guidelines:
1. Upload your slides and abstract prior to event day.
2. Presentation Time: 8 minutes talk + 2 minutes Q&A.
3. Bring your slides on a USB drive as a backup.

📍 Venue: {{venue_name}}
🗺️ Location: {{map_link}}

We look forward to your innovative paper! 💡`,
  },
  {
    id: "PROJECT_EXPO",
    label: "Project Expo Information",
    description: "Project Expo prototype setup, synopsis link and display details",
    content: `🔬 SPARKTRON 2K26 — Project Expo

Hi {{name}}!

Your team is confirmed for Project Expo at SPARKTRON 2K26.

Pass Code: {{pass_code}}
📤 Project Details & Synopsis Upload:
{{project_link}}

📌 Guidelines:
1. Working hardware prototype or live simulation model required.
2. Chart / banner for display booth (A1/A2).
3. Teams will be allocated display booths at the venue.

📍 Venue: {{venue_name}}
🗺️ Location: {{map_link}}

Showcase your engineering breakthrough! ⚡`,
  },
  {
    id: "REMINDER",
    label: "Event Reminder",
    description: "Symposium date, reporting time, pass code and venue reminder",
    content: `⏰ SPARKTRON 2K26 — Event Reminder

Hi {{name}}!

This is a reminder that SPARKTRON 2K26 is taking place soon!

Pass Code: {{pass_code}}
Registered Events:
{{events}}

📍 Venue: {{venue_name}}
🗺️ Location: {{map_link}}

Please report at the registration desk by 09:00 AM with your digital pass code for badge collection. See you there! 🚀`,
  },
  {
    id: "PAYMENT_REMINDER",
    label: "Payment Reminder",
    description: "Reminder for participants with pending or unpaid registration status",
    content: `💳 SPARKTRON 2K26 — Payment Verification Reminder

Hi {{name}}!

We noticed that your registration payment for SPARKTRON 2K26 is currently {{payment_status}}.

Pass Code: {{pass_code}}
Registered Events:
{{events}}

Please complete your payment verification at the offline spot desk or submit your transaction ID online to finalize your entry pass.

If you have already paid, please show your receipt at the Spot Desk. Thank you! 🙏`,
  },
  {
    id: "VENUE",
    label: "Venue & Location Information",
    description: "Campus location, auditorium directions and clickable Google Maps link",
    content: `📍 SPARKTRON 2K26 — Venue & Campus Directions

Hi {{name}}!

Here are the venue and route details for SPARKTRON 2K26:

🏛️ Venue: {{venue_name}}
📬 Address: {{venue_address}}

🗺️ Clickable Google Maps Location:
{{map_link}}

We look forward to welcoming you to our campus! 🌟`,
  },
  {
    id: "CUSTOM",
    label: "Custom Message",
    description: "Freely compose any announcement or message using dynamic variables",
    content: `Hi {{name}},

Write your custom message here...

Registration ID: {{pass_code}}
📍 {{venue_name}}`,
  },
];

/**
 * Resolves event-specific links strictly based on participant's registered events.
 * If participant registered for Quiz, include Quiz link.
 * If Paper Presentation, include PPT upload link.
 * If Project Expo, include Project link.
 * If multiple, include all relevant links.
 * Excludes unrelated event links.
 */
export function resolveEventLinks(
  recipient: RecipientInfo,
  settings: WhatsAppSettings
): string {
  const links: string[] = [];
  const tech = (recipient.technicalEventTitle || "").toLowerCase();
  const nonTech = (recipient.nonTechnicalEventTitle || "").toLowerCase();
  const techSlug = (recipient.technicalEventSlug || "").toLowerCase();
  const nonTechSlug = (recipient.nonTechnicalEventSlug || "").toLowerCase();

  const combined = `${tech} ${nonTech} ${techSlug} ${nonTechSlug}`;

  // 1. Technical Quiz Link
  if (combined.includes("quiz")) {
    links.push(`🧠 Quiz:\n${settings.quizLink || "https://sparktron-quiz.vercel.app"}`);
  }

  // 2. Paper Presentation Link
  if (combined.includes("paper") || combined.includes("presentation") || combined.includes("ppt")) {
    links.push(`📑 Paper Presentation:\n${settings.pptUploadLink || "https://forms.gle/sparktron2k26ppt"}`);
  }

  // 3. Project Expo Link
  if (combined.includes("project") || combined.includes("expo")) {
    links.push(`🔬 Project Expo:\n${settings.projectLink || "https://forms.gle/sparktron2k26project"}`);
  }

  // 4. Circuit Debugging Link (if configured)
  if (combined.includes("circuit") || combined.includes("debugging")) {
    const circuitLink = settings.customEventLinks?.["circuit-debugging"] || settings.customEventLinks?.["circuit"];
    if (circuitLink) {
      links.push(`🔌 Circuit Debugging:\n${circuitLink}`);
    }
  }

  // 5. Rythemania Link (if configured)
  if (combined.includes("rythemania") || combined.includes("rhythm")) {
    const rythemLink = settings.customEventLinks?.["rythemania"];
    if (rythemLink) {
      links.push(`🎵 Rythemania Track Submission:\n${rythemLink}`);
    }
  }

  // 6. E-Sports Link (if configured)
  if (combined.includes("e-sport") || combined.includes("esport") || combined.includes("gaming")) {
    const esportsLink = settings.customEventLinks?.["e-sports"] || settings.customEventLinks?.["esports"];
    if (esportsLink) {
      links.push(`🎮 E-Sports Tournament Room:\n${esportsLink}`);
    }
  }

  if (links.length === 0) {
    return "Event details will be briefed at the venue during morning orientation.";
  }

  return links.join("\n\n");
}

/**
 * Builds a clean registered events summary string for the participant.
 */
export function formatRegisteredEvents(recipient: RecipientInfo): string {
  const eventsList: string[] = [];
  if (recipient.technicalEventTitle) {
    eventsList.push(`• ${recipient.technicalEventTitle} (Technical)`);
  }
  if (recipient.nonTechnicalEventTitle) {
    eventsList.push(`• ${recipient.nonTechnicalEventTitle} (Non-Technical)`);
  }
  return eventsList.length > 0 ? eventsList.join("\n") : "• Symposium General Track";
}

/**
 * Replaces all dynamic variable tags in the template with genuine participant data.
 */
export function interpolateVariables(
  templateText: string,
  recipient: RecipientInfo,
  settings: WhatsAppSettings
): string {
  const eventsFormatted = formatRegisteredEvents(recipient);
  const eventLinksFormatted = resolveEventLinks(recipient, settings);

  const variables: Record<string, string> = {
    "{{name}}": recipient.name || "Participant",
    "{{phone}}": recipient.phone || "",
    "{{email}}": recipient.email || "",
    "{{college}}": recipient.college || "Engineering College",
    "{{department}}": recipient.department || "ECE",
    "{{pass_code}}": recipient.registrationCode || "SPK-2K26-PASS",
    "{{registration_id}}": recipient.registrationCode || recipient.registrationId || "",
    "{{events}}": eventsFormatted,
    "{{payment_status}}": recipient.paymentStatus || "UNPAID",
    "{{food_type}}": recipient.foodPreference || "Veg",
    "{{quiz_link}}": settings.quizLink || "https://sparktron-quiz.vercel.app",
    "{{ppt_upload_link}}": settings.pptUploadLink || "https://forms.gle/sparktron2k26ppt",
    "{{project_link}}": settings.projectLink || "https://forms.gle/sparktron2k26project",
    "{{venue_name}}": settings.venueName || "St. Joseph's Institute of Technology",
    "{{venue_address}}": settings.venueAddress || "ECE Block Auditorium & Labs, College Campus",
    "{{map_link}}": settings.mapLink || "https://maps.google.com/?q=St.+Joseph%27s+Institute+of+Technology",
    "{{event_links}}": eventLinksFormatted,
  };

  let rendered = templateText;
  for (const [tag, value] of Object.entries(variables)) {
    // Replace all occurrences of the tag
    rendered = rendered.split(tag).join(value);
  }

  return rendered;
}

export const AVAILABLE_VARIABLES = [
  { tag: "{{name}}", description: "Student / Participant Name" },
  { tag: "{{phone}}", description: "Phone Number" },
  { tag: "{{email}}", description: "Student Email" },
  { tag: "{{pass_code}}", description: "Unique Registration Pass Code" },
  { tag: "{{college}}", description: "College Name" },
  { tag: "{{department}}", description: "Department (e.g. ECE, CSE)" },
  { tag: "{{events}}", description: "Registered Events List" },
  { tag: "{{event_links}}", description: "Auto-filtered event specific links" },
  { tag: "{{payment_status}}", description: "Payment status (PAID / UNPAID)" },
  { tag: "{{food_type}}", description: "Food Preference (Veg / Non-Veg)" },
  { tag: "{{quiz_link}}", description: "Configured Technical Quiz link" },
  { tag: "{{ppt_upload_link}}", description: "Configured Paper Presentation upload link" },
  { tag: "{{project_link}}", description: "Configured Project Expo upload link" },
  { tag: "{{venue_name}}", description: "Campus & Auditorium venue name" },
  { tag: "{{venue_address}}", description: "Campus address" },
  { tag: "{{map_link}}", description: "Clickable Google Maps link" },
];
