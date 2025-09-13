import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.appiks.id/api/questionnaire", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch questionnaire",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Success",
      data: data.data,
    });
  } catch (error) {
    console.error("Questionnaire API error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
