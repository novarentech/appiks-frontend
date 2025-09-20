"use client";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Smile,
  Meh,
  Frown,
  Angry,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const moodConfig = {
  happy: {
    emoji: "😊",
    label: "Senang",
    color: "bg-green-100 text-green-800 border-green-200",
    hoverColor: "hover:bg-green-50",
    icon: Smile,
    bgClass: "bg-green-500",
  },
  neutral: {
    emoji: "😐",
    label: "Netral",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    hoverColor: "hover:bg-gray-50",
    icon: Meh,
    bgClass: "bg-gray-500",
  },
  sad: {
    emoji: "😢",
    label: "Sedih",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    hoverColor: "hover:bg-blue-50",
    icon: Frown,
    bgClass: "bg-blue-500",
  },
  angry: {
    emoji: "😠",
    label: "Marah",
    color: "bg-red-100 text-red-800 border-red-200",
    hoverColor: "hover:bg-red-50",
    icon: Angry,
    bgClass: "bg-red-500",
  },
};

type MoodType = keyof typeof moodConfig;

export function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Mock mood data - simplified to only store mood type
  const moodData: Record<number, MoodType> = {
    1: "happy",
    2: "neutral",
    3: "sad",
    4: "happy",
    5: "happy",
    8: "neutral",
    9: "happy",
    10: "angry",
    11: "happy",
    12: "neutral",
    15: "happy",
    16: "sad",
    17: "sad",
    18: "happy",
    19: "happy",
    20: "happy",
    21: "happy",
    24: "angry",
    25: "neutral",
    29: "happy",
    30: "sad",
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
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

  // Helper function to get mood stats
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
        <div className="flex items-center justify-between mb-4">
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
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="text-white hover:bg-white/20 border-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          <motion.div
            className="font-bold text-white text-lg sm:text-xl"
            key={`${currentMonth}-${currentYear}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentMonth} {currentYear}
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="text-white hover:bg-white/20 border-0"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-xs sm:text-sm font-semibold text-gray-500 p-2 text-center uppercase tracking-wide"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
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
                  {/* Hide date on mobile when there's mood data, show on desktop */}
                  <span
                    className={`font-medium text-xs sm:text-sm ${
                      moodData[day] ? "hidden sm:block sm:mb-1" : ""
                    }`}
                  >
                    {day}
                  </span>
                  {moodData[day] && (
                    <motion.div
                      className="text-2xl sm:text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      {moodConfig[moodData[day]].emoji}
                    </motion.div>
                  )}

                  {/* Tooltip for hovered day */}
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

        {/* Mood Legend & Stats */}
        <div className="space-y-3 sm:space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {Object.entries(moodConfig).map(([moodKey, config]) => {
              return (
                <motion.div
                  key={moodKey}
                  className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-base sm:text-lg">{config.emoji}</span>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">
                    {config.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Mood Stats Bar */}
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
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span className="text-xs sm:text-sm">
                  Mood terbanyak:{" "}
                  {Object.entries(moodStats).reduce((a, b) =>
                    moodStats[a[0] as MoodType] > moodStats[b[0] as MoodType]
                      ? a
                      : b
                  )[0] === "happy"
                    ? "😊 Senang"
                    : Object.entries(moodStats).reduce((a, b) =>
                        moodStats[a[0] as MoodType] >
                        moodStats[b[0] as MoodType]
                          ? a
                          : b
                      )[0] === "neutral"
                    ? "😐 Netral"
                    : Object.entries(moodStats).reduce((a, b) =>
                        moodStats[a[0] as MoodType] >
                        moodStats[b[0] as MoodType]
                          ? a
                          : b
                      )[0] === "sad"
                    ? "😢 Sedih"
                    : "😠 Marah"}
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {Math.round(
                    (Math.max(...Object.values(moodStats)) / totalMoods) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
