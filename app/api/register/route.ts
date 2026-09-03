import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { registrationSchema } from "@/lib/validations/schemas";
import { generateRegistrationId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Selected event does not exist" },
        { status: 404 }
      );
    }

    if (event.status !== "OPEN") {
      return NextResponse.json(
        { success: false, message: "Registration for this event is currently closed" },
        { status: 400 }
      );
    }

    // Upsert participant by email
    let participant = await prisma.participant.findUnique({
      where: { email: validatedData.email },
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          registrationId: generateRegistrationId(),
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          college: validatedData.college,
          department: validatedData.department,
          year: validatedData.year,
          gender: validatedData.gender || null,
        },
      });
    }

    // Check duplicate event registration for participant
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        participantId_eventId: {
          participantId: participant.id,
          eventId: event.id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          message: `Participant (${participant.name}) is already registered for ${event.title}`,
          registrationId: participant.registrationId,
        },
        { status: 400 }
      );
    }

    // Create Registration with Team Members if applicable
    const registration = await prisma.registration.create({
      data: {
        participantId: participant.id,
        eventId: event.id,
        teamName: validatedData.teamName || null,
        teamMembers:
          validatedData.teamMembers && validatedData.teamMembers.length > 0
            ? {
                create: [
                  {
                    memberName: participant.name,
                    memberEmail: participant.email,
                    memberPhone: participant.phone,
                    isLeader: true,
                  },
                  ...validatedData.teamMembers.map((m) => ({
                    memberName: m.name,
                    memberEmail: m.email,
                    memberPhone: m.phone || null,
                    isLeader: false,
                  })),
                ],
              }
            : undefined,
      },
      include: {
        event: true,
        participant: true,
        teamMembers: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        registrationId: participant.registrationId,
        eventTitle: event.title,
        participantName: participant.name,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.errors?.[0]?.message || error.message || "Failed to process registration",
      },
      { status: 400 }
    );
  }
}
