import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { QuestionType } from "@prisma/client";

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: QuestionType;
  points: number;
  options?: QuestionOption[];
}

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  courseId: z.string().min(1, "Course ID is required"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute").optional(),
  passingScore: z.number().min(1, "Passing score must be at least 1%").max(100, "Passing score cannot exceed 100%").optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, timeLimit, passingScore, questions } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Quiz title is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      );
    }

    // Get the default course (you might want to make this configurable)
    const defaultCourse = await prisma.course.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!defaultCourse) {
      return NextResponse.json(
        { error: "No course found. Please create a course first." },
        { status: 400 }
      );
    }

    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || undefined,
        timeLimit: timeLimit || 60,
        passingScore: passingScore || 70,
        courseId: defaultCourse.id,
        questions: {
          create: questions.map((q: Question) => ({
            text: q.text,
            type: q.type,
            points: q.points,
            options: {
              create: q.options?.map((opt: QuestionOption) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })) || [],
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Quiz created successfully",
      id: quiz.id,
    });
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create quiz" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';