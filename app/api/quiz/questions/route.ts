import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { isActive: true },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                optionText: true,
                // Omit isCorrect to prevent client inspection score tampering!
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "No active quiz found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch quiz questions" },
      { status: 500 }
    );
  }
}
