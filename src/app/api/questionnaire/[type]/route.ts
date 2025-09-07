import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE_URL = "https://appiks-be.disyfa.cloud/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;

    // Validate type parameter
    if (!type || !["secure", "insecure"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid type parameter. Must be 'secure' or 'insecure'",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get authorization token from request headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token is required",
          data: null,
        },
        { status: 401 }
      );
    }

    // Fetch data from external API
    const externalApiUrl = `${EXTERNAL_API_BASE_URL}/questionnaire/${type}`;

    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch questionnaire data: ${response.statusText}`,
          data: null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data in the same format as expected
    return NextResponse.json({
      success: true,
      message: "Success",
      data: data.data || data, // Handle different response formats
    });
  } catch (error) {
    console.error("Error fetching questionnaire:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to questionnaire service",
          data: null,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;

    // Validate type parameter
    if (!type || !["secure", "insecure"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid type parameter. Must be 'secure' or 'insecure'",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get authorization token from request headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token is required",
          data: null,
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        {
          success: false,
          message: "Answers array is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Submit data to external API
    const externalApiUrl = `${EXTERNAL_API_BASE_URL}/questionnaire/${type}`;

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: body.answers,
      }),
    });

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Failed to submit questionnaire: ${response.statusText}`,
          data: null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data in the same format as expected
    return NextResponse.json({
      success: true,
      message: "Success",
      data: data.data || data, // Handle different response formats
    });
  } catch (error) {
    console.error("Error submitting questionnaire:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to questionnaire service",
          data: null,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
