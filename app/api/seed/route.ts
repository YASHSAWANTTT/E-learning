import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed-utils";

export async function GET() {
  try {
    console.log("Seed API route called");
    const session = await getServerSession(authOptions);
    
    // Allow seeding in development or by admin users
    if (process.env.NODE_ENV !== "production" || session?.user?.role === "ADMIN") {
      await seedDatabase();
      return NextResponse.json({ message: "Database seeded successfully" });
    }
    
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database", details: error }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';