import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";
import { prisma } from "@/lib/database/prisma";
import { contactSchema } from "@/lib/validations/schemas";

// POST: Submit a Contact Inquiry Message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    // 1. Try storing in Supabase contact_messages table
    const { data: supaMsg, error: supaErr } = await supabase
      .from("contact_messages")
      .insert({
        id: msgId,
        name: validated.name,
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
        status: "UNREAD",
        created_at: createdAt,
      })
      .select()
      .single();

    // Fallback: Try Prisma if Supabase table isn't created yet
    if (supaErr) {
      try {
        await prisma.contactMessage.create({
          data: {
            id: msgId,
            name: validated.name,
            email: validated.email.toLowerCase().trim(),
            phone: validated.phone,
            subject: validated.subject,
            message: validated.message,
            status: "UNREAD",
          } as any,
        });
      } catch (pErr) {
        console.warn("Prisma contact insert warning:", pErr);
      }
    }

    // 2. Check if student's email is already registered in participants table
    const { data: matchedParticipants } = await supabase
      .from("participants")
      .select("*, registrations(*)")
      .eq("email", validated.email.toLowerCase().trim());

    const isRegistered = Boolean(matchedParticipants && matchedParticipants.length > 0);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been logged! Our organizing desk will reach out to you shortly.",
        id: msgId,
        isRegistered,
        registrationDetails: matchedParticipants || [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit message" },
      { status: 400 }
    );
  }
}

// GET: Fetch All Contact Messages for Admin Notification Desk
export async function GET() {
  try {
    // 1. Fetch from Supabase contact_messages
    let messages: any[] = [];
    const { data: supaMsgs, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && supaMsgs) {
      messages = supaMsgs;
    } else {
      // Fallback to Prisma
      try {
        const pMsgs = await prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
        });
        messages = pMsgs.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || "",
          subject: m.subject,
          message: m.message,
          status: m.status,
          created_at: m.createdAt,
        }));
      } catch (pErr) {
        console.warn("Prisma fetch messages error:", pErr);
      }
    }

    // 2. Fetch all participants to cross-reference registered emails
    const { data: allParticipants } = await supabase
      .from("participants")
      .select("*, registrations(*)");

    // 3. Link registered student information to each message if email matches!
    const enrichedMessages = messages.map((msg) => {
      const matched = (allParticipants || []).filter(
        (p) => p.email && p.email.toLowerCase().trim() === msg.email?.toLowerCase().trim()
      );

      return {
        ...msg,
        isRegistered: matched.length > 0,
        participantDetails: matched,
      };
    });

    return NextResponse.json({
      success: true,
      count: enrichedMessages.length,
      unreadCount: enrichedMessages.filter((m) => m.status === "UNREAD").length,
      messages: enrichedMessages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// PATCH: Update Message Status (Mark as READ/UNREAD)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Message ID required" }, { status: 400 });
    }

    await supabase.from("contact_messages").update({ status: status || "READ" }).eq("id", id);

    try {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: status || "READ" },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Delete Message
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Message ID required" }, { status: 400 });
    }

    await supabase.from("contact_messages").delete().eq("id", id);

    try {
      await prisma.contactMessage.delete({ where: { id } });
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
