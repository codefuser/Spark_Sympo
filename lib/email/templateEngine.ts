import { EmailRecipientInfo, EmailSettings, EmailTemplateType } from "@/types/email";

export interface EmailTemplateDefinition {
  id: EmailTemplateType;
  label: string;
  description: string;
  defaultSubject: string;
  plainText: string;
}

export const EMAIL_TEMPLATE_DEFINITIONS: EmailTemplateDefinition[] = [
  {
    id: "CONFIRMATION",
    label: "Registration Confirmation",
    description: "Official registration pass confirmation with roster, event links, and venue directions",
    defaultSubject: "SPARKTRON 2K26 Registration Confirmed - {{pass_code}}",
    plainText: `Hello {{name}},

Thank you for registering for SPARKTRON 2K26.

Your registration has been successfully completed.

Registration Details

Registration ID:
{{pass_code}}

Name:
{{name}}

Email:
{{email}}

College:
{{college}}

Department:
{{department}}

Registered Events:
{{events}}

Payment Status:
{{payment_status}}

Food Preference:
{{food_type}}

Event Information:
{{event_links}}

Venue:
{{venue_name}}

Address:
{{venue_address}}

Google Maps:
{{map_link}}

Thank you for joining SPARKTRON 2K26.

Regards,
SPARKTRON 2K26
ECE Department
Thamirabharani Engineering College`,
  },
  {
    id: "QUIZ",
    label: "Quiz Information",
    description: "Technical Quiz instructions, pass code access, and portal link",
    defaultSubject: "SPARKTRON 2K26 Technical Quiz — Instructions & Portal Access",
    plainText: `Hello {{name}},

Here is your portal link and access instructions for the SPARKTRON 2K26 Technical Quiz:

Pass Code: {{pass_code}}
Registered Events: {{events}}

Quiz Portal:
{{quiz_link}}

📌 Instructions:
1. Access the quiz portal during the official morning slot.
2. Enter your Pass Code ({{pass_code}}) to verify your team eligibility.
3. Stable internet connection is recommended.

Venue: {{venue_name}}
Location: {{map_link}}

Best of luck!

Regards,
SPARKTRON 2K26 Quiz Committee
Thamirabharani Engineering College`,
  },
  {
    id: "PPT",
    label: "Paper Presentation Information",
    description: "PPT submission guidelines, abstract link, and schedule",
    defaultSubject: "SPARKTRON 2K26 Paper Presentation — PPT Submission Guidelines",
    plainText: `Hello {{name}},

Thank you for registering for Paper Presentation at SPARKTRON 2K26.

Pass Code: {{pass_code}}
College: {{college}}

📤 Upload Your PPT & Abstract:
{{ppt_upload_link}}

📌 Important Guidelines:
1. Submit your presentation slides and abstract prior to the symposium day.
2. Presentation Time: 8 minutes talk + 2 minutes Q&A.
3. Carry your slides on a USB drive as an offline backup.

📍 Venue: {{venue_name}}
Address: {{venue_address}}
Maps: {{map_link}}

We look forward to your presentation!

Regards,
SPARKTRON 2K26 Technical Committee`,
  },
  {
    id: "PROJECT_EXPO",
    label: "Project Expo Information",
    description: "Project Expo prototype setup instructions and synopsis submission",
    defaultSubject: "SPARKTRON 2K26 Project Expo — Booth Details & Submission",
    plainText: `Hello {{name}},

Your team is confirmed for the Project Expo at SPARKTRON 2K26.

Pass Code: {{pass_code}}
Team / Participant: {{name}}

📤 Project Synopsis & Details Upload:
{{project_link}}

📌 Guidelines:
1. Working hardware prototype or live simulation model required.
2. Project display chart/banner for display booth (A1/A2 size).
3. Teams will be allocated demo booths at the campus venue.

📍 Venue: {{venue_name}}
Maps: {{map_link}}

Regards,
SPARKTRON 2K26 Project Expo Committee`,
  },
  {
    id: "REMINDER",
    label: "Event Reminder",
    description: "Symposium reporting time, pass code verification, and venue reminder",
    defaultSubject: "Reminder: SPARKTRON 2K26 is Approaching! — {{pass_code}}",
    plainText: `Hello {{name}},

This is a reminder that SPARKTRON 2K26 is scheduled soon!

Your Registration Pass Code: {{pass_code}}
Registered Events:
{{events}}

📍 Venue:
{{venue_name}}
Address: {{venue_address}}
Google Maps: {{map_link}}

Please report at the Registration Spot Desk by 09:00 AM with your digital pass code for badge collection.

Regards,
SPARKTRON 2K26 Organizing Committee`,
  },
  {
    id: "PAYMENT_REMINDER",
    label: "Payment Reminder",
    description: "Payment verification reminder for participants with UNPAID or PENDING status",
    defaultSubject: "Action Required: Complete Registration Payment for SPARKTRON 2K26",
    plainText: `Hello {{name}},

We noticed that your registration payment for SPARKTRON 2K26 is currently {{payment_status}}.

Pass Code: {{pass_code}}
Registered Events:
{{events}}

Please complete your payment verification at the offline spot desk or submit your transaction ID online to finalize your pass.

If you have already made the payment, please show your receipt at the Spot Desk. Thank you!

Regards,
SPARKTRON 2K26 Registration Desk`,
  },
  {
    id: "VENUE",
    label: "Venue & Location Information",
    description: "Campus address, directions, and clickable Google Maps link",
    defaultSubject: "SPARKTRON 2K26 — Campus Venue & Route Directions",
    plainText: `Hello {{name}},

Here are the campus venue and directions for SPARKTRON 2K26:

🏛️ Venue: {{venue_name}}
📬 Address: {{venue_address}}
🗺️ Google Maps Location:
{{map_link}}

We look forward to welcoming you to our campus!

Regards,
SPARKTRON 2K26 Organizing Team
Thamirabharani Engineering College`,
  },
  {
    id: "ANNOUNCEMENT",
    label: "Important Announcement",
    description: "General symposium broadcast or schedule update",
    defaultSubject: "Important Update from SPARKTRON 2K26 Committee",
    plainText: `Hello {{name}},

Please take note of this important update regarding SPARKTRON 2K26.

Your Pass Code: {{pass_code}}
Registered Events: {{events}}

📍 Venue: {{venue_name}}
🗺️ Location: {{map_link}}

Regards,
SPARKTRON 2K26 Committee`,
  },
  {
    id: "CUSTOM",
    label: "Custom Email",
    description: "Compose custom email body with dynamic variable interpolation",
    defaultSubject: "Update regarding SPARKTRON 2K26",
    plainText: `Hello {{name}},

Write your custom message here...

Registration ID: {{pass_code}}
Venue: {{venue_name}}

Regards,
SPARKTRON 2K26`,
  },
];

