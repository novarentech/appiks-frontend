import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";

const API_BASE_URL =  process.env.API_BASE_URL ;

interface MoodRecordRequest {
  status: string;
}

interface MoodRecordResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    pesan: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get session to authenticate user
    const session = await auth();

    if (!session?.user?.token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "No authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: MoodRecordRequest = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Bad Request", message: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ["happy", "neutral", "sad", "angry"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Call external API
    const response = await fetch(`${API_BASE_URL}/mood_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify({ status: body.status }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("External API error:", response.status, errorData);

      return NextResponse.json(
        {
          error: "External API Error",
          message: `Failed to record mood: ${response.status}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data: MoodRecordResponse = await response.json();

    // Return the response with additional processing if needed
    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: {
        status: data.data.status,
        pesan: data.data.pesan,
        // Add additional fields for frontend processing
        isSafe: data.data.status === "Aman",
      },
    });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
