import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to take a quiz" },
        { status: 401 }
      );
    }

    const quizId = params.id;
    const userId = session.user.id;

    console.log(`Creating quiz attempt for user ${userId} on quiz ${quizId}`);

    // Check if quiz exists
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId }
    });

    if (!quiz) {
      console.log(`Quiz ${quizId} not found`);
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Create a new quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId
      }
    });

    console.log(`Quiz attempt created: ${JSON.stringify(attempt)}`);

    return NextResponse.json(
      { message: "Quiz attempt started", attemptId: attempt.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz attempt error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';