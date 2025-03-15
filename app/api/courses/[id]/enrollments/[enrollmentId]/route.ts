import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; enrollmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can remove enrollments." },
        { status: 403 }
      );
    }

    const courseId = params.id;
    const enrollmentId = params.enrollmentId;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Check if enrollment belongs to the specified course
    if (enrollment.courseId !== courseId) {
      return NextResponse.json(
        { error: "Enrollment does not belong to this course" },
        { status: 400 }
      );
    }

    // Delete enrollment
    await prisma.enrollment.delete({
      where: { id: enrollmentId }
    });

    return NextResponse.json(
      { message: "Enrollment removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing enrollment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Handle POST requests with _method=DELETE for form submissions
export async function POST(
  req: Request,
  { params }: { params: { id: string; enrollmentId: string } }
) {
  // Check if this is a method override
  const formData = await req.formData();
  const method = formData.get('_method');
  
  if (method === 'DELETE') {
    return DELETE(req, { params });
  }
  
  // If not a method override, return method not allowed
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export const dynamic = 'force-dynamic';