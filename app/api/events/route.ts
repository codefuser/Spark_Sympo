import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAdminSession } from "@/lib/auth/jwt";
import { eventSchema } from "@/lib/validations/schemas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { technicalRegistrations: true, nonTechnicalRegistrations: true },
        },
      },
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create event" },
      { status: 400 }
    );
  }
}
