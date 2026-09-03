import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { supabase } from "@/lib/database/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { eligible: false, message: "Please provide a valid registered email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Quiz Time Access Window
    const now = new Date();
    const quizSettings = await prisma.quizSettings.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (quizSettings) {
      if (now < quizSettings.startTime) {
        return NextResponse.json(
          {
            eligible: false,
            message: `Quiz has not started yet. Official Quiz Window starts at ${new Date(
              quizSettings.startTime
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
            status: "UPCOMING",
          },
          { status: 403 }
        );
      }

      if (now > quizSettings.endTime) {
        return NextResponse.json(
          {
            eligible: false,
            message: "Quiz window has ended. Questions are no longer accessible.",
            status: "EXPIRED",
          },
          { status: 403 }
        );
      }
    }

    // 2. Check Database Registration & Technical Quiz Selection
    const participant = await prisma.participant.findFirst({
      where: {
        email: normalizedEmail,
        registration: {
          technicalEvent: {
            slug: "technical-quiz",
          },
        },
      },
      include: {
        registration: {
          include: {
            technicalEvent: true,
            nonTechnicalEvent: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          eligible: false,
          message:
            "Access Denied: Email not registered for Technical Quiz. You must select 'Technical Quiz' during registration to enter.",
          status: "NOT_ELIGIBLE",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      eligible: true,
      participantName: participant.fullName,
      email: participant.email,
      registrationCode: participant.registration.registrationCode,
      technicalEvent: participant.registration.technicalEvent.title,
      nonTechnicalEvent: participant.registration.nonTechnicalEvent.title,
      durationMinutes: quizSettings?.durationMinutes || 30,
      status: "ACTIVE",
    });
  } catch (error: any) {
    console.error("Quiz eligibility verification error:", error);
    return NextResponse.json(
      { eligible: false, message: "Internal server verification failure." },
      { status: 500 }
    );
  }
}
