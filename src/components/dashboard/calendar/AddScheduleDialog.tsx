"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { date: Date, startTime: string, endTime: string }) => Promise<void>
  showRepeatOption?: boolean
  initialDate?: Date
  disabledDate?: boolean
}

import { Repeat } from "lucide-react"
import { useEffect } from "react"

export function AddScheduleDialog({ open, onOpenChange, onAdd, showRepeatOption, initialDate, disabledDate }: AddScheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setDate(initialDate)
      setStartTime("")
      setEndTime("")
    }
  }, [open, initialDate])

  const handleSubmit = async () => {
    if (!date) return alert("Pilih tanggal terlebih dahulu")
    if (!startTime || !endTime) return alert("Pilih jam mulai dan selesai")
    
    setIsSubmitting(true)
    try {
      await onAdd({ date, startTime, endTime })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Jadwal</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Jadwal yang ditambahkan akan tersedia untuk siswa dengan rujukan aktif.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Tanggal <span className="text-red-500">*</span></Label>
            <DatePicker date={date} setDate={setDate} disabled={disabledDate} />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Jam Mulai <span className="text-red-500">*</span></Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="09:00 AM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00 AM</SelectItem>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-shrink-0 text-gray-400 pb-2">-</div>

            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Jam Selesai <span className="text-red-500">*</span></Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="10:00 AM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {showRepeatOption && (
          <div className="flex items-start gap-3 p-4 border rounded-xl bg-gray-50/50 my-2">
            <input 
              type="checkbox" 
              id="repeat-weekly" 
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-500 mt-0.5 flex-shrink-0 cursor-pointer"
              defaultChecked
            />
            <div className="space-y-1.5">
              <label htmlFor="repeat-weekly" className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 cursor-pointer">
                Ulangi setiap minggu <Repeat className="w-4 h-4 text-gray-800" />
              </label>
              <p className="text-[13px] text-gray-500 leading-snug">
                Slot ini akan otomatis muncul di minggu-minggu berikutnya pada hari & jam yang sama. Anda tetap bisa menghapus atau mengubahnya per minggu.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-3 mt-4">
          <Button variant="outline" className="flex-1 text-indigo-500 border-indigo-200 hover:bg-indigo-50" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Tambahkan Jadwal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
