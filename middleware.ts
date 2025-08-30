import { auth } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/checkin", "/videos"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const session = await auth();

    // Debug logging (remove in production)
    if (pathname === "/login") {
      console.log("🔍 Middleware - Login access attempt:", {
        path: pathname,
        hasSession: !!session,
        userAgent: request.headers.get("user-agent")?.slice(0, 50),
      });
    }

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Protect routes that require authentication
    if (isProtectedRoute && !session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is verified for protected routes
    if (isProtectedRoute && session && !session.user.verified) {
      console.log("🔄 Redirecting unverified user to fill-data");
      const fillDataUrl = new URL("/fill-data", request.url);
      return NextResponse.redirect(fillDataUrl);
    }

    // Redirect authenticated users away from login
    if (session && pathname === "/login") {
      console.log("✅ Redirecting authenticated user to dashboard");
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Redirect verified users away from fill-data to dashboard
    if (session && session.user.verified && pathname === "/fill-data") {
      console.log("✅ Redirecting verified user to dashboard");
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
