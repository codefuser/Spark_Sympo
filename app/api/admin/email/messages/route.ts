import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    let dbQuery = supabase
      .from("email_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("status", status);
    }

    if (query && query.trim()) {
      const q = query.trim();
      dbQuery = dbQuery.or(
        `recipient_name.ilike.%${q}%,recipient_email.ilike.%${q}%,subject.ilike.%${q}%,message_content.ilike.%${q}%`
      );
    }

    const { data: messages, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch email history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearFailed = searchParams.get("clearFailed") === "true";

    if (clearFailed) {
      const { error } = await supabase
        .from("email_messages")
        .delete()
        .eq("status", "Failed");

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Failed email logs cleared successfully" });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "Email ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("email_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Email log deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete email" },
      { status: 500 }
    );
  }
}
