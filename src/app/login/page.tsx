"use client";

import { LoginForm } from "@/components/auth/LoginFormWrapper";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuthRedirect("/dashboard");

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-5xl">
          <div className="text-center">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will be redirected by hook)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <LoginForm />
      </div>
    </div>
  );
}