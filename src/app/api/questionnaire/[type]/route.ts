import { NextRequest, NextResponse } from "next/server";

interface SubmitSurveyBody {
  answers: string[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
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

    const { type } = await params;

    // Validate type
    if (type !== "secure" && type !== "insecure") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid type parameter. Must be 'secure' or 'insecure'",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body: SubmitSurveyBody = await req.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body. 'answers' must be an array",
        },
        { status: 400 }
      );
    }

    // Submit to external API
    const response = await fetch(
      `https://api.appiks.id/api/questionnaire/${type}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to submit questionnaire",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Survey submitted successfully",
      data: data.data,
    });
  } catch (error) {
    console.error("Submit questionnaire API error:", error);
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
