"use client";

import { useState } from "react";
import PsychologistPanel from "@/components/dashboard/panels/PsychologistPanel";
import { WeeklyCalendar } from "@/components/dashboard/calendar/WeeklyCalendar";
import { AddScheduleDialog } from "@/components/dashboard/calendar/AddScheduleDialog";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { createPsychologistSlot } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

export default function KelolaJadwalPage() {
  return (
    <RoleGuard permissionType="kelola-jadwal">
      <KelolaJadwalContent />
    </RoleGuard>
  );
}

function KelolaJadwalContent() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddSubmit = async (data: { date: Date; startTime: string; endTime: string }) => {
    try {
      const response = await createPsychologistSlot({
        slot_date: format(data.date, "yyyy-MM-dd"),
        slot_start_time: data.startTime,
        slot_end_time: data.endTime,
      });
      if (response.success) {
        toast.success("Slot jadwal berhasil ditambahkan");
        setIsAddOpen(false);
        setRefreshKey((prev) => prev + 1); // trigger remount
      } else {
        toast.error(response.message || "Gagal menambahkan slot");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menambahkan slot");
    }
  };

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
      <WeeklyCalendar key={refreshKey} />
      
      <AddScheduleDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onAdd={handleAddSubmit}
        showRepeatOption={true}
      />
    </div>
  );
}
