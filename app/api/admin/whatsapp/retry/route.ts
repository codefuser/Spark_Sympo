import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/metaClient";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageIds = [] } = body;

    if (!messageIds || messageIds.length === 0) {
      return NextResponse.json({ success: false, message: "No message IDs specified to retry" }, { status: 400 });
    }

    const { data: messages, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .in("id", messageIds);

    if (error || !messages || messages.length === 0) {
      return NextResponse.json({ success: false, message: "No matching messages found to retry" }, { status: 404 });
    }

    let retriedSuccess = 0;
    let retriedFailed = 0;
    const results: Array<{ id: string; status: string; error?: string }> = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      const res = await sendWhatsAppTextMessage({
        to: msg.recipient_phone,
        body: msg.message_content,
      });

      const newStatus = res.success ? "Sent" : "Failed";
      if (res.success) {
        retriedSuccess++;
      } else {
        retriedFailed++;
      }

      await supabase
        .from("whatsapp_messages")
        .update({
          status: newStatus,
          provider_message_id: res.messageId || msg.provider_message_id,
          error_message: res.error || null,
          sent_at: res.success ? new Date().toISOString() : msg.sent_at,
        })
        .eq("id", msg.id);

      results.push({
        id: msg.id,
        status: newStatus,
        error: res.error,
      });

      if (i < messages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    return NextResponse.json({
      success: true,
      totalRetried: messages.length,
      retriedSuccess,
      retriedFailed,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retry messages" },
      { status: 500 }
    );
  }
}
