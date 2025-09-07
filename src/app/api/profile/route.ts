import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

const API_BASE_URL =  process.env.API_BASE_URL;

export async function PATCH(request: Request) {
  const session = await auth(); // sekarang valid ✅

  if (!session?.user?.token) {
    return NextResponse.json(
      { success: false, message: "No authentication token" },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (!body.username || !body.phone || !body.password) {
    return NextResponse.json(
      { success: false, message: "Username, phone, and password are required" },
      { status: 422 }
    );
  }

  const backendUrl = `${API_BASE_URL}/profile`;

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
      password: body.password,
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
