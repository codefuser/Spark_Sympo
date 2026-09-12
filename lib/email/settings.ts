import { supabase } from "@/lib/database/supabase";
import { EmailSettings } from "@/types/email";

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  id: "default_settings",
  senderName: "SPARKTRON 2K26",
  senderEmail: "hello.sparktron@gmail.com",
  replyToEmail: "hello.sparktron@gmail.com",
  venueName: "Thamirabharani Engineering College",
  venueAddress: "ECE Block Auditorium & Labs, College Campus, Tirunelveli",
  mapLink: "https://maps.google.com/?q=Thamirabharani+Engineering+College",
  latitude: 8.7139,
  longitude: 77.7567,
  quizLink: "https://sparktron-quiz.vercel.app",
  pptUploadLink: "https://forms.gle/sparktron2k26ppt",
  projectLink: "https://forms.gle/sparktron2k26project",
  customEventLinks: {
    "circuit-debugging": "https://forms.gle/sparktron-circuits",
    "rythemania": "https://forms.gle/sparktron-rythemania",
    "e-sports": "https://forms.gle/sparktron-esports",
  },
};

/**
 * Fetches current Email and Venue/Event link settings from Supabase.
 * Gracefully falls back to default settings if table doesn't exist or query fails.
 */
export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    const { data, error } = await supabase
      .from("email_settings")
      .select("*")
      .eq("id", "default_settings")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_EMAIL_SETTINGS;
    }

    return {
      id: data.id || "default_settings",
      senderName: data.sender_name || DEFAULT_EMAIL_SETTINGS.senderName,
      senderEmail: data.sender_email || DEFAULT_EMAIL_SETTINGS.senderEmail,
      replyToEmail: data.reply_to_email || DEFAULT_EMAIL_SETTINGS.replyToEmail,
      venueName: data.venue_name || DEFAULT_EMAIL_SETTINGS.venueName,
      venueAddress: data.venue_address || DEFAULT_EMAIL_SETTINGS.venueAddress,
      mapLink: data.map_link || DEFAULT_EMAIL_SETTINGS.mapLink,
      latitude: data.latitude,
      longitude: data.longitude,
      quizLink: data.quiz_link || DEFAULT_EMAIL_SETTINGS.quizLink,
      pptUploadLink: data.ppt_upload_link || DEFAULT_EMAIL_SETTINGS.pptUploadLink,
      projectLink: data.project_link || DEFAULT_EMAIL_SETTINGS.projectLink,
      customEventLinks:
        typeof data.custom_event_links === "object" && data.custom_event_links !== null
          ? data.custom_event_links
          : DEFAULT_EMAIL_SETTINGS.customEventLinks,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn("Could not fetch email_settings from database, using defaults:", err);
    return DEFAULT_EMAIL_SETTINGS;
  }
}

/**
 * Updates Email and Venue/Event link settings in Supabase.
 */
export async function saveEmailSettings(
  settings: Partial<EmailSettings>
): Promise<{ success: boolean; data?: EmailSettings; error?: string }> {
  try {
    const current = await getEmailSettings();
    const merged = { ...current, ...settings };

    const payload = {
      id: "default_settings",
      sender_name: merged.senderName,
      sender_email: merged.senderEmail,
      reply_to_email: merged.replyToEmail,
      venue_name: merged.venueName,
      venue_address: merged.venueAddress,
      map_link: merged.mapLink,
      latitude: merged.latitude ? Number(merged.latitude) : null,
      longitude: merged.longitude ? Number(merged.longitude) : null,
      quiz_link: merged.quizLink,
      ppt_upload_link: merged.pptUploadLink,
      project_link: merged.projectLink,
      custom_event_links: merged.customEventLinks,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("email_settings")
      .upsert(payload, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data?.id || "default_settings",
        senderName: data?.sender_name,
        senderEmail: data?.sender_email,
        replyToEmail: data?.reply_to_email,
        venueName: data?.venue_name,
        venueAddress: data?.venue_address,
        mapLink: data?.map_link,
        latitude: data?.latitude,
        longitude: data?.longitude,
        quizLink: data?.quiz_link,
        pptUploadLink: data?.ppt_upload_link,
        projectLink: data?.project_link,
        customEventLinks: data?.custom_event_links || {},
        updatedAt: data?.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update settings" };
  }
}
