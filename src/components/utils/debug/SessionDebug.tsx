"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionDebug() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Session Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>Status:</strong> {status}
          </div>
          <div>
            <strong>Username:</strong> {session.user.username}
          </div>
          <div>
            <strong>Verified:</strong>{" "}
            <span
              className={
                session.user.verified ? "text-green-600" : "text-red-600"
              }
            >
              {session.user.verified ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div>
            <strong>Name:</strong> {session.user.name || "Not set"}
          </div>
          <div>
            <strong>Role:</strong> {session.user.role || "Not set"}
          </div>
          <div>
            <strong>Room:</strong> {session.user.room || "Not set"}
          </div>
          <div>
            <strong>Mentor:</strong> {session.user.mentor || "Not set"}
          </div>
          <div>
            <strong>School:</strong> {session.user.school || "Not set"}
          </div>
          <div>
            <strong>Token (first 20 chars):</strong>{" "}
            {session.user.token?.substring(0, 20)}...
          </div>
          <div>
            <strong>Expires In:</strong> {session.user.expiresIn}
          </div>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600">
            View Full Session Object
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
