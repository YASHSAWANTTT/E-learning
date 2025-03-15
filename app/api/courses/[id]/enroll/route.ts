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
        { error: "You must be logged in to enroll in a course" },
        { status: 401 }
      );
    }

    const courseId = params.id;
    const userId = session.user.id;

    console.log(`Enrolling user ${userId} in course ${courseId}`);

    // Check if course exists
    const course = await prisma.course.findFirst({
      where: { id: courseId }
    });

    if (!course) {
      console.log(`Course ${courseId} not found`);
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      console.log(`User ${userId} is already enrolled in course ${courseId}`);
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId
      }
    });

    console.log(`Enrollment created: ${JSON.stringify(enrollment)}`);

    return NextResponse.json(
      { message: "Successfully enrolled in course", enrollment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';