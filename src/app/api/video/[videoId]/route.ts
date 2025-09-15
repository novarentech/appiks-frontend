import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session?.user?.token) {
      return NextResponse.json(
        { success: false, message: "No authentication token" },
        { status: 401 }
      );
    }

    const { videoId } = await params;

    // Make request to the backend API
    const response = await fetch(`${API_BASE_URL}/video/${videoId}`, {
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
        { success: false, message: "Failed to fetch video details" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch video details" },
      { status: 500 }
    );
  }
}
