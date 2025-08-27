"use client";

import { useAuthData } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UserProfile() {
  const { username, verified, token, expiresIn } = useAuthData();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Username</p>
          <p className="text-lg">{username || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Status</p>
          <Badge variant={verified ? "default" : "secondary"}>
            {verified ? "Verified" : "Not Verified"}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Token Expires</p>
          <p className="text-sm text-gray-600">
            {expiresIn}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div>
            <p className="text-sm font-medium text-gray-700">JWT Token (Dev)</p>
            <p className="text-xs text-gray-500 break-all font-mono">
              {token ? `${token.substring(0, 50)}...` : "N/A"}
            </p>
          </div>
        )}

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
