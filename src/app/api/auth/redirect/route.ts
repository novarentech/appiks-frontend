import { NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";

interface RedirectResponse {
  redirect: string;
  reason?: string;
}

export async function GET(): Promise<NextResponse<RedirectResponse>> {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { redirect: "/login", reason: "No authenticated session" },
        { status: 401 }
      );
    }

    const { user } = session;

    console.log("🔍 Processing login redirect for user:", {
      username: user.username,
      verified: user.verified,
      role: user.role,
      hasToken: !!user.token,
    });

    // 1. Check if user is verified
    if (user.verified === false) {
      console.log("📝 User not verified, redirecting to fill-data");
      return NextResponse.json({
        redirect: "/fill-data",
        reason: "User not verified",
      });
    }

    // 2. Check user role
    if (user.role !== "student") {
      console.log("👨‍🏫 Non-student user, redirecting to dashboard");
      return NextResponse.json({
        redirect: "/dashboard",
        reason: "Non-student user",
      });
    }

    // 3. Student user - check mood record
    console.log("🎓 Student user detected, checking mood record...");

    if (!user.token) {
      console.error("❌ No access token available for student");
      return NextResponse.json(
        { redirect: "/dashboard", reason: "No access token" },
        { status: 400 }
      );
    }

    try {
      console.log("🔄 Calling mood record API...");
      const moodResponse = await fetch(
        "https://appiks-be.disyfa.cloud/api/mood_record/check",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("📡 Mood API response status:", moodResponse.status);

      if (!moodResponse.ok) {
        console.error("❌ Mood API error:", {
          status: moodResponse.status,
          statusText: moodResponse.statusText,
        });
        return NextResponse.json({
          redirect: "/dashboard",
          reason: `Mood API error: ${moodResponse.status}`,
        });
      }

      const moodData = await moodResponse.json();
      console.log("📊 Mood API response data:", moodData);

      if (moodData.success && moodData.data?.can === true) {
        console.log("✅ Student can check in, redirecting to /checkin");
        return NextResponse.json({
          redirect: "/checkin",
          reason: "Student can check in",
        });
      } else {
        console.log("ℹ️ Student cannot check in, redirecting to dashboard");
        return NextResponse.json({
          redirect: "/dashboard",
          reason: "Student cannot check in",
        });
      }
    } catch (apiError) {
      console.error("❌ Error calling mood record API:", apiError);
      return NextResponse.json({
        redirect: "/dashboard",
        reason: "Mood API call failed",
      });
    }
  } catch (error) {
    console.error("❌ Error in redirect API:", error);
    return NextResponse.json(
      { redirect: "/login", reason: "Internal server error" },
      { status: 500 }
    );
  }
}
