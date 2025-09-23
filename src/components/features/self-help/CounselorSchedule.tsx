"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createReport } from "@/lib/api";

// Custom time options (you can adjust as needed)
const TIME_OPTIONS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

export default function CounselorSchedule() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [room, setRoom] = useState("Ruang BK");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (date && time && topic && room) {
      setIsLoading(true);
      try {
        const response = await createReport({
          date: format(date, "yyyy-MM-dd"),
          time,
          topic,
          room,
        });

        if (response.success) {
          toast.success("Jadwal konseling berhasil dikirim!");
          // Reset form setelah berhasil
          setDate(undefined);
          setTime("");
          setTopic("");
          setRoom("Ruang BK");
          setSubmitted(false);

          // Navigasi ke dashboard setelah berhasil submit
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          toast.error(response.message || "Gagal mengirim jadwal konseling");
        }
      } catch (error) {
        console.error("Error creating report:", error);
        toast.error("Terjadi kesalahan saat mengirim jadwal konseling");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full mx-auto p-6 sm:p-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-full bg-indigo-100 p-2">
          <Clock className="text-indigo-400 w-7 h-7" />
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Jadwalkan Sesi Konseling
        </h1>
      </div>
      <p className="text-gray-500 mb-8">
        Pilih waktu yang paling sesuai dan nyaman untuk bertemu dengan Guru BK
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilih Tanggal */}
        <div>
          <Label htmlFor="date" className="font-semibold text-gray-700">
            Pilih Tanggal<span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between mt-2 text-left font-normal pr-10",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "dd/MM/yyyy") : "Pilih tanggal"}
                <Calendar className="ml-2 h-5 w-5 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 1}
              />
            </PopoverContent>
          </Popover>
          {submitted && !date && (
            <p className="text-xs text-red-500 mt-1">Tanggal wajib diisi</p>
          )}
        </div>
        {/* Pilih Jam */}
        <div>
          <Label htmlFor="time" className="font-semibold text-gray-700">
            Pilih Jam<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select onValueChange={setTime} value={time}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Pilih jam" />
            </SelectTrigger>
            <SelectContent className=" max-w-xs">
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && !time && (
            <p className="text-xs text-red-500 mt-1">Jam wajib diisi</p>
          )}
        </div>
        {/* Ruang Konseling */}
        <div>
          <Label htmlFor="room" className="font-semibold text-gray-700">
            Ruang Konseling<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="room"
            placeholder="Masukkan ruang konseling"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            className="mt-2"
          />
          {submitted && !room && (
            <p className="text-xs text-red-500 mt-1">Ruang wajib diisi</p>
          )}
        </div>
        {/* Topik Konseling */}
        <div>
          <Label htmlFor="topic" className="font-semibold text-gray-700">
            Topik Konseling<span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="topic"
            placeholder="Tulis topik mu disini"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="mt-2 min-h-40"
          />
          {submitted && !topic && (
            <p className="text-xs text-red-500 mt-1">Topik wajib diisi</p>
          )}
        </div>
        {/* Tombol Kirim */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={!date || !time || !topic || !room || isLoading}
          >
            {isLoading ? (
              <>
                Mengirim...
              </>
            ) : (
              <>
                Kirim
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
