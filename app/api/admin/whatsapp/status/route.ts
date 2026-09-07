import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { getWhatsAppConfig } from "@/lib/whatsapp/metaClient";
import { supabase } from "@/lib/database/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const config = getWhatsAppConfig();

    let totalSent = 0;
    let totalFailed = 0;
    let totalPending = 0;
    let totalMessages = 0;

    try {
      const { data: messages, error } = await supabase
        .from("whatsapp_messages")
        .select("status");

      if (!error && messages) {
        totalMessages = messages.length;
        totalSent = messages.filter((m) => m.status === "Sent" || m.status === "Delivered" || m.status === "Read").length;
        totalFailed = messages.filter((m) => m.status === "Failed").length;
        totalPending = messages.filter((m) => m.status === "Pending" || m.status === "Sending").length;
      }
    } catch (dbErr) {
      console.warn("Could not query whatsapp_messages counts:", dbErr);
    }

    return NextResponse.json({
      success: true,
      config: {
        isConfigured: config.isConfigured,
        missingVars: config.missingVars,
        phoneNumberId: config.phoneNumberId ? `...${config.phoneNumberId.slice(-4)}` : undefined,
        businessAccountId: config.businessAccountId ? `...${config.businessAccountId.slice(-4)}` : undefined,
        apiUrl: config.apiUrl,
        totalMessages,
        totalSent,
        totalFailed,
        totalPending,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch status" },
      { status: 500 }
    );
  }
}
