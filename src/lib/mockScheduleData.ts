import { ScheduleSlot } from "@/types/api";
import { startOfWeek, addDays, format, parseISO } from "date-fns";

export const getMockScheduleSlots = (weekStart: Date): ScheduleSlot[] => {
  // Always Monday of the week
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  return [
    {
      id: "slot-1",
      date: formatDate(addDays(start, 0)), // Senin
      startTime: "09:00",
      endTime: "10:00",
      status: "Tersedia",
    },
    {
      id: "slot-2",
      date: formatDate(addDays(start, 0)), // Senin
      startTime: "10:00",
      endTime: "11:00",
      status: "Menunggu Konfirmasi",
      studentName: "Siswa #A-2012",
    },
    {
      id: "slot-3",
      date: formatDate(addDays(start, 0)), // Senin
      startTime: "13:00",
      endTime: "14:00",
      status: "Terkonfirmasi",
      studentName: "Siswa #B-1930",
    },
    {
      id: "slot-4",
      date: formatDate(addDays(start, 1)), // Selasa
      startTime: "08:00",
      endTime: "09:00",
      status: "Tersedia",
    },
    {
      id: "slot-5",
      date: formatDate(addDays(start, 1)), // Selasa
      startTime: "14:00",
      endTime: "15:00",
      status: "Terkonfirmasi",
      studentName: "Siswa #C-5582",
    },
    {
      id: "slot-6",
      date: formatDate(addDays(start, 2)), // Rabu
      startTime: "10:00",
      endTime: "11:00",
      status: "Tersedia",
    },
    {
      id: "slot-7",
      date: formatDate(addDays(start, 3)), // Kamis
      startTime: "09:00",
      endTime: "10:00",
      status: "Menunggu Konfirmasi",
      studentName: "Siswa #D-7741",
    }
  ];
};