/**
 * Resolves event-specific links strictly based on participant's registered events.
 * Returns text version for plain-text fallback.
 */
export function resolveEventLinksText(
  recipient: EmailRecipientInfo,
  settings: EmailSettings
): string {
  const links: string[] = [];
  const tech = (recipient.technicalEventTitle || "").toLowerCase();
  const nonTech = (recipient.nonTechnicalEventTitle || "").toLowerCase();
  const techSlug = (recipient.technicalEventSlug || "").toLowerCase();
  const nonTechSlug = (recipient.nonTechnicalEventSlug || "").toLowerCase();

  const combined = `${tech} ${nonTech} ${techSlug} ${nonTechSlug}`;

  if (combined.includes("quiz")) {
    links.push(`• Technical Quiz:\n  Open Quiz: ${settings.quizLink || "https://sparktron-quiz.vercel.app"}`);
  }

  if (combined.includes("paper") || combined.includes("presentation") || combined.includes("ppt")) {
    links.push(`• Paper Presentation:\n  Upload your PPT: ${settings.pptUploadLink || "https://forms.gle/sparktron2k26ppt"}`);
  }

  if (combined.includes("project") || combined.includes("expo")) {
    links.push(`• Project Expo:\n  Project Submission: ${settings.projectLink || "https://forms.gle/sparktron2k26project"}`);
  }

  if (combined.includes("circuit") || combined.includes("debugging")) {
    const circuitLink = settings.customEventLinks?.["circuit-debugging"] || settings.customEventLinks?.["circuit"];
    if (circuitLink) {
      links.push(`• Circuit Debugging:\n  ${circuitLink}`);
    }
  }

  if (combined.includes("rythemania") || combined.includes("rhythm")) {
    const rythemLink = settings.customEventLinks?.["rythemania"];
    if (rythemLink) {
      links.push(`• Rythemania Track Submission:\n  ${rythemLink}`);
    }
  }

  if (combined.includes("e-sport") || combined.includes("esport") || combined.includes("gaming")) {
    const esportsLink = settings.customEventLinks?.["e-sports"] || settings.customEventLinks?.["esports"];
    if (esportsLink) {
      links.push(`• E-Sports Tournament Room:\n  ${esportsLink}`);
    }
  }

  if (links.length === 0) {
    return "Event details will be briefed at the venue during morning orientation.";
  }

  return links.join("\n\n");
}

