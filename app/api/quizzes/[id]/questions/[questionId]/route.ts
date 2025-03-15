import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { QuestionType } from "@prisma/client";

const optionSchema = z.object({
  id: z.string().optional(),
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

export async function GET(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const questionId = params.questionId;

    // Fetch question details
    const question = await prisma.question.findFirst({
      where: { id: questionId },
      include: {
        options: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can update questions." },
        { status: 403 }
      );
    }

    const questionId = params.questionId;
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

    // Check if question exists
    const existingQuestion = await prisma.question.findFirst({
      where: { id: questionId },
      include: {
        options: true,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        text,
        type: type as QuestionType,
        points,
      },
    });

    // Handle options update if provided
    if (options) {
      // Delete existing options
      await prisma.questionOption.deleteMany({
        where: { questionId },
      });

      // Create new options
      await Promise.all(
        options.map(async (option: any) => {
          await prisma.questionOption.create({
            data: {
              text: option.text,
              isCorrect: option.isCorrect,
              questionId,
            },
          });
        })
      );
    }

    // Fetch updated question with options
    const questionWithOptions = await prisma.question.findFirst({
      where: { id: questionId },
      include: {
        options: true,
      },
    });

    return NextResponse.json(questionWithOptions);
  } catch (error) {
    console.error("Question update error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can delete questions." },
        { status: 403 }
      );
    }

    const questionId = params.questionId;

    // Check if question exists
    const existingQuestion = await prisma.question.findFirst({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Delete options first (to avoid foreign key constraints)
    await prisma.questionOption.deleteMany({
      where: { questionId },
    });

    // Delete question
    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Question deletion error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';