import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Export the handler as both GET and POST
export { handler as GET, handler as POST };

// Add this for compatibility
export const dynamic = 'force-dynamic';