import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";
import { registrationSchema } from "@/lib/validations/schemas";
import { generateRegistrationId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    const { technicalEventId, nonTechnicalEventId, participants: rawParticipants, teamName, registrationType, paymentStatus, transactionId, paymentProofUrl } = validatedData;

    // 1. Fetch events from Supabase
    const { data: techEvent, error: techErr } = await supabase
      .from("events")
      .select("*")
      .eq("id", technicalEventId)
      .maybeSingle();

    const { data: nonTechEvent, error: nonTechErr } = await supabase
      .from("events")
      .select("*")
      .eq("id", nonTechnicalEventId)
      .maybeSingle();

    if (techErr || !techEvent) {
      return NextResponse.json(
        { success: false, message: "Please select a valid Technical Event track." },
        { status: 400 }
      );
    }

    if (nonTechErr || !nonTechEvent) {
      return NextResponse.json(
        { success: false, message: "Please select a valid Non-Technical Event track." },
        { status: 400 }
      );
    }

    if (techEvent.category !== "TECHNICAL") {
      return NextResponse.json(
        { success: false, message: "Selected Technical Event is not a valid technical track." },
        { status: 400 }
      );
    }

    if (nonTechEvent.category !== "NON_TECHNICAL") {
      return NextResponse.json(
        { success: false, message: "Selected Non-Technical Event is not a valid non-technical track." },
        { status: 400 }
      );
    }

    // 2. Validate team size
    const maxAllowed = Math.max(techEvent.max_members || 5, nonTechEvent.max_members || 5);
    if (rawParticipants.length > maxAllowed) {
      return NextResponse.json(
        { success: false, message: `Maximum allowed team size for your selected events is ${maxAllowed} members.` },
        { status: 400 }
      );
    }

    // 3. Normalize emails
    const normalizedParticipants = rawParticipants.map((p, idx) => ({
      ...p,
      email: p.email.trim().toLowerCase(),
      isTeamLeader: idx === 0,
    }));
    const emails = normalizedParticipants.map((p) => p.email);

    // 4. Duplicate check in Supabase
    try {
      const { data: existingRegs } = await supabase
        .from("registrations")
        .select("id")
        .or(`technical_event_id.eq.${techEvent.id},non_technical_event_id.eq.${nonTechEvent.id}`);

      if (existingRegs && existingRegs.length > 0) {
        const regIds = existingRegs.map((r: any) => r.id);
        const { data: dupParticipants } = await supabase
          .from("participants")
          .select("full_name, email, registration_id")
          .in("email", emails)
          .in("registration_id", regIds);

        if (dupParticipants && dupParticipants.length > 0) {
          const dup = dupParticipants[0];
          return NextResponse.json(
            { success: false, message: `Participant ${dup.full_name} (${dup.email}) is already registered for one of these events.` },
            { status: 400 }
          );
        }
      }
    } catch (dupErr) {
      console.warn("Duplicate check warning:", dupErr);
    }

    // 5. Generate registration code
    const regCode = generateRegistrationId();
    const regType = registrationType || "online";
    const payStatus = paymentStatus || (regType === "offline" ? "PAID" : transactionId ? "PAID" : "UNPAID");

    // 6. Insert registration into Supabase
    const { data: supaReg, error: regInsertErr } = await supabase
      .from("registrations")
      .insert({
        registration_code: regCode,
        registration_type: regType,
        technical_event_id: techEvent.id,
        non_technical_event_id: nonTechEvent.id,
        team_name: teamName || null,
        status: "CONFIRMED",
        payment_status: payStatus,
        transaction_id: transactionId || null,
        payment_proof_url: paymentProofUrl || null,
      })
      .select()
      .single();

    if (regInsertErr || !supaReg) {
      console.error("Supabase registration insert error:", regInsertErr);
      return NextResponse.json(
        { success: false, message: "Failed to create registration. Please try again." },
        { status: 500 }
      );
    }

    // 7. Insert participants into Supabase
    const supaParticipants = normalizedParticipants.map((p) => ({
      registration_id: supaReg.id,
      full_name: p.fullName,
      email: p.email,
      phone: p.phone,
      college: p.college,
      department: p.department || "ECE",
      food_preference: p.foodPreference,
      is_team_leader: p.isTeamLeader,
    }));

    const { error: partInsertErr } = await supabase
      .from("participants")
      .insert(supaParticipants);

    if (partInsertErr) {
      console.error("Supabase participants insert error:", partInsertErr);
      await supabase.from("registrations").delete().eq("id", supaReg.id);
      return NextResponse.json(
        { success: false, message: `Failed to save participants: ${partInsertErr.message}` },
        { status: 500 }
      );
    }

    // 8. Optional: also save to Prisma (local SQLite backup, skipped on Vercel)
    try {
      const { prisma } = await import("@/lib/database/prisma");
      await prisma.registration.create({
        data: {
          registrationCode: regCode,
          registrationType: regType,
          technicalEventId: techEvent.id,
          nonTechnicalEventId: nonTechEvent.id,
          teamName: teamName || null,
          status: "CONFIRMED",
          participants: {
            create: normalizedParticipants.map((p) => ({
              fullName: p.fullName,
              email: p.email,
              phone: p.phone,
              college: p.college,
              foodPreference: p.foodPreference,
              isTeamLeader: p.isTeamLeader,
            })),
          },
        },
      });
    } catch (prismaErr) {
      console.warn("Prisma backup skipped (Vercel/SQLite unavailable):", (prismaErr as any)?.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        registrationId: regCode,
        technicalEventTitle: techEvent.title,
        nonTechnicalEventTitle: nonTechEvent.title,
        participantName: normalizedParticipants[0].fullName,
        participantCount: normalizedParticipants.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.errors?.[0]?.message || error.message || "Failed to process registration",
      },
      { status: 400 }
    );
  }
}