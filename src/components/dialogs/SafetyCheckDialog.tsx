"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSafetyCheck } from "@/contexts/SafetyCheckContext";
import { useMoodRecordToday } from "@/hooks/useMoodRecordToday";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, ThumbsDown, ThumbsUp } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export function SafetyCheckDialog() {
  const {
    isDialogOpen,
    currentStep,
    closeDialog,
    nextStep,
    markSafetyCheckCompleted,
  } = useSafetyCheck();

  const { loading } = useMoodRecordToday();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Reset activeStep ke 1 hanya ketika dialog dibuka
  useEffect(() => {
    if (isDialogOpen) {
      setActiveStep(1);
    }
  }, [isDialogOpen]);

  // Sinkronisasi activeStep dengan currentStep dari context, tapi hanya jika activeStep belum diubah secara lokal
  useEffect(() => {
    // Hanya sinkronkan jika currentStep berubah dan activeStep masih 1
    // Ini mencegah stepper kembali ke step 1 setelah mencapai step 2
    if (currentStep !== activeStep && activeStep === 1) {
      setActiveStep(currentStep);
    }
  }, [currentStep, activeStep]);

  const handleFirstStepResponse = async (isSafe: boolean) => {
    setIsSubmitting(true);

    try {
      console.log(`User response (step 1): ${isSafe ? "Aman" : "Tidak Aman"}`);

      if (isSafe) {
        // Jika merasa aman, tutup dialog dan tandai pengecekan selesai
        markSafetyCheckCompleted();
        closeDialog();
      } else {
        // Jika tidak aman, lanjut ke step 2
        setActiveStep(2);

        // Tunggu sedikit sebelum mengupdate context untuk transisi yang halus
        setTimeout(() => {
          nextStep();
        }, 300);
      }
    } catch (error) {
      console.error("Error submitting first step response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecondStepResponse = async (needsHelp: boolean) => {
    setIsSubmitting(true);

    try {
      console.log(
        `User response (step 2): ${
          needsHelp ? "Perlu bantuan" : "Tidak perlu bantuan"
        }`
      );

      // Tandai pengecekan selesai
      markSafetyCheckCompleted();
      closeDialog();

      if (needsHelp) {
        // Jika perlu bantuan, redirect ke halaman share-thing
        router.push("/counselor-schedule");
      }
    } catch (error) {
      console.error("Error submitting second step response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
      <AlertDialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-center">
                  Apakah Kamu merasa sudah aman ?
                </AlertDialogTitle>
              </AlertDialogHeader>

              <div className="flex flex-col items-center justify-center my-6">
                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Image
                    src="/icon/ico-question-unsafe-1.webp"
                    alt="Insecure"
                    width={72}
                    height={72}
                  />
                </motion.div>
                <p className="text-center font-semibold mt-4">
                  Kami Siap Membantu
                </p>
                <AlertDialogDescription className="text-center">
                  Jika belum, kami akan membantu menindaklanjuti agar Anda
                  mendapat dukungan yang sesuai.
                </AlertDialogDescription>
              </div>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => handleFirstStepResponse(false)}
                  disabled={isSubmitting || loading}
                  className="sm:flex-1 bg-rose-500 hover:bg-rose-600"
                >
                  Tidak <ThumbsDown />
                </Button>
                <Button
                  onClick={() => handleFirstStepResponse(true)}
                  disabled={isSubmitting || loading}
                  className="sm:flex-1 bg-teal-600 hover:bg-green-700"
                >
                  Ya, saya aman <ThumbsUp />
                </Button>
              </AlertDialogFooter>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-center">
                  Apakah Kamu memerlukan bantuan dari BK?
                </AlertDialogTitle>
              </AlertDialogHeader>

              <div className="flex flex-col items-center justify-center my-6">
                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Image
                    src="/icon/ico-question-unsafe-2.webp"
                    alt="Insecure"
                    width={72}
                    height={72}
                  />
                </motion.div>
                <p className="text-center font-semibold mt-4">
                  Atur Jadwal Konseling mu
                </p>
                <AlertDialogDescription className="text-center">
                  Jika iya, silakan atur jadwal pertemuan dengan konselor.
                </AlertDialogDescription>
              </div>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => handleSecondStepResponse(false)}
                  disabled={isSubmitting}
                  variant="outline"
                  className="sm:flex-1"
                >
                  Tidak, terima kasih
                </Button>
                <Button
                  onClick={() => handleSecondStepResponse(true)}
                  disabled={isSubmitting}
                  className="sm:flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Atur jadwal konseling <Calendar />
                </Button>
              </AlertDialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  );
}
