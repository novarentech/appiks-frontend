"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";

function LoginFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Use the auth redirect hook
  const { isAuthenticated, isLoading: authLoading } =
    useAuthRedirect(callbackUrl);

  // Use session hook to get updated session after login
  const { update: updateSession } = useSession();

  // Use login redirect hook
  const { getRedirectUrl } = useLoginRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Username atau password salah");
      } else if (result?.ok) {
        console.log("✅ Login successful");

        // Force session update
        await updateSession();

        // Wait for session to be fully updated
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get redirect URL from centralized API
        const redirectUrl = await getRedirectUrl();
        console.log(`🚀 Redirecting to: ${redirectUrl}`);

        // Navigate to the determined URL
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <LoginFormSkeleton />;
  }

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:grid-cols-2 p-5">
          <div className="bg-muted relative hidden md:block rounded-l-lg overflow-hidden">
            <Image
              width={300}
              height={300}
              src="/image/imgPic.webp"
              alt="Image"
              priority
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <div className="p-4 md:px-10 md:py-14 flex flex-col items-center w-full">
            <Link
              href={"/"}
              className="text-3xl md:text-5xl text-center mb-8 flex items-center"
            >
              <Image
                src="/logo.webp"
                width={200}
                height={200}
                className=" h-14 w-14 md:h-20 md:w-20 mr-2 dark:invert"
                alt="Appiks Logo"
              />
              <span className="text-indigo-500 font-medium">Appiks</span>
            </Link>
            <form
              onSubmit={handleSubmit}
              className="border p-4 md:p-6 rounded-lg w-full max-w-xs"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <h1 className="font-bold text-lg md:text-xl">
                    Masuk ke Akun
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Isi data dibawah ini untuk masuk ke akun Anda
                  </p>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username anda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton component
function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:grid-cols-2 p-5">
          <div className="bg-muted relative hidden md:block rounded-l-lg overflow-hidden">
            <div className="absolute inset-0 h-full w-full bg-gray-200 animate-pulse" />
          </div>
          <div className="p-4 md:px-10 md:py-14 flex flex-col items-center w-full">
            <div className="h-12 w-32 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="border p-4 md:p-6 rounded-lg w-full max-w-xs">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid gap-3">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid gap-3">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginFormContent {...props} />
    </Suspense>
  );
}
