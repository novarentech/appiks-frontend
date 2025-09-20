"use client";

import { motion } from "framer-motion";
import { NotificationCard } from "./NotificationCard";
import { MoodCalendar } from "./MoodCalendar";
import { StreakCard } from "../data-display/cards/StreakCard";
import { TipsCard } from "../data-display/cards/TipsCard";
import { QuoteCard } from "../data-display/cards/QuoteCard";
import { WelcomeCard } from "./WelcomeCard";

export function StudentDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="min-h-screen p-4 container mx-auto max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Welcome Card - Full Width */}
          <motion.div variants={itemVariants}>
            <WelcomeCard />
          </motion.div>

          {/* Quote Card */}
          <motion.div variants={itemVariants}>
            <QuoteCard />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StreakCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TipsCard />
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <NotificationCard />
          </motion.div>

          {/* Calendar */}
          <motion.div variants={itemVariants}>
            <MoodCalendar />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
