import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAdminSession } from "@/lib/auth/jwt";
import { questionSchema } from "@/lib/validations/schemas";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        _count: {
          select: { attempts: true },
        },
      },
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin quiz settings" },
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
    const validated = questionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        quizId: validated.quizId,
        questionText: validated.questionText,
        category: validated.category,
        points: validated.points,
        options: {
          create: validated.options,
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add question" },
      { status: 400 }
    );
  }
}
