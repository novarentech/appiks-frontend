"use client"

import { ScheduleSlot } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowUpRight } from "lucide-react"
import { isBefore, startOfDay, parseISO } from "date-fns"
import Link from "next/link"

interface SlotCardProps {
  slot: ScheduleSlot
  onDeleteClick?: (slot: ScheduleSlot) => void
}

export function SlotCard({ slot, onDeleteClick }: SlotCardProps) {
  // Determine styling based on status
  let borderColor = ""
  let bgColor = ""
  let textColor = ""
  let badgeClass = ""
  let dotColor = ""
  let canDelete = false

  switch (slot.status) {
    case "Tersedia":
      borderColor = "border-emerald-200"
      bgColor = "bg-emerald-50/70 hover:bg-emerald-50"
      textColor = "text-emerald-900"
      badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200"
      dotColor = "bg-emerald-500"
      
      const today = startOfDay(new Date())
      let slotDate = today
      try {
        slotDate = startOfDay(parseISO(slot.date))
      } catch (e) {
        // Fallback to today if parse fails
      }
      canDelete = !isBefore(slotDate, today)
      break

    case "Menunggu Konfirmasi":
      borderColor = "border-amber-300"
      bgColor = "bg-amber-50/80 hover:bg-amber-50"
      textColor = "text-amber-950"
      badgeClass = "bg-amber-100 text-amber-800 border-amber-300"
      dotColor = "bg-amber-500"
      canDelete = false
      break

    case "Terkonfirmasi":
      borderColor = "border-indigo-200"
      bgColor = "bg-indigo-50/70 hover:bg-indigo-50"
      textColor = "text-indigo-950"
      badgeClass = "bg-indigo-100 text-indigo-800 border-indigo-200"
      dotColor = "bg-indigo-600"
      canDelete = false
      break
  }

  return (
    <div className={`p-3 rounded-lg border ${borderColor} ${bgColor} mb-3 relative group transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]`}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
        <p className={`font-semibold text-xs ${textColor}`}>
          {slot.startTime} - {slot.endTime}
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <Badge variant="secondary" className={`font-medium border text-[10px] py-0 px-2 h-5 ${badgeClass}`}>
          {slot.status}
        </Badge>
      </div>
      
      {slot.studentName && (
        <p className="text-xs text-gray-600 mt-2 font-medium">
          {slot.studentName}
        </p>
      )}

      {/* Action link for tentative (Menunggu Konfirmasi) slots */}
      {slot.status === "Menunggu Konfirmasi" && (
        <div className="mt-2.5 pt-2 border-t border-amber-200/60">
          <Link
            href="/dashboard/rujukan-masuk"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 hover:underline"
          >
            <span>Review Rujukan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Delete Icon - only rendered for 'Tersedia' status */}
      {slot.status === "Tersedia" && (
        <button 
          className={`absolute bottom-2 right-2 p-1 rounded-sm ${canDelete ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
          disabled={!canDelete}
          title={canDelete ? "Hapus slot" : "Slot tanggal lampau tidak dapat dihapus"}
          onClick={() => canDelete && onDeleteClick && onDeleteClick(slot)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
