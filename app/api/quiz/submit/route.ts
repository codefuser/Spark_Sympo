import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { quizSubmissionSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = quizSubmissionSchema.parse(body);

    // Verify participant by registration ID or Email or ID
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          { id: validated.participantId },
          { registrationId: validated.participantId },
          { email: validated.participantId },
        ],
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: "Participant record not found. Please enter your registered Email or Registration ID (e.g. SPARK-2026-XXXX).",
        },
        { status: 404 }
      );
    }

    // Check if participant already attempted this quiz
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        participantId: participant.id,
        quizId: validated.quizId,
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already completed this quiz session.",
          attemptId: existingAttempt.id,
          score: existingAttempt.score,
          totalQuestions: existingAttempt.totalQuestions,
        },
        { status: 400 }
      );
    }

    // Fetch quiz & official correct options from DB
    const questions = await prisma.question.findMany({
      where: { quizId: validated.quizId },
      include: {
        options: true,
      },
    });

    let computedScore = 0;
    const answerRecords: {
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
    }[] = [];

    // Calculate score on server
    for (const q of questions) {
      const submittedAnswer = validated.answers.find((a) => a.questionId === q.id);
      const selectedOptId = submittedAnswer ? submittedAnswer.selectedOptionId : null;

      const correctOpt = q.options.find((o) => o.isCorrect);
      const isCorrect = correctOpt ? correctOpt.id === selectedOptId : false;

      if (isCorrect) {
        computedScore += q.points;
      }

      answerRecords.push({
        questionId: q.id,
        selectedOptionId: selectedOptId,
        isCorrect,
      });
    }

    // Create Quiz Attempt in Database
    const attempt = await prisma.quizAttempt.create({
      data: {
        participantId: participant.id,
        quizId: validated.quizId,
        score: computedScore,
        totalQuestions: questions.length,
        timeTakenSeconds: validated.timeTakenSeconds,
        answers: {
          create: answerRecords,
        },
      },
      include: {
        participant: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully!",
      attemptId: attempt.id,
      score: computedScore,
      totalQuestions: questions.length,
      timeTakenSeconds: validated.timeTakenSeconds,
      participantName: participant.name,
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.errors?.[0]?.message || error.message || "Quiz submission failed",
      },
      { status: 400 }
    );
  }
}
