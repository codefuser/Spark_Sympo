import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const eventId = searchParams.get("eventId");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { college: { contains: search } },
        { registrationId: { contains: search } },
      ];
    }

    if (eventId) {
      where.registrations = {
        some: { eventId },
      };
    }

    const participants = await prisma.participant.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        registrations: {
          include: {
            event: true,
            teamMembers: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, participants });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch participants data" },
      { status: 500 }
    );
  }
}
