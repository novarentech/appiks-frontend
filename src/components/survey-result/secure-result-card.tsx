"use client";

import { motion } from "framer-motion";
import { SecureSurveyResultData } from "@/types/survey";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileDisplay } from "./profile-display";
import { ProfileMixCard } from "./profile-mix-card";
import { InfoCard } from "./info-card";
import { CareerPathCard } from "./career-path-card";
import { NotesCard } from "./notes-card";

interface SecureResultCardProps {
  resultData: SecureSurveyResultData;
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

export function SecureResultCard({
  resultData,
  userName,
}: SecureResultCardProps) {
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
            Hai {userName}!
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Analisis kompasnya selesai!
          </motion.p>
          <motion.p
            className="text-sm sm:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Berdasarkan jawabanmu, kami melihat profil seorang:
          </motion.p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <ProfileDisplay
            imageSrc="/icon/ico-walk-3.webp"
            imageAlt={resultData.archetype.name}
            name={resultData.archetype.name}
            subtitle={`Kompasmu menunjuk pada: ${resultData.summary["Kompas Nilai"]}`}
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Mix Card */}
            <ProfileMixCard secondaryType={resultData.archetype.secondary} />

            {/* Summary Cards */}
            <InfoCard
              title="Kompas Nilai"
              content={`${resultData.summary["Kompas Nilai"]} Lorem ipsum dolor sit amet, consectetur adipisicing elit.`}
              color="yellow-500"
              className="lg:col-span-2"
              showImage
              imagePosition="right"
            />

            <InfoCard
              title="Peralatan Andalan"
              content={resultData.summary["Peralatan Andalan"]}
              color="sky-900"
              className="lg:col-span-1"
              showImage
              imagePosition="top"
            />

            <InfoCard
              title="Medan Ideal"
              content={resultData.summary["Medan Ideal"]}
              color="rose-500"
              className="lg:col-span-1"
              showImage
              imagePosition="bottom"
            />

            {/* Career Path Card */}
            <CareerPathCard careers={resultData.summary["Path Karir"]} />

            {/* Notes Card */}
            <NotesCard content={resultData.description} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
