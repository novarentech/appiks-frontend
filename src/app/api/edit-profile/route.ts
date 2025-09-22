import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.token) {
    return NextResponse.json(
      { success: false, message: "No authentication token" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.username || !body.phone) {
    return NextResponse.json(
      { success: false, message: "Username and phone are required" },
      { status: 422 }
    );
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/edit-profile`;

  const response = await fetch(backendUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: body.username,
      phone: body.phone,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { success: false, message: errorText },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}