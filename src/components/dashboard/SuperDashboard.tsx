"use client";

import { KeyRound } from "lucide-react";
import SchoolAndClassChart from "../data-display/charts/SchoolAndClass";
import { Button } from "../ui/button";
import TuPanel from "./panels/TuPanel";
import Link from "next/link";

export function SuperDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">Kendali Penuh Appiks</p>
      </div>
      <TuPanel />
      <SchoolAndClassChart />
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/dashboard/api-management">
            <KeyRound className="h-4 w-4" />
            Kelola API
          </Link>
        </Button>
      </div>
    </div>
  );
}
