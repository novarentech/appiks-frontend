"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionDebugger() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("📊 Session Debug - Status:", status);
    console.log("📊 Session Debug - Data:", session);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="p-4 bg-yellow-100 rounded">🔄 Loading session...</div>
    );
  }

  if (!session) {
    return <div className="p-4 bg-red-100 rounded">❌ No session found</div>;
  }

  return (
    <div className="p-4 bg-blue-100 rounded space-y-2">
      <h3 className="font-bold text-blue-800">🐛 Session Debug Info</h3>
      <div className="text-sm space-y-1">
        <p>
          <strong>Username:</strong>{" "}
          {(session.user as { username?: string })?.username || "N/A"}
        </p>
        <p>
          <strong>Name:</strong> {session.user?.name || "N/A"}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {(session.user as { role?: string })?.role || "N/A"}
        </p>
        <p>
          <strong>Room:</strong>{" "}
          {(session.user as { room?: string })?.room || "N/A"}
        </p>
        <p>
          <strong>Mentor:</strong>{" "}
          {(session.user as { mentor?: string })?.mentor || "N/A"}
        </p>
        <p>
          <strong>School:</strong>{" "}
          {(session.user as { school?: string })?.school || "N/A"}
        </p>
        <p>
          <strong>Verified:</strong>{" "}
          {(session.user as { verified?: boolean })?.verified
            ? "✅ Yes"
            : "❌ No"}
        </p>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-blue-600 font-medium">
          🔍 Full Session Object
        </summary>
        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  );
}
