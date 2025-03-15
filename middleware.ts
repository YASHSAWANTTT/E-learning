import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret-key-at-least-32-chars"
  });
  
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile"];
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
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect non-admin users away from admin pages
  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};