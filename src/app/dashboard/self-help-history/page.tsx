"use client";

import GratitudeDataTable from "@/components/data-display/tables/GratitudeDataTable";
import GroundingDataTable from "@/components/data-display/tables/GroundingDataTable";
import JournalingDataTable from "@/components/data-display/tables/JournalingDataTable";
import SensoryDataTable from "@/components/data-display/tables/SensoryDataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Heart, Wind } from "lucide-react";

export default function SchoolMonitorPage() {
  return <SelfHelpPageContent />;
}

function SelfHelpPageContent() {
  return (
    <div className="space-y-6">
      <div className="sm:flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold">
            Riwayat Self Help Diego Mendoza
          </h1>
          <p className="text-gray-600 mt-2">
            Pantau aktivitas self help siswa dan lihat hasilnya
          </p>
        </div>
      </div>
      <Tabs defaultValue="daily-journaling">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 bg-gray-50 rounded-lg p-1 mb-4 sm:mb-6">
          <TabsTrigger
            value="daily-journaling"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm min-h-[44px] sm:min-h-0"
          >
            <BookOpen className="h-4 w-4" />
            Daily Journaling
          </TabsTrigger>
          <TabsTrigger
            value="gratitude-journal"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm min-h-[44px] sm:min-h-0"
          >
            <Heart className="h-4 w-4" />
            Gratitude Journal
          </TabsTrigger>
          <TabsTrigger
            value="grounding-technique"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm min-h-[44px] sm:min-h-0"
          >
            <Brain className="h-4 w-4" />
            Grounding Technique
          </TabsTrigger>
          <TabsTrigger
            value="sensory-relaxation"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm min-h-[44px] sm:min-h-0"
          >
            <Wind className="h-4 w-4" />
            Sensory Relaxation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily-journaling" className="space-y-4">
          <JournalingDataTable />
        </TabsContent>
        <TabsContent value="gratitude-journal">
          <GratitudeDataTable />
        </TabsContent>
        <TabsContent value="grounding-technique">
          <GroundingDataTable />
        </TabsContent>
        <TabsContent value="sensory-relaxation">
          <SensoryDataTable/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
