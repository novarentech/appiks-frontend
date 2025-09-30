import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Appiks - Platform Kesehatan Mental Siswa",
  description: "Platform kesehatan mental untuk siswa yang menyediakan layanan konseling, tracking mood, dan konten edukatif.",
  keywords: ["kesehatan mental", "konseling", "siswa", "mood tracking"],
  authors: [{ name: "Appiks 2025" }],
  openGraph: {
    title: "Appiks - Platform Kesehatan Mental Siswa",
    description: "Platform kesehatan mental untuk siswa yang menyediakan layanan konseling, tracking mood, dan konten edukatif.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-white text-black min-h-screen font-sans"
      >
        <AuthProvider>
          <main className="w-full min-h-screen flex flex-col">{children}</main>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
