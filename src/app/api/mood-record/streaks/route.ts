import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.token) {
      return NextResponse.json(
        { success: false, message: "No authentication token" },
        { status: 401 }
      );
    }

    // Make request to the backend API
    const response = await fetch(`${API_BASE_URL}/mood_record/streaks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    });

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

    return NextResponse.json(data);
  } catch (error) {
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
