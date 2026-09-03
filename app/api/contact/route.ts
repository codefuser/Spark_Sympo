import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { contactSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received! Our symposium team will get back to you shortly.",
        id: message.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit message" },
      { status: 400 }
    );
  }
}
