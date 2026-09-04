import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";
import { getAdminSession } from "@/lib/auth/jwt";

// 1. UPDATE Registration Pass & Participants (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const regId = params.id;
    const body = await request.json();
    const { technicalEventId, nonTechnicalEventId, teamName, registrationType, paymentStatus, transactionId, participants } = body;

    // Update main registration row
    const { data: updatedRegs, error: regErr } = await supabase
      .from("registrations")
      .update({
        technical_event_id: technicalEventId,
        non_technical_event_id: nonTechnicalEventId,
        team_name: teamName || null,
        registration_type: registrationType || "online",
        payment_status: paymentStatus || "UNPAID",
        transaction_id: transactionId || null,
      })
      .eq("id", regId)
      .select();

    if (regErr) {
      return NextResponse.json({ success: false, message: `Failed to update pass: ${regErr.message}` }, { status: 500 });
    }

    if (!updatedRegs || updatedRegs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Update operation was blocked by Supabase RLS policies. Please run the SQL command to disable RLS in Supabase SQL Editor." },
        { status: 403 }
      );
    }

    // Update participants: delete old ones and insert updated ones
    if (participants && Array.isArray(participants)) {
      await supabase.from("participants").delete().eq("registration_id", regId);

      const supaParticipants = participants.map((p: any, idx: number) => ({
        registration_id: regId,
        full_name: p.fullName,
        email: p.email.trim().toLowerCase(),
        phone: p.phone,
        college: p.college,
        department: p.department || "ECE",
        food_preference: p.foodPreference || "Veg",
        is_team_leader: idx === 0,
      }));

      await supabase.from("participants").insert(supaParticipants);
    }

    return NextResponse.json({ success: true, message: "Registration pass updated successfully", registration: updatedRegs[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to update registration" }, { status: 500 });
  }
}

// 2. DELETE Registration Pass (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const regId = params.id;

    // Delete participants first then registration row from Supabase
    await supabase.from("participants").delete().eq("registration_id", regId).select();
    const { data: delRegs, error: regErr } = await supabase
      .from("registrations")
      .delete()
      .eq("id", regId)
      .select();

    if (regErr) {
      console.error("Database delete error:", regErr);
      return NextResponse.json(
        { success: false, message: `Failed to delete from database: ${regErr.message}` },
        { status: 500 }
      );
    }

    if (!delRegs || delRegs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Delete operation was blocked by Supabase RLS policies. Please run the SQL command to disable RLS in Supabase SQL Editor." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, message: "Registration pass deleted successfully from database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to delete registration" }, { status: 500 });
  }
}

// 3. QUICK UPDATE Payment Status (PATCH)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const regId = params.id;
    const { paymentStatus } = await request.json();

    const { data: updatedRegs, error: patchErr } = await supabase
      .from("registrations")
      .update({ payment_status: paymentStatus })
      .eq("id", regId)
      .select();

    if (patchErr) {
      return NextResponse.json({ success: false, message: `Failed to update payment status: ${patchErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payment status updated successfully", registration: updatedRegs?.[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to update payment status" }, { status: 500 });
  }
}
