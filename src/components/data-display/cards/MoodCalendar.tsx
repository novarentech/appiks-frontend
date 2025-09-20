"use client";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const moodConfig = {
  happy: {
    emoji: "/icon/ico-happy.webp",
    label: "Senang",
    color: "bg-green-100 text-green-800 border-green-200",
    hoverColor: "hover:bg-green-50",
    bgClass: "bg-green-500",
  },
  neutral: {
    emoji: "/icon/ico-neutral.webp",
    label: "Netral",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    hoverColor: "hover:bg-gray-50",
    bgClass: "bg-gray-500",
  },
  sad: {
    emoji: "/icon/ico-sad.webp",
    label: "Sedih",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    hoverColor: "hover:bg-blue-50",
    bgClass: "bg-blue-500",
  },
  angry: {
    emoji: "/icon/ico-angry.webp",
    label: "Marah",
    color: "bg-red-100 text-red-800 border-red-200",
    hoverColor: "hover:bg-red-50",
    bgClass: "bg-red-500",
  },
};

type MoodType = keyof typeof moodConfig;

export function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [moodData, setMoodData] = useState<Record<number, MoodType>>({});

  // Fetch API ketika bulan berubah
  useEffect(() => {
    const fetchMoods = async () => {
      const month = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      try {
        const res = await fetch(`/api/mood-record/${month}`);
        const json = await res.json();

        if (json.success && json.data) {
          const mapped: Record<number, MoodType> = {};
          json.data.forEach((item: { recorded: string; status: MoodType }) => {
            const day = new Date(item.recorded).getDate();
            mapped[day] = item.status;
          });
          setMoodData(mapped);
        } else {
          setMoodData({});
        }
      } catch (error) {
        console.error("Error fetching moods:", error);
        setMoodData({});
      }
    };

    fetchMoods();
  }, [currentDate]);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Hitung statistik mood
  const getMoodStats = () => {
    const moodCounts = { happy: 0, neutral: 0, sad: 0, angry: 0 };
    Object.values(moodData).forEach((mood) => {
      moodCounts[mood]++;
    });
    return moodCounts;
  };

  const moodStats = getMoodStats();
  const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            className="p-2 bg-white/20 rounded-full"
            whileHover={{ rotate: 10 }}
          >
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Kalender Mood
            </h3>
            <p className="text-purple-100 text-xs sm:text-sm">
              {totalMoods} hari tercatat bulan ini
            </p>
          </div>
        </div>

        {/* Navigasi bulan */}
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="text-white hover:bg-white/20 border-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <motion.div
            className="font-bold text-white text-lg sm:text-xl"
            key={`${currentMonth}-${currentYear}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentMonth} {currentYear}
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="text-white hover:bg-white/20 border-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Kalender */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-xs sm:text-sm font-semibold text-gray-500 p-2 text-center uppercase tracking-wide"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div key={index} className="relative aspect-square">
              {day ? (
                <motion.button
                  className={`w-full h-full flex flex-col items-center justify-center text-sm relative rounded-lg sm:rounded-xl transition-all duration-200 border-2 ${
                    moodData[day]
                      ? `${moodConfig[moodData[day]].hoverColor} ${
                          moodConfig[moodData[day]].color
                        }`
                      : "hover:bg-gray-50 border-transparent text-gray-700"
                  }`}
                  onClick={() => setHoveredDay(hoveredDay === day ? null : day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  onHoverStart={() => setHoveredDay(day)}
                  onHoverEnd={() => setHoveredDay(null)}
                >
                  <span
                    className={`font-medium text-xs sm:text-sm ${
                      moodData[day] ? "hidden sm:block sm:mb-1" : ""
                    }`}
                  >
                    {day}
                  </span>
                  {moodData[day] && (
                    <motion.div
                      className="w-6 h-6 sm:w-7 sm:h-7 relative"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Image
                        src={moodConfig[moodData[day]].emoji}
                        alt={moodConfig[moodData[day]].label}
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </motion.div>
                  )}
                  {hoveredDay === day && moodData[day] && (
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {moodConfig[moodData[day]].label}
                    </motion.div>
                  )}
                </motion.button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Legend & Stats */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {Object.entries(moodConfig).map(([moodKey, config]) => (
              <motion.div
                key={moodKey}
                className={`flex items-center space-x-1 sm:space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full ${config.color} border ${config.hoverColor} cursor-pointer`}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <Image
                    src={config.emoji}
                    alt={config.label}
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </span>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  {config.label}
                </span>
              </motion.div>
            ))}
          </div>

          {totalMoods > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                Distribusi Mood Bulan Ini
              </div>
              <div className="flex rounded-full overflow-hidden h-1.5 sm:h-2 bg-gray-200">
                {Object.entries(moodStats).map(([moodKey, count]) => {
                  const percentage = (count / totalMoods) * 100;
                  const config = moodConfig[moodKey as MoodType];
                  return percentage > 0 ? (
                    <motion.div
                      key={moodKey}
                      className={config.bgClass}
                      style={{ width: `${percentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