/**
 * Resolves event-specific links as styled HTML boxes.
 */
export function resolveEventLinksHtml(
  recipient: EmailRecipientInfo,
  settings: EmailSettings
): string {
  const cards: string[] = [];
  const tech = (recipient.technicalEventTitle || "").toLowerCase();
  const nonTech = (recipient.nonTechnicalEventTitle || "").toLowerCase();
  const techSlug = (recipient.technicalEventSlug || "").toLowerCase();
  const nonTechSlug = (recipient.nonTechnicalEventSlug || "").toLowerCase();

  const combined = `${tech} ${nonTech} ${techSlug} ${nonTechSlug}`;

  if (combined.includes("quiz")) {
    const qUrl = settings.quizLink || "https://sparktron-quiz.vercel.app";
    cards.push(`
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 14px; margin-bottom: 12px; border-radius: 8px;">
        <div style="font-weight: 700; color: #166534; font-size: 14px; margin-bottom: 4px;">🧠 Technical Quiz</div>
        <div style="font-size: 13px; color: #374151; margin-bottom: 8px;">Access the official quiz portal using your Pass Code.</div>
        <a href="${qUrl}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 700; font-size: 12px; padding: 6px 14px; text-decoration: none; border-radius: 6px;">Open Quiz Portal &rarr;</a>
      </div>
    `);
  }

  if (combined.includes("paper") || combined.includes("presentation") || combined.includes("ppt")) {
    const pUrl = settings.pptUploadLink || "https://forms.gle/sparktron2k26ppt";
    cards.push(`
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 14px; margin-bottom: 12px; border-radius: 8px;">
        <div style="font-weight: 700; color: #1e40af; font-size: 14px; margin-bottom: 4px;">📑 Paper Presentation</div>
        <div style="font-size: 13px; color: #374151; margin-bottom: 8px;">Upload your presentation slides (PPT/PDF) and abstract prior to event day.</div>
        <a href="${pUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 12px; padding: 6px 14px; text-decoration: none; border-radius: 6px;">Upload Your PPT &rarr;</a>
      </div>
    `);
  }

  if (combined.includes("project") || combined.includes("expo")) {
    const projUrl = settings.projectLink || "https://forms.gle/sparktron2k26project";
    cards.push(`
      <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-left: 4px solid #9333ea; padding: 14px; margin-bottom: 12px; border-radius: 8px;">
        <div style="font-weight: 700; color: #6b21a8; font-size: 14px; margin-bottom: 4px;">🔬 Project Expo</div>
        <div style="font-size: 13px; color: #374151; margin-bottom: 8px;">Submit your hardware prototype synopsis and team roster.</div>
        <a href="${projUrl}" target="_blank" style="display: inline-block; background-color: #9333ea; color: #ffffff; font-weight: 700; font-size: 12px; padding: 6px 14px; text-decoration: none; border-radius: 6px;">Project Submission &rarr;</a>
      </div>
    `);
  }

  if (cards.length === 0) {
    return `<p style="font-size: 13px; color: #6b7280; font-style: italic;">Event instructions will be provided at the registration desk on the event day.</p>`;
  }

  return cards.join("\n");
}

