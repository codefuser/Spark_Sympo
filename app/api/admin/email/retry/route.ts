import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { sendEmail } from "@/lib/email/emailClient";
import { getEmailSettings } from "@/lib/email/settings";
import { generateHtmlEmail } from "@/lib/email/templateEngine";

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
      return NextResponse.json({ success: false, message: "No email message IDs specified" }, { status: 400 });
    }

    const { data: messages, error } = await supabase
      .from("email_messages")
      .select("*")
      .in("id", messageIds);

    if (error || !messages || messages.length === 0) {
      return NextResponse.json({ success: false, message: "No matching emails found to retry" }, { status: 404 });
    }

    const settings = await getEmailSettings();

    let retriedSuccess = 0;
    let retriedFailed = 0;
    const results: Array<{ id: string; status: string; error?: string }> = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      const htmlBody = generateHtmlEmail({
        recipient: {
          registrationId: msg.registration_id || "",
          registrationCode: "SPK-2K26-PASS",
          name: msg.recipient_name,
          email: msg.recipient_email,
          college: "Engineering College",
          department: "ECE",
          paymentStatus: "CONFIRMED",
          foodPreference: "Veg",
        },
        settings,
        subject: msg.subject,
        contentBodyText: msg.message_content,
      });

      const res = await sendEmail({
        to: msg.recipient_email,
        subject: msg.subject,
        html: htmlBody,
        text: msg.message_content,
      });

      const newStatus = res.success ? "Sent" : "Failed";
      if (res.success) {
        retriedSuccess++;
      } else {
        retriedFailed++;
      }

      await supabase
        .from("email_messages")
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
      { success: false, message: error.message || "Failed to retry emails" },
      { status: 500 }
    );
  }
}
