import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const attempts = await prisma.quizAttempt.findMany({
      take: limit,
      orderBy: [
        { score: "desc" },
        { timeTakenSeconds: "asc" },
        { completedAt: "asc" },
      ],
      include: {
        participant: {
          select: {
            name: true,
            college: true,
            department: true,
          },
        },
      },
    });

    const leaderboard = attempts.map((attempt, index) => ({
      rank: index + 1,
      id: attempt.id,
      participantName: attempt.participant.name,
      college: attempt.participant.college,
      department: attempt.participant.department,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      timeTakenSeconds: attempt.timeTakenSeconds,
      completedAt: attempt.completedAt,
    }));

    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
