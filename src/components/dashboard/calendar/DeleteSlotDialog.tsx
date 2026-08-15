"use client"

import { ScheduleSlot } from "@/types/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"

interface DeleteSlotDialogProps {
  slot: ScheduleSlot | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (slot: ScheduleSlot) => void
}

export function DeleteSlotDialog({ slot, open, onOpenChange, onConfirm }: DeleteSlotDialogProps) {
  if (!slot) return null

  // Format date safely
  let dateFormatted = slot.date
  try {
    dateFormatted = format(parseISO(slot.date), "EEEE, d MMMM yyyy", { locale: id })
  } catch (e) {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Slot?</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Slot yang dihapus tidak akan muncul pada pilihan jadwal siswa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 border rounded-lg p-4 my-2">
          <div className="mb-3">
            <Label className="text-xs text-gray-500">Tanggal</Label>
            <p className="text-sm font-medium text-gray-800">{dateFormatted}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Waktu</Label>
            <p className="text-sm font-medium text-gray-800">{slot.startTime}-{slot.endTime} AM</p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4 sm:justify-between">
          <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button className="flex-1 bg-[#DE3545] hover:bg-red-600 text-white" onClick={() => onConfirm(slot)}>
            Hapus Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
