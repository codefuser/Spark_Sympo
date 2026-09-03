import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { supabase } from "@/lib/database/supabase";
import { registrationSchema } from "@/lib/validations/schemas";
import { generateRegistrationId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    // 1. Fetch Technical & Non-Technical Events
    const [techEvent, nonTechEvent] = await Promise.all([
      prisma.event.findUnique({ where: { id: validatedData.technicalEventId } }),
      prisma.event.findUnique({ where: { id: validatedData.nonTechnicalEventId } }),
    ]);

    if (!techEvent || techEvent.category !== "TECHNICAL") {
      return NextResponse.json(
        { success: false, message: "Please select a valid Technical Event track." },
        { status: 400 }
      );
    }

    if (!nonTechEvent || nonTechEvent.category !== "NON_TECHNICAL") {
      return NextResponse.json(
        { success: false, message: "Please select a valid Non-Technical Event track." },
        { status: 400 }
      );
    }

    if (techEvent.status !== "OPEN" || nonTechEvent.status !== "OPEN") {
      return NextResponse.json(
        { success: false, message: "One of your selected event tracks is currently closed for registration." },
        { status: 400 }
      );
    }

    // 2. Validate participant bounds
    const maxAllowedMembers = Math.max(techEvent.maxMembers, nonTechEvent.maxMembers);
    if (validatedData.participants.length > maxAllowedMembers) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum allowed team size for your selected event combination is ${maxAllowedMembers} members.`,
        },
        { status: 400 }
      );
    }

    // 3. Normalize Emails & Check Duplicate Registration
    const normalizedParticipants = validatedData.participants.map((p, idx) => ({
      ...p,
      email: p.email.trim().toLowerCase(),
      isTeamLeader: idx === 0,
    }));

    const emails = normalizedParticipants.map((p) => p.email);

    // Check if any participant is already registered for these events in Prisma or Supabase
    const existingParticipants = await prisma.participant.findMany({
      where: {
        email: { in: emails },
        registration: {
          OR: [
            { technicalEventId: techEvent.id },
            { nonTechnicalEventId: nonTechEvent.id },
          ],
        },
      },
      include: {
        registration: true,
      },
    });

    if (existingParticipants.length > 0) {
      const dup = existingParticipants[0];
      return NextResponse.json(
        {
          success: false,
          message: `Participant ${dup.fullName} (${dup.email}) is already registered for one of these events under pass: ${dup.registration.registrationCode}`,
        },
        { status: 400 }
      );
    }

    // 4. Generate Unique Registration Code
    const regCode = generateRegistrationId();
    const regType = validatedData.registrationType || "online";

    // 5. Insert into Local Database (Prisma)
    const dbRegistration = await prisma.registration.create({
      data: {
        registrationCode: regCode,
        registrationType: regType,
        technicalEventId: techEvent.id,
        nonTechnicalEventId: nonTechEvent.id,
        teamName: validatedData.teamName || null,
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
      include: {
        participants: true,
      },
    });

    // 6. Insert into Supabase Shared Cloud Database (Website 1, 2, 3 shared DB)
    try {
      // Find matching events in Supabase by slug
      let supaTechId: string | null = null;
      let supaNonTechId: string | null = null;

      const { data: sTech } = await supabase
        .from("events")
        .select("id")
        .eq("slug", techEvent.slug)
        .maybeSingle();

      const { data: sNonTech } = await supabase
        .from("events")
        .select("id")
        .eq("slug", nonTechEvent.slug)
        .maybeSingle();

      if (sTech) supaTechId = sTech.id;
      if (sNonTech) supaNonTechId = sNonTech.id;

      // If events don't exist in Supabase yet, insert them
      if (!supaTechId) {
        const { data: newTech } = await supabase
          .from("events")
          .insert({
            slug: techEvent.slug,
            title: techEvent.title,
            category: techEvent.category,
            short_desc: techEvent.shortDesc,
            full_desc: techEvent.fullDesc,
            min_members: techEvent.minMembers,
            max_members: techEvent.maxMembers,
          })
          .select()
          .single();
        if (newTech) supaTechId = newTech.id;
      }

      if (!supaNonTechId) {
        const { data: newNonTech } = await supabase
          .from("events")
          .insert({
            slug: nonTechEvent.slug,
            title: nonTechEvent.title,
            category: nonTechEvent.category,
            short_desc: nonTechEvent.shortDesc,
            full_desc: nonTechEvent.fullDesc,
            min_members: nonTechEvent.minMembers,
            max_members: nonTechEvent.maxMembers,
          })
          .select()
          .single();
        if (newNonTech) supaNonTechId = newNonTech.id;
      }

      const { data: supaReg, error: regError } = await supabase
        .from("registrations")
        .insert({
          registration_code: regCode,
          registration_type: regType,
          technical_event_id: supaTechId,
          non_technical_event_id: supaNonTechId,
          team_name: validatedData.teamName || null,
          status: "CONFIRMED",
        })
        .select()
        .single();

      if (regError) {
        console.error("Supabase Registration insert error:", regError);
      } else if (supaReg) {
        console.log("✅ Supabase Registration inserted successfully:", supaReg.registration_code);
        const supaParticipants = normalizedParticipants.map((p) => ({
          registration_id: supaReg.id,
          full_name: p.fullName,
          email: p.email,
          phone: p.phone,
          college: p.college,
          food_preference: p.foodPreference,
          is_team_leader: p.isTeamLeader,
        }));

        const { error: partError } = await supabase
          .from("participants")
          .insert(supaParticipants);

        if (partError) {
          console.error("Supabase Participants insert error:", partError);
        } else {
          console.log("✅ Supabase Participants inserted successfully:", supaParticipants.length);
        }
      }
    } catch (supaErr) {
      console.error("Supabase connection exception:", supaErr);
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
