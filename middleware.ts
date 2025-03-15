import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    const isAuthenticated = !!token;
    const isAdmin = token?.role === "ADMIN";

    // Define protected routes that require authentication
    const protectedRoutes = ["/dashboard", "/profile", "/quizzes"];
    const isProtectedRoute = protectedRoutes.some((route) => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Define admin-only routes
    const adminRoutes = ["/admin"];
    const isAdminRoute = adminRoutes.some((route) => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Define auth routes (login/register)
    const authRoutes = ["/login", "/register"];
    const isAuthRoute = authRoutes.some((route) => 
      req.nextUrl.pathname.startsWith(route)
    );

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && isProtectedRoute) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // Redirect non-admin users away from admin pages
    if (!isAdmin && isAdminRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of any error, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}