"use client"

import { ScheduleSlot } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

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
  let canDelete = false

  switch (slot.status) {
    case "Tersedia":
      borderColor = "border-green-200"
      bgColor = "bg-green-50"
      textColor = "text-green-800"
      badgeClass = "bg-green-100 text-green-700 hover:bg-green-200"
      canDelete = true
      break
    case "Menunggu Konfirmasi":
      borderColor = "border-yellow-200"
      bgColor = "bg-yellow-50"
      textColor = "text-yellow-800"
      badgeClass = "bg-orange-100 text-orange-700 hover:bg-orange-200"
      break
    case "Terkonfirmasi":
      borderColor = "border-blue-200"
      bgColor = "bg-blue-50"
      textColor = "text-blue-800"
      badgeClass = "bg-blue-100 text-blue-700 hover:bg-blue-200"
      break
  }

  return (
    <div className={`p-3 rounded-lg border ${borderColor} ${bgColor} mb-3 relative group`}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-1.5 h-1.5 rounded-full ${slot.status === 'Tersedia' ? 'bg-green-500' : slot.status === 'Menunggu Konfirmasi' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
        <p className={`font-semibold text-xs ${textColor}`}>
          {slot.startTime}-{slot.endTime}
        </p>
      </div>
      
      <Badge variant="secondary" className={`font-normal border-0 text-[10px] py-0 px-2 h-5 ${badgeClass}`}>
        {slot.status}
      </Badge>
      
      {slot.studentName && (
        <p className="text-xs text-gray-500 mt-2 font-medium">
          {slot.studentName}
        </p>
      )}

      {/* Delete Icon */}
      <button 
        className={`absolute bottom-2 right-2 p-1 rounded-sm ${canDelete ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
        disabled={!canDelete}
        onClick={() => canDelete && onDeleteClick && onDeleteClick(slot)}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
