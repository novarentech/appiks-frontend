"use client";

import { motion } from "framer-motion";
import { InsecureSurveyResultData } from "@/types/survey";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileDisplay } from "./profile-display";
import { InfoCard } from "./info-card";
import { NotesCard } from "./notes-card";

interface InsecureResultCardProps {
  resultData: InsecureSurveyResultData;
  userName: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function InsecureResultCard({
  resultData,
  userName,
}: InsecureResultCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full max-w-2xl lg:max-w-4xl mx-auto min-h-[400px] sm:min-h-[500px] mt-10 sm:mt-20 border-0">
        <CardHeader className="p-4 sm:p-6 text-center">
          <motion.h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Hai {userName}, Selamat!
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Ekspedisimu berhasil mengungkap PROFIL PAHLAWAN mu:
          </motion.p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <ProfileDisplay
            imageSrc="/icon/ico-walk-3.webp"
            imageAlt={resultData.hero_name}
            name={resultData.hero_name}
            subtitle={`Kekuatan super: ${resultData.super_strength}`}
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Hero sections */}
            <InfoCard
              title="Kekuatan Super"
              content={resultData.super_strength}
              color="blue-600"
              className="lg:col-span-3"
            />

            <InfoCard
              title="Mode Belajar"
              content={resultData.learning_mode}
              color="yellow-500"
              className="lg:col-span-2"
              showImage
              imagePosition="left"
            />

            <InfoCard
              title="Bahan Bakar"
              content={resultData.motivation_fuel}
              color="sky-900"
              className="lg:col-span-1"
              showImage
              imagePosition="bottom"
            />

            {/* Notes Card */}
            <NotesCard content={resultData.note} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
