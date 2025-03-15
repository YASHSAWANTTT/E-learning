import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  courseId: z.string().min(1, "Course ID is required"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute").optional(),
  passingScore: z.number().min(1, "Passing score must be at least 1%").max(100, "Passing score cannot exceed 100%").optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id;

    // Fetch quiz details
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can update quizzes." },
        { status: 403 }
      );
    }

    const quizId = params.id;
    const body = await req.json();
    
    // Validate input
    const result = quizSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, description, courseId, timeLimit, passingScore } = body;

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findFirst({
      where: { id: quizId }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findFirst({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Update quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title,
        description,
        courseId,
        timeLimit: timeLimit || existingQuiz.timeLimit,
        passingScore: passingScore || existingQuiz.passingScore,
      },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Quiz update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can delete quizzes." },
        { status: 403 }
      );
    }

    const quizId = params.id;

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findFirst({
      where: { id: quizId }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Delete all questions and options first
    const questions = await prisma.question.findMany({
      where: { quizId },
    });

    for (const question of questions) {
      await prisma.questionOption.deleteMany({
        where: { questionId: question.id },
      });
    }

    await prisma.question.deleteMany({
      where: { quizId },
    });

    // Delete quiz attempts
    await prisma.quizAttempt.deleteMany({
      where: { quizId },
    });

    // Delete quiz
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz deletion error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';