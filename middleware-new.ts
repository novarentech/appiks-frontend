import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/checkin", "/videos"];

// Cache untuk mood record check (untuk menghindari API call berulang)
const moodRecordCache = new Map<
  string,
  { result: boolean; timestamp: number }
>();
const CACHE_DURATION = 10000; // 10 seconds - shorter cache for faster updates

// Helper function to clear expired cache entries
function clearExpiredCache() {
  const now = Date.now();
  for (const [key, value] of moodRecordCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      moodRecordCache.delete(key);
    }
  }
}

// Helper function to check mood record with caching
async function checkStudentMoodRecord(token: string): Promise<boolean> {
  try {
    // Clear expired cache entries first
    clearExpiredCache();

    // Check cache first
    const cached = moodRecordCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("📚 Using cached mood record result:", cached.result);
      return cached.result;
    }

    console.log("🔄 Middleware - Checking mood record...");
    const apiBaseUrl =
      process.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/mood_record/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📡 Middleware - Mood API response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("📊 Middleware - Mood API data:", data);
      const canCheckIn = data.success && data.data?.can === true;

      // Cache the result
      moodRecordCache.set(token, { result: canCheckIn, timestamp: Date.now() });

      console.log("✅ Middleware - Can check in:", canCheckIn);
      return canCheckIn;
    }

    // Cache negative result too
    moodRecordCache.set(token, { result: false, timestamp: Date.now() });
    console.log("❌ Middleware - Mood API not ok, returning false");
    return false;
  } catch (error) {
    console.error("❌ Middleware - Error checking mood record:", error);
    // Cache error as false
    moodRecordCache.set(token, { result: false, timestamp: Date.now() });
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware triggered for path:", pathname);

  try {
    const session = await auth();

    // Debug logging for all dashboard access attempts
    if (pathname === "/dashboard") {
      console.log("🏠 Dashboard access attempt:", {
        hasSession: !!session,
        userRole: session?.user?.role,
        userVerified: session?.user?.verified,
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

    // Handle authenticated users
    if (session) {
      const { user } = session;

      // 1. If user not verified → always redirect to fill-data
      if (!user.verified) {
        if (pathname !== "/fill-data") {
          console.log("🔄 Redirecting unverified user to fill-data");
          const fillDataUrl = new URL("/fill-data", request.url);
          return NextResponse.redirect(fillDataUrl);
        }
        return NextResponse.next();
      }

      // 2. If verified user tries to access fill-data → redirect away
      if (user.verified && pathname === "/fill-data") {
        console.log("✅ Redirecting verified user away from fill-data");

        // For students, check mood record to determine redirect
        if (user.role === "student" && user.token) {
          const canCheckIn = await checkStudentMoodRecord(user.token);
          const redirectUrl = canCheckIn ? "/checkin" : "/dashboard";
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        // For non-students, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. If authenticated user tries to access login → redirect based on role/verified
      if (pathname === "/login") {
        console.log("✅ Redirecting authenticated user from login");

        if (!user.verified) {
          return NextResponse.redirect(new URL("/fill-data", request.url));
        }

        // For students, check mood record
        if (user.role === "student" && user.token) {
          const canCheckIn = await checkStudentMoodRecord(user.token);
          const redirectUrl = canCheckIn ? "/checkin" : "/dashboard";
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        // For non-students, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 4. Special handling for students - CRITICAL SECTION
      if (user.role === "student" && user.verified && user.token) {
        console.log("🎓 Processing student navigation:", {
          pathname,
          role: user.role,
          verified: user.verified,
          hasToken: !!user.token,
        });

        const canCheckIn = await checkStudentMoodRecord(user.token);
        console.log("📊 Student mood check result:", { canCheckIn, pathname });

        // FORCE REDIRECT: If student can check in but tries to access dashboard
        if (canCheckIn && pathname === "/dashboard") {
          console.log(
            "🚫 BLOCKING: Student with can=true trying to access dashboard"
          );
          console.log("🔄 REDIRECTING: Student from dashboard to checkin");
          const checkinUrl = new URL("/checkin", request.url);
          return NextResponse.redirect(checkinUrl);
        }

        // FORCE REDIRECT: If student cannot check in but tries to access checkin
        if (!canCheckIn && pathname === "/checkin") {
          console.log(
            "🚫 BLOCKING: Student with can=false trying to access checkin"
          );
          console.log("🔄 REDIRECTING: Student from checkin to dashboard");
          const dashboardUrl = new URL("/dashboard", request.url);
          return NextResponse.redirect(dashboardUrl);
        }

        console.log("✅ Student navigation allowed:", pathname);
      } else if (session?.user?.role === "student") {
        console.log("⚠️ Student but missing requirements:", {
          verified: session.user.verified,
          hasToken: !!session.user.token,
        });
      }
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
