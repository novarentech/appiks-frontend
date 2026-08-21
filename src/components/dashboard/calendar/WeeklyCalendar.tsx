"use client"

import { useState } from "react"
import { format, addDays, subDays, startOfWeek, endOfWeek, parseISO, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { ScheduleSlot, BackendPsychologistSlot } from "@/types/api"
import { toast } from "sonner"
import { createPsychologistSlot, deletePsychologistSlot, getPsychologistSlots } from "@/lib/api"
import { useEffect } from "react"
import { SlotCard } from "./SlotCard"
import { AddScheduleDialog } from "./AddScheduleDialog"
import { DeleteSlotDialog } from "./DeleteSlotDialog"

export function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Weekly bounds (Senin - Sabtu)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  
  // We only show 6 days: Senin to Sabtu
  const days = Array.from({ length: 6 }).map((_, i) => addDays(weekStart, i))
  
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [deleteSlot, setDeleteSlot] = useState<ScheduleSlot | null>(null)

  const fetchSlots = async () => {
    try {
      const startFmt = format(days[0], "yyyy-MM-dd")
      const endFmt = format(days[5], "yyyy-MM-dd")
      const response = await getPsychologistSlots(startFmt, endFmt)
      
      if (response.success && response.data) {
        // Map backend format to ScheduleSlot format
        const mappedSlots: ScheduleSlot[] = response.data.map((item: BackendPsychologistSlot) => {
          let status: ScheduleSlot["status"] = "Tersedia"
          if (item.status === "tentative") status = "Menunggu Konfirmasi"
          if (item.status === "booked") status = "Terkonfirmasi"

          return {
            id: item.id.toString(),
            date: item.slot_date,
            startTime: item.slot_start_time.substring(0, 5), // "08:00:00" -> "08:00"
            endTime: item.slot_end_time.substring(0, 5),
            status: status
          }
        })
        setSlots(mappedSlots)
      } else {
        setSlots([])
      }
    } catch (error) {
      console.error(error)
      toast.error("Gagal memuat jadwal dari server")
      setSlots([])
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [currentDate]) // Fetch slots whenever week changes

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const prevWeek = () => setCurrentDate(subDays(currentDate, 7))
  const goToCurrentWeek = () => setCurrentDate(new Date())

  // Formatting date range for header: e.g. "Minggu 27 Juli - 1 Agustus 2026"
  const startDateFmt = format(days[0], "d MMMM")
  const endDateFmt = format(days[5], "d MMMM yyyy")
  const dateRangeStr = `Minggu ${startDateFmt} - ${endDateFmt}`

  const handleDeleteConfirm = async (slot: ScheduleSlot) => {
    try {
      const response = await deletePsychologistSlot(slot.id)
      if (response.success) {
        toast.success("Slot berhasil dihapus")
        setDeleteSlot(null)
        fetchSlots()
      } else {
        toast.error(response.message || "Gagal menghapus slot")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan saat menghapus slot")
    }
  }

  const handleAddSubmit = async (data: { date: Date, startTime: string, endTime: string }) => {
    try {
      const response = await createPsychologistSlot({
        slot_date: format(data.date, "yyyy-MM-dd"),
        slot_start_time: data.startTime,
        slot_end_time: data.endTime
      })
      if (response.success) {
        toast.success("Slot jadwal berhasil ditambahkan")
        setIsAddOpen(false)
        fetchSlots()
      } else {
        toast.error(response.message || "Gagal menambahkan slot")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan saat menambahkan slot")
    }
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={prevWeek}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-100 flex items-center justify-center rounded-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            {dateRangeStr}
          </h3>
          <button 
            onClick={goToCurrentWeek}
            className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full font-medium"
          >
            Minggu Ini
          </button>
        </div>

        <button 
          onClick={nextWeek}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Legend & Header */}
      <div className="px-5 py-3 border-b flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <span className="font-medium mr-2">Status Slot:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Tersedia
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Menunggu Konfirmasi
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Terkonfirmasi
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Trash2 className="w-3 h-3" /> Hapus disabled = tidak dapat dihapus
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex overflow-x-auto min-w-[800px]">
        {days.map((day, idx) => {
          const dayName = format(day, "EEEE", { locale: id }).toUpperCase()
          const dayDate = format(day, "d")
          const dayMonth = format(day, "MMMM", { locale: id })
          
          // Find slots for this specific day
          const daySlots = slots.filter(slot => {
            try {
              return isSameDay(parseISO(slot.date), day)
            } catch (e) { return false }
          })
          
          return (
            <div key={idx} className={`flex-1 min-w-[150px] border-r last:border-r-0 border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
              <div className="py-4 text-center border-b">
                <p className="text-xs font-semibold text-gray-500">{dayName}</p>
                <p className="text-xl font-bold text-gray-800 leading-tight mt-1">{dayDate}</p>
                <p className="text-xs text-gray-500">{dayMonth}</p>
              </div>
              
              <div className="p-3 min-h-[300px]">
                {daySlots.map(slot => (
                  <SlotCard 
                    key={slot.id} 
                    slot={slot} 
                    onDeleteClick={(s) => setDeleteSlot(s)} 
                  />
                ))}
                
                <button 
                  onClick={() => {
                    setSelectedDay(day)
                    setIsAddOpen(true)
                  }}
                  className="w-full py-2.5 mt-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  + tambah
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <AddScheduleDialog 
        open={isAddOpen} 
        onOpenChange={(open) => {
          setIsAddOpen(open)
          if (!open) setSelectedDay(undefined)
        }} 
        onAdd={handleAddSubmit} 
        initialDate={selectedDay}
        disabledDate={true}
      />
      <DeleteSlotDialog slot={deleteSlot} open={!!deleteSlot} onOpenChange={(open) => !open && setDeleteSlot(null)} onConfirm={handleDeleteConfirm} />
    </div>
  )
}