/**
 * Formats registered events as a bulleted string.
 */
export function formatRegisteredEvents(recipient: EmailRecipientInfo): string {
  const eventsList: string[] = [];
  if (recipient.technicalEventTitle) {
    eventsList.push(`• ${recipient.technicalEventTitle} (Technical)`);
  }
  if (recipient.nonTechnicalEventTitle) {
    eventsList.push(`• ${recipient.nonTechnicalEventTitle} (Non-Technical)`);
  }
  return eventsList.length > 0 ? eventsList.join("\n") : "• General Symposium Track";
}

/**
 * Replaces all dynamic variable tags in text with actual participant data.
 */
export function interpolateVariables(
  templateText: string,
  recipient: EmailRecipientInfo,
  settings: EmailSettings
): string {
  const eventsFormatted = formatRegisteredEvents(recipient);
  const eventLinksFormatted = resolveEventLinksText(recipient, settings);

  const variables: Record<string, string> = {
    "{{name}}": recipient.name || "Participant",
    "{{email}}": recipient.email || "",
    "{{phone}}": recipient.phone || "",
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
    "{{venue_name}}": settings.venueName || "Thamirabharani Engineering College",
    "{{venue_address}}": settings.venueAddress || "ECE Block Auditorium & Labs, College Campus, Tirunelveli",
    "{{map_link}}": settings.mapLink || "https://maps.google.com/?q=Thamirabharani+Engineering+College",
    "{{event_links}}": eventLinksFormatted,
  };

  let rendered = templateText;
  for (const [tag, value] of Object.entries(variables)) {
    rendered = rendered.split(tag).join(value);
  }

  return rendered;
}

/**
 * Generates an attractive, responsive HTML email template for SPARKTRON 2K26.
 * Works cleanly in Gmail, Apple Mail, Outlook, and mobile clients.
 */
