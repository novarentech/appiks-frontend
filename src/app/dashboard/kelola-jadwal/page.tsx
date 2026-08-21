"use client";

import { useState } from "react";
import PsychologistPanel from "@/components/dashboard/panels/PsychologistPanel";
import { WeeklyCalendar } from "@/components/dashboard/calendar/WeeklyCalendar";
import { AddScheduleDialog } from "@/components/dashboard/calendar/AddScheduleDialog";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

export default function KelolaJadwalPage() {
  return (
    <RoleGuard permissionType="kelola-jadwal">
      <KelolaJadwalContent />
    </RoleGuard>
  );
}

function KelolaJadwalContent() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kelola Jadwal Konsultasi"
        subtitle="Atur ketersediaan waktu untuk rujukan"
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-500 hover:bg-indigo-600">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        }
      />

      {/* Panel Statistik Khusus Psikolog */}
      <PsychologistPanel />
      
      {/* Table Kalender Mingguan */}
      <WeeklyCalendar />
      
      <AddScheduleDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onAdd={() => console.log("Added")}
        showRepeatOption={true}
      />
    </div>
  );
}
