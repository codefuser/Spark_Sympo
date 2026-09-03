import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
