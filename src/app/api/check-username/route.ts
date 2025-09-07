import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";

const API_BASE_URL =  process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking username availability:", username);

    // Get session to retrieve the access token
    const session = await auth();

    if (!session?.user?.token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/check-username?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("❌ Check username API error:", response.status);
      return NextResponse.json(
        { success: false, message: "Failed to check username" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Username check response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Check username proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
