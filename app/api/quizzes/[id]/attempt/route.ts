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
      console.log("No session found");
      return NextResponse.json(
        { error: "You must be logged in to take a quiz" },
        { status: 401 }
      );
    }

    const quizId = params.id;
    const userId = session.user.id;

    if (!userId) {
      console.log("No user ID found in session");
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

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

    // Mark any existing unsubmitted attempts as void
    await prisma.quizAttempt.updateMany({
      where: {
        userId,
        quizId,
        submitted: false
      },
      data: {
        submitted: true,
        score: 0,
        completedAt: new Date(),
        void: true
      }
    });

    // Create a new quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        startedAt: new Date(),
        submitted: false,
        void: false
      }
    });

    console.log(`Quiz attempt created: ${JSON.stringify(attempt)}`);

    return NextResponse.json(
      { message: "Quiz attempt started", attemptId: attempt.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz attempt error:", error);
    // More detailed error response
    return NextResponse.json(
      { 
        error: "Failed to create quiz attempt",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';