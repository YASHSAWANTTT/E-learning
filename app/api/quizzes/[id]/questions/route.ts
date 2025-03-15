import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { QuestionType } from "@prisma/client";

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  text: z.string().min(3, "Question text must be at least 3 characters"),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"]),
  points: z.number().min(1, "Points must be at least 1"),
  options: z.array(optionSchema)
    .optional()
    .refine(
      (options) => !options || options.some((option) => option.isCorrect),
      {
        message: "At least one option must be marked as correct",
      }
    ),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can create questions." },
        { status: 403 }
      );
    }

    const quizId = params.id;
    const body = await req.json();
    
    // Validate input
    const result = questionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { text, type, points, options } = body;

    // Check if quiz exists
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        text,
        type: type as QuestionType,
        points,
        quizId,
      },
    });

    // Create options if provided
    if (options && options.length > 0) {
      await Promise.all(
        options.map(async (option: any) => {
          await prisma.questionOption.create({
            data: {
              text: option.text,
              isCorrect: option.isCorrect,
              questionId: question.id,
            },
          });
        })
      );
    }

    // Fetch the created question with options
    const createdQuestion = await prisma.question.findUnique({
      where: { id: question.id },
      include: { options: true },
    });

    return NextResponse.json(
      { message: "Question created successfully", question: createdQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Question creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id;

    // Fetch questions for the quiz
    const questions = await prisma.question.findMany({
      where: { quizId },
      include: {
        options: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions", details: error },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';