export function generateHtmlEmail({
  recipient,
  settings,
  subject,
  contentBodyText,
}: {
  recipient: EmailRecipientInfo;
  settings: EmailSettings;
  subject: string;
  contentBodyText: string;
}): string {
  const eventLinksHtml = resolveEventLinksHtml(recipient, settings);
  const eventsBulletHtml = formatRegisteredEvents(recipient)
    .split("\n")
    .map((e) => `<li style="margin-bottom: 4px;">${e.replace(/^•\s*/, "")}</li>`)
    .join("");

  const formattedBodyParagraphs = contentBodyText
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 12px 0; line-height: 1.6; color: #374151;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #090d16 0%, #002b4d 50%, #0072ff 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; font-family: monospace; font-weight: 800; font-size: 11px; letter-spacing: 2px; color: #00f0ff; background: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.4); padding: 4px 12px; border-radius: 9999px; margin-bottom: 10px; text-transform: uppercase;">
                National Level Technical Symposium
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                SPARKTRON 2K26
              </h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">
                Department of Electronics & Communication Engineering
              </p>
            </td>
          </tr>

          <!-- Pass Code Highlight Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 14px 24px; text-align: center; border-bottom: 2px solid #00f0ff;">
              <span style="font-size: 11px; color: #94a3b8; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">Registration Pass Code:</span>
              <span style="display: inline-block; margin-left: 8px; font-family: monospace; font-size: 16px; font-weight: 800; color: #00f0ff;">
                ${recipient.registrationCode}
              </span>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 28px 24px;">
              ${
                !contentBodyText.trim().toLowerCase().startsWith("hello") &&
                !contentBodyText.trim().toLowerCase().startsWith("hi") &&
                !contentBodyText.trim().toLowerCase().startsWith("dear")
                  ? `<h2 style="margin: 0 0 14px 0; color: #0f172a; font-size: 18px; font-weight: 700;">Hello ${recipient.name},</h2>`
                  : ""
              }

              <!-- Custom Body Paragraphs -->
              <div style="font-size: 14px; color: #374151;">
                ${formattedBodyParagraphs}
              </div>

              <!-- Participant Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-weight: 700; font-size: 13px; color: #0f172a;">
                    📋 Registration Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px; font-size: 13px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="4">
                      <tr>
                        <td width="38%" style="color: #64748b; font-weight: 600;">Registration ID:</td>
                        <td style="color: #0f172a; font-weight: 700; font-family: monospace;">${recipient.registrationCode}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Participant Name:</td>
                        <td style="color: #0f172a; font-weight: 600;">${recipient.name}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Email:</td>
                        <td style="color: #0f172a;">${recipient.email}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">College:</td>
                        <td style="color: #0f172a;">${recipient.college}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Department:</td>
                        <td style="color: #0f172a;">${recipient.department}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Payment Status:</td>
                        <td>
                          <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: monospace; ${
                            recipient.paymentStatus === "PAID"
                              ? "background-color: #dcfce7; color: #15803d;"
                              : "background-color: #fee2e2; color: #b91c1c;"
                          }">
                            ${recipient.paymentStatus === "PAID" ? "PAID ✓" : "UNPAID / PENDING"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Food Preference:</td>
                        <td style="color: #0f172a;">${recipient.foodPreference}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Registered Events -->
              <div style="margin: 20px 0;">
                <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">
                  🎯 Registered Event Tracks:
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151;">
                  ${eventsBulletHtml}
                </ul>
              </div>

              <!-- Event-Specific Action Links -->
              <div style="margin: 22px 0;">
                <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700;">
                  ⚡ Your Event Links & Action Items:
                </h3>
                ${eventLinksHtml}
              </div>

              <!-- Venue Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-weight: 700; color: #0369a1; font-size: 14px; margin-bottom: 4px;">
                      📍 Venue & Location
                    </div>
                    <div style="font-size: 13px; color: #0f172a; font-weight: 600; margin-bottom: 2px;">
                      ${settings.venueName}
                    </div>
                    <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 10px;">
                      ${settings.venueAddress}
                    </div>
                    <a href="${settings.mapLink}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: 700; font-size: 12px; padding: 7px 16px; text-decoration: none; border-radius: 6px;">
                      🗺️ View on Google Maps &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
                Thank you for joining <strong>SPARKTRON 2K26</strong>. Please bring your digital pass code on event day for verification at the Spot Desk.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 24px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0; font-weight: 700; color: #0f172a;">SPARKTRON 2K26 Organizing Committee</p>
              <p style="margin: 2px 0 0 0;">Department of Electronics and Communication Engineering (ECE)</p>
              <p style="margin: 2px 0 0 0;">Thamirabharani Engineering College</p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #94a3b8;">
                This is an official transactional message regarding your symposium registration.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export const EMAIL_AVAILABLE_VARIABLES = [
  { tag: "{{name}}", description: "Student / Participant Name" },
  { tag: "{{email}}", description: "Student Email Address" },
  { tag: "{{phone}}", description: "Phone Number" },
  { tag: "{{pass_code}}", description: "Unique Registration Pass Code" },
  { tag: "{{college}}", description: "College Name" },
  { tag: "{{department}}", description: "Department (e.g. ECE, CSE)" },
  { tag: "{{events}}", description: "Registered Events Bulleted List" },
  { tag: "{{event_links}}", description: "Event-Specific Portal Links" },
  { tag: "{{payment_status}}", description: "Payment status (PAID / UNPAID)" },
  { tag: "{{food_type}}", description: "Food Preference (Veg / Non-Veg)" },
  { tag: "{{quiz_link}}", description: "Configured Technical Quiz Link" },
  { tag: "{{ppt_upload_link}}", description: "Configured Paper Presentation Link" },
  { tag: "{{project_link}}", description: "Configured Project Expo Link" },
  { tag: "{{venue_name}}", description: "Campus Venue Name" },
  { tag: "{{venue_address}}", description: "Campus Venue Address" },
  { tag: "{{map_link}}", description: "Clickable Google Maps URL" },
];
