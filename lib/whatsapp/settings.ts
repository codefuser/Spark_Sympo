import { supabase } from "@/lib/database/supabase";
import { WhatsAppSettings } from "@/types/whatsapp";

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  id: "default_settings",
  isEnabled: true,
  venueName: "St. Joseph's Institute of Technology",
  venueAddress: "ECE Block Auditorium & Labs, College Campus, OMR, Chennai - 600119",
  mapLink: "https://maps.google.com/?q=St.+Joseph%27s+Institute+of+Technology",
  latitude: 12.8719,
  longitude: 80.2184,
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
 * Fetches current WhatsApp and Venue/Event link settings from Supabase.
 * Gracefully falls back to default settings if the table doesn't exist or error occurs.
 */
export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  try {
    const { data, error } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .eq("id", "default_settings")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_WHATSAPP_SETTINGS;
    }

    return {
      id: data.id || "default_settings",
      isEnabled: data.is_enabled ?? true,
      venueName: data.venue_name || DEFAULT_WHATSAPP_SETTINGS.venueName,
      venueAddress: data.venue_address || DEFAULT_WHATSAPP_SETTINGS.venueAddress,
      mapLink: data.map_link || DEFAULT_WHATSAPP_SETTINGS.mapLink,
      latitude: data.latitude,
      longitude: data.longitude,
      quizLink: data.quiz_link || DEFAULT_WHATSAPP_SETTINGS.quizLink,
      pptUploadLink: data.ppt_upload_link || DEFAULT_WHATSAPP_SETTINGS.pptUploadLink,
      projectLink: data.project_link || DEFAULT_WHATSAPP_SETTINGS.projectLink,
      customEventLinks:
        typeof data.custom_event_links === "object" && data.custom_event_links !== null
          ? data.custom_event_links
          : DEFAULT_WHATSAPP_SETTINGS.customEventLinks,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn("Could not fetch whatsapp_settings from database, using defaults:", err);
    return DEFAULT_WHATSAPP_SETTINGS;
  }
}

/**
 * Updates WhatsApp and Venue/Event link settings in Supabase.
 */
export async function saveWhatsAppSettings(
  settings: Partial<WhatsAppSettings>
): Promise<{ success: boolean; data?: WhatsAppSettings; error?: string }> {
  try {
    const current = await getWhatsAppSettings();
    const merged = { ...current, ...settings };

    const payload = {
      id: "default_settings",
      is_enabled: merged.isEnabled,
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
      .from("whatsapp_settings")
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
        isEnabled: data?.is_enabled ?? true,
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
