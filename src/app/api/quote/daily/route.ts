import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session?.user?.token) {
      return NextResponse.json(
        { success: false, message: "No authentication token" },
        { status: 401 }
      );
    }

    console.log(
      "🔄 Proxying daily quote request with token:",
      session.user.token.substring(0, 10) + "..."
    );

    // Make request to the backend API
    const response = await fetch(`${API_BASE_URL}/quote/daily`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    console.log("📥 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        {
          success: false,
          message: `Backend error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Daily quote data received:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
