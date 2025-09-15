import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
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

    const { tag } = await params;
    const tagId = tag;

    // Make request to the backend API
    const response = await fetch(`${API_BASE_URL}/video/tag/${tagId}`, {
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
        { success: false, message: "Failed to fetch videos by tag" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching videos by tag:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch videos by tag" },
      { status: 500 }
    );
  }
}
